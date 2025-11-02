import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface EmojiPickerProps {
  onSelect: (emoji: string) => void;
}

const EMOJIS = [
  '😀', '😃', '😄', '😁', '😊', '😍', '🥰', '😘',
  '👍', '👎', '👏', '🙌', '🤝', '💪', '🙏', '✨',
  '❤️', '💙', '💚', '💛', '🧡', '💜', '🖤', '🤍',
  '🎉', '🎊', '🎈', '🎁', '🏆', '⭐', '✅', '❌'
];

export function EmojiPicker({ onSelect }: EmojiPickerProps) {
  return (
    <Card className="absolute bottom-16 right-0 p-2 w-64 shadow-lg">
      <div className="grid grid-cols-8 gap-1">
        {EMOJIS.map((emoji) => (
          <Button
            key={emoji}
            variant="ghost"
            size="sm"
            onClick={() => onSelect(emoji)}
            className="h-8 w-8 p-0 text-lg hover:bg-accent"
          >
            {emoji}
          </Button>
        ))}
      </div>
    </Card>
  );
}