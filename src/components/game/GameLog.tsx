import { ScrollArea } from '@/components/ui/scroll-area';
import { useEffect, useRef } from 'react';

interface GameLogProps {
  log: string[];
}

export const GameLog = ({ log }: GameLogProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [log]);

  return (
    <div className="game-log rounded-xl p-4">
      <h3 className="text-game-gold font-bold mb-2 text-sm">📜 Histórico</h3>
      <ScrollArea className="h-32" ref={scrollRef}>
        <div className="space-y-1">
          {log.map((entry, index) => (
            <p key={index} className="text-xs text-muted-foreground animate-fade-in">
              {entry}
            </p>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
