// Operational Transform (OT) Library for Collaborative Editing
// Implements transformation functions for concurrent text operations

export type Operation = 
  | { type: 'insert'; position: number; text: string; }
  | { type: 'delete'; position: number; length: number; }
  | { type: 'retain'; length: number; };

export interface TextOperation {
  ops: Operation[];
  baseVersion: number;
  clientId: string;
}

// Apply an operation to a string
export function applyOperation(text: string, op: Operation): string {
  switch (op.type) {
    case 'insert':
      return text.slice(0, op.position) + op.text + text.slice(op.position);
    case 'delete':
      return text.slice(0, op.position) + text.slice(op.position + op.length);
    case 'retain':
      return text;
    default:
      return text;
  }
}

// Transform two concurrent operations
export function transform(op1: Operation, op2: Operation, side: 'left' | 'right'): Operation {
  if (op1.type === 'insert' && op2.type === 'insert') {
    return transformInsertInsert(op1, op2, side);
  } else if (op1.type === 'insert' && op2.type === 'delete') {
    return transformInsertDelete(op1, op2);
  } else if (op1.type === 'delete' && op2.type === 'insert') {
    return transformDeleteInsert(op1, op2);
  } else if (op1.type === 'delete' && op2.type === 'delete') {
    return transformDeleteDelete(op1, op2);
  }
  return op1;
}

function transformInsertInsert(
  op1: Extract<Operation, { type: 'insert' }>,
  op2: Extract<Operation, { type: 'insert' }>,
  side: 'left' | 'right'
): Operation {
  if (op1.position < op2.position || (op1.position === op2.position && side === 'left')) {
    return op1;
  }
  return { ...op1, position: op1.position + op2.text.length };
}

function transformInsertDelete(
  op1: Extract<Operation, { type: 'insert' }>,
  op2: Extract<Operation, { type: 'delete' }>
): Operation {
  if (op1.position <= op2.position) {
    return op1;
  }
  if (op1.position >= op2.position + op2.length) {
    return { ...op1, position: op1.position - op2.length };
  }
  return { ...op1, position: op2.position };
}

function transformDeleteInsert(
  op1: Extract<Operation, { type: 'delete' }>,
  op2: Extract<Operation, { type: 'insert' }>
): Operation {
  if (op2.position <= op1.position) {
    return { ...op1, position: op1.position + op2.text.length };
  }
  if (op2.position >= op1.position + op1.length) {
    return op1;
  }
  return op1;
}

function transformDeleteDelete(
  op1: Extract<Operation, { type: 'delete' }>,
  op2: Extract<Operation, { type: 'delete' }>
): Operation {
  if (op1.position + op1.length <= op2.position) {
    return op1;
  }
  if (op1.position >= op2.position + op2.length) {
    return { ...op1, position: op1.position - op2.length };
  }
  const overlap = Math.min(op1.position + op1.length, op2.position + op2.length) - 
                  Math.max(op1.position, op2.position);
  return { ...op1, length: op1.length - overlap, position: Math.min(op1.position, op2.position) };
}


// Invert an operation (for undo functionality)
export function invertOperation(op: Operation, originalText: string): Operation {
  switch (op.type) {
    case 'insert':
      // Undo insert by deleting the inserted text
      return { type: 'delete', position: op.position, length: op.text.length };
    case 'delete':
      // Undo delete by inserting the deleted text back
      const deletedText = originalText.slice(op.position, op.position + op.length);
      return { type: 'insert', position: op.position, text: deletedText };
    case 'retain':
      return op;
    default:
      return op;
  }
}

// Compose two operations into a single operation
export function composeOperations(op1: Operation, op2: Operation): Operation[] {
  // Simple composition - can be enhanced for optimization
  return [op1, op2];
}
