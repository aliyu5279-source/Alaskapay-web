import { useState, useCallback, useRef, useEffect } from 'react';
import { Operation, invertOperation, transform, applyOperation } from '@/lib/operationalTransform';

interface HistoryEntry {
  operation: Operation;
  field: string;
  originalText: string;
  timestamp: number;
  version: number;
}

interface BatchHistoryEntry {
  id: string;
  operations: Operation[];
  field: string;
  timestamp: number;
  operationCount: number;
  preview: string;
  duration: number; // milliseconds from first to last operation
}

interface BatchConfig {
  enabled: boolean;
  delay: number; // milliseconds
  breakOnWordBoundary: boolean;
}

const DEFAULT_BATCH_CONFIG: BatchConfig = {
  enabled: true,
  delay: 500,
  breakOnWordBoundary: true
};


export function useUndoRedo(maxHistorySize = 50, batchConfig: Partial<BatchConfig> = {}) {
  const config = { ...DEFAULT_BATCH_CONFIG, ...batchConfig };
  const [undoStack, setUndoStack] = useState<HistoryEntry[]>([]);
  const [redoStack, setRedoStack] = useState<HistoryEntry[]>([]);
  const remoteOpsRef = useRef<Map<string, Operation[]>>(new Map());
  
  // Batch history tracking
  const [batchHistory, setBatchHistory] = useState<BatchHistoryEntry[]>([]);
  const batchOperationsRef = useRef<Operation[]>([]);
  const batchFirstTimestampRef = useRef<number | null>(null);
  
  // Batching state
  const pendingBatchRef = useRef<HistoryEntry | null>(null);
  const batchTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastCharRef = useRef<string>('');
  const [batchStartTime, setBatchStartTime] = useState<number | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);


  // Check if character is a word boundary or punctuation
  const isBreakChar = (char: string): boolean => {
    return /[\s.,!?;:\-—()[\]{}'"<>\/\\]/.test(char);
  };

  // Generate preview text from operation
  const generatePreview = (operation: Operation): string => {
    if (operation.type === 'insert') {
      return operation.text.length > 50 
        ? `"${operation.text.substring(0, 47)}..."` 
        : `"${operation.text}"`;
    } else if (operation.type === 'delete') {
      return `Deleted ${operation.length} character${operation.length > 1 ? 's' : ''}`;
    }
    return 'Unknown operation';
  };

  // Flush pending batch to undo stack and record in history
  const flushBatch = useCallback(() => {
    if (pendingBatchRef.current && batchOperationsRef.current.length > 0) {
      const endTime = Date.now();
      const startTime = batchFirstTimestampRef.current || endTime;
      const duration = endTime - startTime;
      
      // Create batch history entry
      const batchEntry: BatchHistoryEntry = {
        id: `batch-${endTime}`,
        operations: [...batchOperationsRef.current],
        field: pendingBatchRef.current.field,
        timestamp: endTime,
        operationCount: batchOperationsRef.current.length,
        preview: generatePreview(pendingBatchRef.current.operation),
        duration
      };
      
      setBatchHistory(prev => [...prev.slice(-99), batchEntry]); // Keep last 100 batches
      
      setUndoStack(prev => [...prev.slice(-maxHistorySize + 1), pendingBatchRef.current!]);
      pendingBatchRef.current = null;
      lastCharRef.current = '';
      batchOperationsRef.current = [];
      batchFirstTimestampRef.current = null;
    }
    if (batchTimerRef.current) {
      clearTimeout(batchTimerRef.current);
      batchTimerRef.current = null;
    }
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
    setBatchStartTime(null);
    setTimeRemaining(0);
  }, [maxHistorySize]);


  // Start countdown timer for visual indicator
  const startCountdown = useCallback(() => {
    const startTime = Date.now();
    setBatchStartTime(startTime);
    setTimeRemaining(config.delay);

    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
    }

    countdownIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, config.delay - elapsed);
      setTimeRemaining(remaining);

      if (remaining === 0) {
        clearInterval(countdownIntervalRef.current!);
        countdownIntervalRef.current = null;
      }
    }, 50); // Update every 50ms for smooth countdown
  }, [config.delay]);


  // Merge two operations if possible
  const mergeOperations = (op1: Operation, op2: Operation): Operation | null => {
    if (op1.type === 'insert' && op2.type === 'insert') {
      if (op1.position + op1.text.length === op2.position) {
        return { type: 'insert', position: op1.position, text: op1.text + op2.text };
      }
    } else if (op1.type === 'delete' && op2.type === 'delete') {
      if (op1.position === op2.position) {
        return { type: 'delete', position: op1.position, length: op1.length + op2.length };
      } else if (op2.position + op2.length === op1.position) {
        return { type: 'delete', position: op2.position, length: op1.length + op2.length };
      }
    }
    return null;
  };

  // Add operation with batching
  const pushOperation = useCallback((
    operation: Operation,
    field: string,
    originalText: string,
    version: number
  ) => {
    if (!config.enabled) {
      const entry: HistoryEntry = { operation, field, originalText, timestamp: Date.now(), version };
      setUndoStack(prev => [...prev.slice(-maxHistorySize + 1), entry]);
      setRedoStack([]);
      return;
    }

    // Track operation for batch history
    batchOperationsRef.current.push(operation);
    if (batchFirstTimestampRef.current === null) {
      batchFirstTimestampRef.current = Date.now();
    }

    // Check for break conditions
    let shouldBreak = false;
    if (config.breakOnWordBoundary && operation.type === 'insert') {
      const char = operation.text;
      shouldBreak = isBreakChar(char) || isBreakChar(lastCharRef.current);
      lastCharRef.current = char;
    }

    // Try to merge with pending batch
    if (pendingBatchRef.current && 
        pendingBatchRef.current.field === field && 
        !shouldBreak) {
      const merged = mergeOperations(pendingBatchRef.current.operation, operation);
      if (merged) {
        pendingBatchRef.current = {
          ...pendingBatchRef.current,
          operation: merged,
          timestamp: Date.now()
        };
        
        // Reset timer
        if (batchTimerRef.current) clearTimeout(batchTimerRef.current);
        batchTimerRef.current = setTimeout(flushBatch, config.delay);
        return;
      }
    }

    // Flush existing batch if can't merge
    if (pendingBatchRef.current) {
      flushBatch();
      // Reset for new batch
      batchOperationsRef.current = [operation];
      batchFirstTimestampRef.current = Date.now();
    }

    // Start new batch
    pendingBatchRef.current = { operation, field, originalText, timestamp: Date.now(), version };
    setRedoStack([]);
    batchTimerRef.current = setTimeout(flushBatch, config.delay);
    startCountdown(); // Start visual countdown
  }, [config, maxHistorySize, flushBatch, startCountdown]);



  // Track remote operations
  const trackRemoteOperation = useCallback((field: string, operation: Operation) => {
    const ops = remoteOpsRef.current.get(field) || [];
    ops.push(operation);
    remoteOpsRef.current.set(field, ops);
  }, []);

  // Undo last operation
  const undo = useCallback((getCurrentText: (field: string) => string) => {
    flushBatch(); // Flush any pending batch first
    if (undoStack.length === 0) return null;

    const entry = undoStack[undoStack.length - 1];
    const currentText = getCurrentText(entry.field);
    let invertedOp = invertOperation(entry.operation, entry.originalText);
    const remoteOps = remoteOpsRef.current.get(entry.field) || [];
    remoteOps.forEach(remoteOp => {
      invertedOp = transform(invertedOp, remoteOp, 'left');
    });
    const newText = applyOperation(currentText, invertedOp);
    setUndoStack(prev => prev.slice(0, -1));
    setRedoStack(prev => [...prev, entry]);
    return { field: entry.field, value: newText, operation: invertedOp };
  }, [undoStack, flushBatch]);

  // Redo operation
  const redo = useCallback((getCurrentText: (field: string) => string) => {
    flushBatch();
    if (redoStack.length === 0) return null;

    const entry = redoStack[redoStack.length - 1];
    const currentText = getCurrentText(entry.field);
    let operation = entry.operation;
    const remoteOps = remoteOpsRef.current.get(entry.field) || [];
    remoteOps.forEach(remoteOp => {
      operation = transform(operation, remoteOp, 'left');
    });
    const newText = applyOperation(currentText, operation);
    setRedoStack(prev => prev.slice(0, -1));
    setUndoStack(prev => [...prev, entry]);
    return { field: entry.field, value: newText, operation };
  }, [redoStack, flushBatch]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (batchTimerRef.current) clearTimeout(batchTimerRef.current);
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    };
  }, []);

  const canUndo = undoStack.length > 0 || pendingBatchRef.current !== null;
  const canRedo = redoStack.length > 0;

  // Calculate number of pending operations
  const getPendingOperationCount = (): number => {
    if (!pendingBatchRef.current) return 0;
    const op = pendingBatchRef.current.operation;
    if (op.type === 'insert') return op.text.length;
    if (op.type === 'delete') return op.length;
    return 1;
  };

  const isBatching = pendingBatchRef.current !== null;
  const pendingOperationCount = getPendingOperationCount();

  return {
    pushOperation,
    trackRemoteOperation,
    undo,
    redo,
    canUndo,
    canRedo,
    undoStack,
    redoStack,
    flushBatch,
    isBatching,
    pendingOperationCount,
    timeRemaining,
    batchDelay: config.delay,
    batchHistory
  };
}

export type { BatchHistoryEntry };


