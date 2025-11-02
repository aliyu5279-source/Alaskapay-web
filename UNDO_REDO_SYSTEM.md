# Undo/Redo System with Operational Transform

This document describes the undo/redo system implementation that works seamlessly with Operational Transform (OT) for collaborative editing in the report builder.

## Overview

The undo/redo system allows users to revert and reapply their own changes while respecting concurrent edits from other collaborators. It uses operation inversion and transformation to maintain consistency across all clients.

## Architecture

### Components

1. **useUndoRedo Hook** (`src/hooks/useUndoRedo.ts`)
   - Manages undo/redo stacks
   - Tracks remote operations for transformation
   - Inverts operations for undo
   - Re-applies operations for redo

2. **Operation Inversion** (`src/lib/operationalTransform.ts`)
   - `invertOperation()`: Creates inverse operations
   - Insert → Delete
   - Delete → Insert (with original text)

3. **Integration with CustomReportBuilder**
   - Keyboard shortcuts (Ctrl+Z, Ctrl+Y)
   - UI buttons with disabled states
   - Text field change handlers

## Key Features

### 1. Operation Tracking

```typescript
const { pushOperation, trackRemoteOperation, undo, redo, canUndo, canRedo } = useUndoRedo();

// Track local operations
pushOperation(operation, 'name', originalText, localVersion);

// Track remote operations for transformation
trackRemoteOperation(field, remoteOperation);
```

### 2. Keyboard Shortcuts

- **Ctrl+Z** (Cmd+Z on Mac): Undo last operation
- **Ctrl+Y** (Cmd+Y on Mac): Redo last undone operation
- **Ctrl+Shift+Z**: Alternative redo shortcut

### 3. Operation Inversion

```typescript
// Invert insert operation
{ type: 'insert', position: 5, text: 'hello' }
// Becomes
{ type: 'delete', position: 5, length: 5 }

// Invert delete operation
{ type: 'delete', position: 5, length: 5 }
// Becomes (with original text)
{ type: 'insert', position: 5, text: 'hello' }
```

### 4. Transformation with Concurrent Edits

When undoing in the presence of concurrent edits:

1. Retrieve the operation to undo from the stack
2. Invert the operation
3. Transform the inverted operation against all remote operations
4. Apply the transformed operation
5. Broadcast to other clients

## Usage

### Basic Undo/Redo

```typescript
// In your component
const handleUndo = useCallback(() => {
  const getCurrentText = (field: string) => {
    // Return current text for the field
    return fieldValue;
  };

  const result = undo(getCurrentText);
  if (result) {
    // Update UI with result.value
    // Broadcast result.operation to other clients
  }
}, [undo]);
```

### Text Field Integration

```typescript
const handleTextChange = useCallback((e) => {
  const oldValue = currentValue;
  const newValue = e.target.value;
  const operation = createTextOperation(oldValue, newValue, cursorPos);
  
  if (operation) {
    // Add to undo stack
    pushOperation(operation, fieldName, oldValue, version);
    
    // Broadcast to collaborators
    broadcastEdit(fieldName, newValue, operation);
  }
  
  setValue(newValue);
}, [currentValue, pushOperation, broadcastEdit]);
```

## Data Structures

### History Entry

```typescript
interface HistoryEntry {
  operation: Operation;      // The operation that was performed
  field: string;             // Field name (e.g., 'name', 'description')
  originalText: string;      // Text before the operation
  timestamp: number;         // When the operation occurred
  version: number;           // Document version at the time
}
```

### Undo/Redo Stacks

- **Undo Stack**: Stores operations that can be undone (most recent at end)
- **Redo Stack**: Stores operations that can be redone (most recent at end)
- **Remote Operations Map**: Tracks concurrent remote operations by field

## Conflict Resolution

### Scenario: Undo with Concurrent Insert

```
Initial: "Hello World"
User A: Deletes "World" → "Hello "
User B: Inserts "Beautiful " at position 6 → "Hello Beautiful World"
User A: Undos their delete

Steps:
1. Invert delete: Insert "World" at position 6
2. Transform against User B's insert at position 6
3. Adjusted insert: Insert "World" at position 16
4. Result: "Hello Beautiful World"
```

