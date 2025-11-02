# Operational Transform (OT) Implementation

## Overview

This document describes the Operational Transform (OT) algorithm implementation for real-time collaborative editing in the report builder. OT provides sophisticated conflict resolution that preserves user intent when multiple users edit the same document simultaneously.

## Architecture

### Core Components

1. **OT Library** (`src/lib/operationalTransform.ts`)
   - Transformation functions for concurrent operations
   - Operation types: insert, delete, retain
   - Conflict resolution algorithms

2. **Collaboration Hook** (`src/hooks/useReportCollaboration.ts`)
   - Manages WebSocket connections
   - Maintains pending operations queue
   - Applies transformations to incoming operations

## Operation Types

```typescript
type Operation = 
  | { type: 'insert'; position: number; text: string; }
  | { type: 'delete'; position: number; length: number; }
  | { type: 'retain'; length: number; };
```

### Insert Operation
Inserts text at a specific position:
```typescript
{ type: 'insert', position: 5, text: 'hello' }
```

### Delete Operation
Deletes text starting at a position:
```typescript
{ type: 'delete', position: 5, length: 3 }
```

### Retain Operation
Keeps existing text unchanged:
```typescript
{ type: 'retain', length: 10 }
```

## Transformation Algorithm

### Transform Function
The core `transform(op1, op2, side)` function takes two concurrent operations and transforms them to maintain consistency:

```typescript
const transformedOp = transform(clientOp, serverOp, 'left');
```

### Transformation Rules

#### Insert-Insert
- If positions differ: adjust position based on which came first
- If same position: use 'side' parameter to break tie

#### Insert-Delete
- Adjust insert position based on deleted range
- Handle edge cases where insert is within deleted range

#### Delete-Insert
- Adjust delete position based on inserted text length
- Preserve delete range relative to new content

#### Delete-Delete
- Calculate overlap between delete ranges
- Adjust length and position accordingly

## Usage in Report Builder

### 1. Creating Operations

```typescript
const { createTextOperation } = useReportCollaboration(reportId);

// Detect changes and create operation
const operation = createTextOperation(
  oldText,
  newText,
  cursorPosition
);
```

### 2. Broadcasting Edits with OT

```typescript
const { broadcastEdit } = useReportCollaboration(reportId);

// Send edit with operation
await broadcastEdit('report_name', newValue, operation);
```

### 3. Applying Remote Operations

```typescript
const { applyRemoteOperation, liveEdits } = useReportCollaboration(reportId);

// Apply incoming edit
useEffect(() => {
  liveEdits.forEach(edit => {
    if (edit.operation) {
      const newValue = applyRemoteOperation(edit, currentValue);
      // Update UI with transformed value
    }
  });
}, [liveEdits]);
```

## Pending Operations Queue

The system maintains a queue of operations that have been sent but not yet acknowledged by the server:

```typescript
interface PendingOperation {
  operation: Operation;
  field: string;
  baseVersion: number;
}
```

### Queue Management

1. **Add to Queue**: When sending an operation
2. **Transform Against Server Ops**: When receiving remote operations
3. **Remove from Queue**: After acknowledgment (timeout-based)

## Conflict Resolution

### Scenario 1: Concurrent Inserts

**User A**: Inserts "hello" at position 5
**User B**: Inserts "world" at position 5

**Resolution**: 
- One operation is transformed to position 10
- Both insertions are preserved
- Order determined by 'side' parameter

### Scenario 2: Insert During Delete

**User A**: Deletes characters 5-10
**User B**: Inserts "text" at position 7

**Resolution**:
- Insert position adjusted to 5 (start of delete range)
- Delete operation proceeds as planned
- Inserted text appears before remaining content

### Scenario 3: Overlapping Deletes

**User A**: Deletes characters 5-10
**User B**: Deletes characters 7-12

**Resolution**:
- Calculate overlap (7-10)
- Adjust lengths to avoid double-deletion
- Both operations execute with corrected ranges

## Version Control

### Server Version Tracking

```typescript
const serverVersion = useRef(0);

// Update on each received operation
if (edit.version > serverVersion.current) {
  serverVersion.current = edit.version;
}
```

### Local Version Management

```typescript
const [localVersion, setLocalVersion] = useState(0);

// Increment on each sent operation
setLocalVersion(v => v + 1);
```

## Best Practices

### 1. Text Field Integration

```typescript
const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const newValue = e.target.value;
  const cursorPos = e.target.selectionStart || 0;
  
  const operation = createTextOperation(oldValue, newValue, cursorPos);
  if (operation) {
    broadcastEdit(fieldName, newValue, operation);
  }
  
  setOldValue(newValue);
};
```

### 2. Handling Remote Updates

```typescript
useEffect(() => {
  const latestEdit = liveEdits[liveEdits.length - 1];
  if (latestEdit && latestEdit.operation && latestEdit.user_id !== currentUserId) {
    const transformed = applyRemoteOperation(latestEdit, currentValue);
    setValue(transformed);
  }
}, [liveEdits]);
```

### 3. Cursor Position Adjustment

When applying remote operations, adjust cursor position to maintain user context:

```typescript
const adjustCursorPosition = (
  cursorPos: number,
  operation: Operation
): number => {
  if (operation.type === 'insert' && operation.position <= cursorPos) {
    return cursorPos + operation.text.length;
  }
  if (operation.type === 'delete' && operation.position <= cursorPos) {
    return Math.max(operation.position, cursorPos - operation.length);
  }
  return cursorPos;
};
```

## Performance Considerations

### 1. Operation Batching
Batch multiple small operations to reduce network traffic:

```typescript
const batchOperations = (ops: Operation[]): Operation[] => {
  // Combine consecutive inserts/deletes
  // Return optimized operation list
};
```

### 2. Queue Size Management
Limit pending operations queue size:

```typescript
const MAX_PENDING_OPS = 50;
if (pendingOps.current.length > MAX_PENDING_OPS) {
  pendingOps.current = pendingOps.current.slice(-MAX_PENDING_OPS);
}
```

### 3. Debouncing
Debounce rapid text changes to reduce operation frequency:

```typescript
const debouncedBroadcast = debounce((field, value, operation) => {
  broadcastEdit(field, value, operation);
}, 100);
```

## Testing OT Implementation

### Test Concurrent Inserts
1. Open report in two browser windows
2. Position cursors at same location
3. Type simultaneously
4. Verify both texts appear in correct order

### Test Insert During Delete
1. User A selects and deletes text
2. User B inserts text in deleted range
3. Verify inserted text appears correctly

### Test Rapid Edits
1. Type quickly in one window
2. Verify all characters appear in other window
3. Check for missing or duplicated characters

## Limitations

### Current Implementation
- Simplified acknowledgment (timeout-based)
- No operation compression
- Limited to text operations

### Future Enhancements
- Server-side acknowledgments
- Operation history persistence
- Support for rich text operations
- Undo/redo with OT
- Operation compression algorithms

## Troubleshooting

### Issue: Lost Characters
**Cause**: Pending operations not properly transformed
**Solution**: Check transformation logic for edge cases

### Issue: Duplicate Text
**Cause**: Operation applied twice
**Solution**: Verify operation deduplication logic

### Issue: Cursor Jumps
**Cause**: Cursor position not adjusted for remote operations
**Solution**: Implement cursor position transformation

## References

- [Operational Transformation Paper](https://en.wikipedia.org/wiki/Operational_transformation)
- [Google Wave OT Implementation](https://svn.apache.org/repos/asf/incubator/wave/whitepapers/operational-transform/operational-transform.html)
- [ShareJS OT Library](https://github.com/share/sharedb)
