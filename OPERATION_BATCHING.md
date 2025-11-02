# Operation Batching System

This document describes the operation batching feature for the undo/redo system, which groups rapid consecutive keystrokes into single undo/redo operations.

## Overview

Operation batching improves the user experience by grouping related edits together, allowing users to undo/redo at a more natural granularity (words or phrases) rather than individual characters.

**Visual Indicator**: See [BATCHING_VISUAL_INDICATOR.md](./BATCHING_VISUAL_INDICATOR.md) for details on the real-time batching status display.


### 2. **Smart Word Boundary Detection**
Batching automatically breaks on word boundaries and punctuation, creating natural undo points:
- Spaces, tabs, newlines
- Punctuation: `. , ! ? ; : - — ( ) [ ] { } ' " < > / \`
- This ensures "undo" reverts logical chunks of text, not entire paragraphs

### 3. **Operation Merging**
Consecutive operations are intelligently merged:
- **Insert + Insert**: Merges if positions are adjacent
- **Delete + Delete**: Merges if positions overlap or are adjacent

### 4. **Automatic Flushing**
Pending batches are automatically flushed:
- After the delay timer expires
- When undo/redo is triggered
- When switching fields
- When a break character is typed

## Configuration

```typescript
const { pushOperation, undo, redo, canUndo, canRedo } = useUndoRedo(50, {
  enabled: true,              // Enable/disable batching
  delay: 500,                 // Milliseconds to wait before flushing
  breakOnWordBoundary: true   // Break batches on word boundaries
});
```

### Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `enabled` | boolean | `true` | Enable or disable operation batching |
| `delay` | number | `500` | Milliseconds to wait before flushing batch |
| `breakOnWordBoundary` | boolean | `true` | Break batches on spaces and punctuation |

## Usage Examples

### Basic Usage (Default Config)
```typescript
// Uses default batching: 500ms delay, word boundaries enabled
const undoRedo = useUndoRedo();
```

### Custom Configuration
```typescript
// Longer delay, no word boundary breaking
const undoRedo = useUndoRedo(50, {
  delay: 1000,
  breakOnWordBoundary: false
});
```

### Disable Batching
```typescript
// Each keystroke creates separate undo entry
const undoRedo = useUndoRedo(50, {
  enabled: false
});
```

## How It Works

### 1. Operation Tracking
When a user types, each change creates an operation:
```typescript
pushOperation(operation, field, originalText, version);
```

### 2. Batching Logic
- First operation starts a new batch
- Subsequent operations within the delay window are merged
- Timer resets on each new operation
- Break characters force immediate flush

### 3. Merging Algorithm
```typescript
// Insert operations
"H" + "e" + "l" + "l" + "o" → Single insert: "Hello"

// Delete operations  
Delete at pos 5 + Delete at pos 5 → Single delete: length 2
```

### 4. Word Boundary Detection
```typescript
"Hello" + " " → Flush (space is break char)
"world" → New batch starts
```

## Benefits

### Improved User Experience
- **Natural Undo Points**: Undo reverts words/sentences, not individual characters
- **Intuitive Behavior**: Matches user expectations from other text editors
- **Reduced Clutter**: Fewer entries in undo history

### Performance Optimization
- **Smaller Stack Size**: Fewer operations stored in memory
- **Faster Transformations**: Less operations to transform against
- **Reduced Network Traffic**: Fewer broadcasts in collaborative mode

## Integration with Operational Transform

Batching works seamlessly with OT:

1. **Pending Operations**: Batched operations are flushed before transformation
2. **Remote Operations**: Incoming edits trigger batch flush to maintain consistency
3. **Undo/Redo**: Automatically flushes pending batch before undoing

```typescript
// Undo automatically flushes pending batch
const handleUndo = () => {
  const result = undo(getCurrentText);
  // Pending batch is flushed first, then undo is applied
};
```

## Break Characters

The following characters trigger batch breaks:
- **Whitespace**: space, tab, newline
- **Punctuation**: `. , ! ? ; :`
- **Brackets**: `( ) [ ] { }`
- **Quotes**: `' " < >`
- **Separators**: `- — / \`

## Best Practices

### 1. Use Default Config for Text Editing
The default configuration (500ms, word boundaries) works well for most text editing scenarios.

### 2. Adjust Delay for Different Use Cases
- **Fast typists**: Increase delay to 750-1000ms
- **Slow typists**: Decrease delay to 300-400ms
- **Code editors**: Consider disabling word boundary breaking

### 3. Disable for Non-Text Fields
For numeric inputs or single-character fields, disable batching:
```typescript
useUndoRedo(50, { enabled: false });
```

### 4. Manual Flush When Needed
Call `flushBatch()` before critical operations:
```typescript
const { flushBatch } = useUndoRedo();

// Before saving
const handleSave = () => {
  flushBatch();
  saveDocument();
};
```

## Example: Typing Scenario

```
User types: "Hello world!"

Without batching:
- Undo 1: "Hello world" (removes !)
- Undo 2: "Hello worl" (removes d)
- Undo 3: "Hello wor" (removes l)
- ... 12 more undos to clear everything

With batching:
- Undo 1: "Hello world" (removes !)
- Undo 2: "Hello " (removes "world")
- Undo 3: "" (removes "Hello ")
```

## Technical Details

### Merge Conditions
Operations are merged if:
1. Same field
2. Within delay window
3. No break character typed
4. Operations are compatible (adjacent positions)

### Flush Triggers
Batch is flushed when:
1. Delay timer expires
2. Break character is typed
3. Field changes
4. Undo/redo is invoked
5. Component unmounts

## Monitoring and Debugging

### Check Batch Status
```typescript
const { undoStack, canUndo } = useUndoRedo();

console.log('Undo stack size:', undoStack.length);
console.log('Can undo:', canUndo);
```

### Verify Batching
Compare stack size with/without batching to verify it's working.