### Scenario: Undo with Concurrent Delete

```
Initial: "Hello World"
User A: Inserts "Beautiful " at position 6 → "Hello Beautiful World"
User B: Deletes "World" → "Hello "
User A: Undos their insert

Steps:
1. Invert insert: Delete 10 characters at position 6
2. Transform against User B's delete
3. Adjusted delete: Delete at adjusted position
4. Result: "Hello "
```


## Best Practices

### 1. Operation Batching

The system now includes intelligent operation batching (see [OPERATION_BATCHING.md](./OPERATION_BATCHING.md)):

```typescript
// Default batching (recommended)
const { pushOperation } = useUndoRedo(); // 500ms delay, word boundaries

// Custom batching configuration
const { pushOperation } = useUndoRedo(50, {
  delay: 1000,
  breakOnWordBoundary: true
});

// Disable batching for precise control
const { pushOperation } = useUndoRedo(50, { enabled: false });
```

Benefits:
- Groups rapid keystrokes into logical undo units
- Breaks on word boundaries for natural undo points
- Reduces stack size and improves performance
- Configurable delay and break behavior

### 2. Stack Management


```typescript
// Limit stack size to prevent memory issues
const { pushOperation } = useUndoRedo(50); // Max 50 operations

// Clear redo stack on new operation
setRedoStack([]); // Automatic in useUndoRedo
```

### 3. User Feedback

```typescript
// Provide visual feedback
toast.success('Undo successful');
toast.success('Redo successful');

// Disable buttons when stacks are empty
<Button disabled={!canUndo}>Undo</Button>
<Button disabled={!canRedo}>Redo</Button>
```

### 4. Field State Management

```typescript
// Use refs for field states to avoid stale closures
const fieldStates = useRef<Map<string, string>>(new Map());

// Update on changes
fieldStates.current.set(fieldName, newValue);
```

## Limitations

1. **Text Operations Only**: Currently supports insert/delete operations on text fields
2. **Single User Undo**: Each user can only undo their own operations
3. **Memory Usage**: Large undo stacks can consume memory
4. **Complex Transformations**: Some edge cases may require additional handling

## Future Enhancements

1. **Selective Undo**: Undo specific operations, not just the last one
2. **Undo Grouping**: Group related operations (e.g., word-level undo)
3. **Persistent History**: Save undo history to database
4. **Visual History**: Timeline view of all operations
5. **Undo Branching**: Support multiple undo/redo branches
6. **Operation Compression**: Merge similar consecutive operations

## Testing

### Manual Testing

1. Type text in a field
2. Press Ctrl+Z to undo
3. Press Ctrl+Y to redo
4. Have another user edit while you undo
5. Verify correct transformation

### Automated Testing

```typescript
describe('Undo/Redo System', () => {
  it('should undo insert operation', () => {
    const { pushOperation, undo } = useUndoRedo();
    pushOperation(insertOp, 'field', 'original', 1);
    const result = undo(() => 'current');
    expect(result.operation.type).toBe('delete');
  });

  it('should transform undo against remote operations', () => {
    const { pushOperation, trackRemoteOperation, undo } = useUndoRedo();
    pushOperation(localOp, 'field', 'text', 1);
    trackRemoteOperation('field', remoteOp);
    const result = undo(() => 'current');
    // Verify transformation occurred
  });
});
```

## Troubleshooting

### Issue: Undo doesn't work

- Check if operations are being pushed to the stack
- Verify `canUndo` is true
- Ensure `getCurrentText` function returns correct values

### Issue: Text becomes corrupted after undo

- Verify operation inversion is correct
- Check transformation logic
- Ensure remote operations are being tracked

### Issue: Keyboard shortcuts not working

- Check event listener is attached
- Verify no other handlers are preventing default
- Test with different key combinations

## Related Documentation

- [Operational Transform](./OPERATIONAL_TRANSFORM.md)
- [Real-time Collaboration](./REALTIME_COLLABORATION.md)
- [Custom Report Builder](./CUSTOM_REPORT_BUILDER.md)
