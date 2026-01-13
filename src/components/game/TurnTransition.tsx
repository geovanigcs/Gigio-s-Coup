import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';

interface TurnTransitionProps {
  nextPlayerName: string;
  onReady: () => void;
}

export const TurnTransition = ({ nextPlayerName, onReady }: TurnTransitionProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, type: "spring" }}
        className="text-center space-y-8 p-8"
      >
        <motion.div
          animate={{ 
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 1, repeat: Infinity, repeatDelay: 1 }}
        >
          <EyeOff className="w-20 h-20 text-game-gold mx-auto" />
        </motion.div>

        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-foreground">
            Passe o dispositivo para
          </h2>
          <motion.h1 
            className="text-5xl font-bold text-game-gold"
            animate={{ 
              textShadow: [
                "0 0 20px rgba(212,175,55,0.3)",
                "0 0 40px rgba(212,175,55,0.6)",
                "0 0 20px rgba(212,175,55,0.3)"
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {nextPlayerName}
          </motion.h1>
        </div>

        <p className="text-muted-foreground max-w-md">
          Apenas {nextPlayerName} deve ver a próxima tela. 
          Outros jogadores, virem para o lado!
        </p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Button
            onClick={onReady}
            className="btn-gold h-14 px-8 text-lg"
          >
            <Eye className="w-5 h-5 mr-2" />
            Sou {nextPlayerName}, estou pronto!
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};
