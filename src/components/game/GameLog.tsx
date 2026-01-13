import { motion } from 'framer-motion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useEffect, useRef } from 'react';
import { Scroll } from 'lucide-react';

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
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="game-log rounded-2xl p-4"
    >
      <h3 className="text-game-gold font-bold mb-3 text-sm flex items-center gap-2">
        <Scroll className="w-4 h-4" />
        Histórico do Jogo
      </h3>
      <ScrollArea className="h-40" ref={scrollRef}>
        <div className="space-y-2 pr-4">
          {log.map((entry, index) => (
            <motion.p 
              key={index} 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.02 }}
              className="text-sm text-muted-foreground border-l-2 border-game-gold/30 pl-3 py-1"
            >
              {entry}
            </motion.p>
          ))}
        </div>
      </ScrollArea>
    </motion.div>
  );
};
