# Operation Batching Visual Indicator

This document describes the visual indicator system for the operation batching feature in the collaborative report editor.

## Overview

The batching visual indicator provides real-time feedback to users about the current batching state, showing when operations are being grouped together before creating an undo point.

## Visual Components

### Batching Indicator Badge

When operations are being batched, a prominent indicator appears near the undo/redo buttons showing:

- **Status**: "Batching..." text with a lightning bolt (⚡) icon
- **Operation Count**: Number of pending operations in the current batch
- **Countdown Timer**: Time remaining until the batch is automatically flushed (in seconds)
- **Manual Flush Button**: "Flush" button to immediately create an undo point

### Visual Design

```tsx
{isBatching && (
  <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-md animate-pulse">
    <Zap className="w-4 h-4 text-amber-600 dark:text-amber-400" />
    <div className="flex flex-col">
      <span className="text-xs font-medium text-amber-900 dark:text-amber-100">Batching...</span>
      <span className="text-[10px] text-amber-700 dark:text-amber-300">
        {pendingOperationCount} ops • {(timeRemaining / 1000).toFixed(1)}s
      </span>
    </div>
    <Button onClick={handleFlushBatch} size="sm" variant="ghost">
      Flush
    </Button>
  </div>
)}
```

## Features

### Real-Time Updates

- **Operation Counter**: Updates as characters are typed or deleted
- **Countdown Timer**: Updates every 50ms for smooth visual feedback
- **Pulse Animation**: Amber background pulses to draw attention

### Color Scheme

- **Light Mode**: Amber/yellow tones (amber-50, amber-200, amber-600)
- **Dark Mode**: Deep amber tones (amber-950, amber-800, amber-400)
- Provides clear visual distinction from other UI elements

### Manual Flush Button

Users can click the "Flush" button to:
- Immediately create an undo point
- Break the current batch
- Useful when users want to mark a specific point in their editing

## Integration

### Hook Values

The visual indicator uses values from `useUndoRedo`:

```typescript
const {
  isBatching,           // Boolean: true when batch is active
  pendingOperationCount, // Number: count of operations in batch
  timeRemaining,        // Number: milliseconds until auto-flush
  flushBatch           // Function: manually flush the batch
} = useUndoRedo();
```

### Countdown Calculation

The countdown timer displays remaining time in seconds:

```typescript
{(timeRemaining / 1000).toFixed(1)}s
```

This provides clear feedback like "0.5s", "1.2s", etc.

## User Experience

### When Batching Starts

1. User begins typing in a text field
2. Indicator appears with pulse animation
3. Operation count starts at 1
4. Timer shows full delay time (e.g., 0.5s)

### During Batching

1. Each keystroke increments the operation count
2. Timer resets to full delay on each keystroke
3. Pulse animation continues
4. User can see exactly how many operations are batched

### When Batch Completes

1. Timer reaches 0.0s
2. Indicator disappears
3. Undo point is created automatically
4. User can now undo the entire batch as one action

### Manual Flush

1. User clicks "Flush" button
2. Indicator disappears immediately
3. Toast notification confirms: "Batch flushed - undo point created"
4. Current batch becomes an undo point

## Benefits

### Transparency

Users can see exactly when their edits are being grouped together, removing any mystery about undo behavior.

### Control

The manual flush button gives users fine-grained control over undo points without disabling batching.

### Visual Feedback

The countdown timer and operation count provide clear, quantitative feedback about the batching state.

### Accessibility

- Clear text labels ("Batching...")
- High contrast colors
- Descriptive button text ("Flush")
- Tooltip on button: "Create undo point now"

## Configuration

The visual indicator automatically adapts to the batch configuration:

```typescript
const { isBatching, timeRemaining } = useUndoRedo(50, {
  enabled: true,
  delay: 500,              // Shown in countdown
  breakOnWordBoundary: true
});
```

## Best Practices

### When to Use Manual Flush

Users should click "Flush" when:
- Completing a logical editing unit (sentence, paragraph)
- Before switching to a different field
- When they want to ensure an undo point exists

### Visual Hierarchy

The indicator is positioned:
- Near undo/redo buttons (contextually relevant)
- Between undo/redo and collaborator indicators
- Uses amber color to stand out without being alarming

## Technical Details

### Update Frequency

- Countdown updates every 50ms via `setInterval`
- Smooth visual progression
- Minimal performance impact

### State Management

- `isBatching`: Derived from `pendingBatchRef.current !== null`
- `timeRemaining`: Calculated from batch start time
- `pendingOperationCount`: Derived from operation text length

### Cleanup

Countdown interval is properly cleaned up:
- On component unmount
- When batch is flushed
- When timer reaches zero

## Future Enhancements

Potential improvements:
- Progress bar visualization
- Sound notification on batch flush
- Customizable indicator position
- Batch history visualization
- Keyboard shortcut to flush (e.g., Ctrl+Shift+Z)
