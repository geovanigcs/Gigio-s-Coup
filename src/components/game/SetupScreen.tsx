import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Minus, Play, Crown, Swords, Shield, Skull } from 'lucide-react';
import { CHARACTERS, CARD_BACK_IMAGE } from '@/assets/characters';

interface SetupScreenProps {
  onStart: (playerNames: string[]) => void;
}

export const SetupScreen = ({ onStart }: SetupScreenProps) => {
  const [playerNames, setPlayerNames] = useState<string[]>(['Jogador 1', 'Jogador 2']);

  const addPlayer = () => {
    if (playerNames.length < 6) {
      setPlayerNames([...playerNames, `Jogador ${playerNames.length + 1}`]);
    }
  };

  const removePlayer = () => {
    if (playerNames.length > 2) {
      setPlayerNames(playerNames.slice(0, -1));
    }
  };

  const updateName = (index: number, name: string) => {
    const newNames = [...playerNames];
    newNames[index] = name;
    setPlayerNames(newNames);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 overflow-hidden">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 -left-20 w-96 h-96 bg-game-purple/10 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-1/4 -right-20 w-96 h-96 bg-game-gold/10 rounded-full blur-3xl"
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 4, repeat: Infinity, delay: 2 }}
        />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg space-y-8 relative z-10"
      >
        {/* Logo */}
        <motion.div 
          className="text-center space-y-4"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
        >
          <div className="flex justify-center items-center gap-4">
            <motion.div
              animate={{ rotateZ: [-5, 5, -5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Crown className="w-12 h-12 text-game-gold" />
            </motion.div>
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <Swords className="w-10 h-10 text-game-blood" />
            </motion.div>
          </div>
          <motion.h1 
            className="text-5xl font-bold text-game-gold tracking-wider"
            animate={{ 
              textShadow: [
                "0 0 20px rgba(212,175,55,0.3)",
                "0 0 40px rgba(212,175,55,0.6)",
                "0 0 20px rgba(212,175,55,0.3)"
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            GIGIO'S MINIGAME
          </motion.h1>
          <p className="text-muted-foreground text-lg">
            Um jogo de blefe, intriga e traição
          </p>
        </motion.div>

        {/* Character Preview */}
        <motion.div 
          className="flex justify-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {Object.values(CHARACTERS).map((char, index) => (
            <motion.div
              key={char.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              whileHover={{ scale: 1.1, y: -5 }}
              className="w-16 h-24 rounded-xl overflow-hidden shadow-lg cursor-pointer ring-2 ring-game-gold/30 hover:ring-game-gold/60 transition-all"
            >
              <img 
                src={char.image} 
                alt={char.namePortuguese}
                className="w-full h-full object-cover"
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Player Setup */}
        <motion.div 
          className="game-card p-6 rounded-2xl space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
              <Shield className="w-5 h-5 text-game-gold" />
              Jogadores ({playerNames.length})
            </h2>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={removePlayer}
                disabled={playerNames.length <= 2}
                className="hover:bg-game-blood/20 hover:border-game-blood"
              >
                <Minus className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={addPlayer}
                disabled={playerNames.length >= 6}
                className="hover:bg-game-gold/20 hover:border-game-gold"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <AnimatePresence>
            <div className="space-y-3">
              {playerNames.map((name, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Input
                    value={name}
                    onChange={(e) => updateName(index, e.target.value)}
                    placeholder={`Jogador ${index + 1}`}
                    className="bg-background/50 border-border/50 focus:border-game-gold focus:ring-game-gold/20 text-lg"
                  />
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        </motion.div>

        {/* Start Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Button
            onClick={() => onStart(playerNames)}
            className="w-full h-16 text-xl font-bold btn-gold relative overflow-hidden group"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
            />
            <Play className="w-6 h-6 mr-3" />
            Iniciar Jogo
          </Button>
        </motion.div>

        {/* Rules Summary */}
        <motion.div 
          className="text-center space-y-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
            <span>💰</span> Cada jogador começa com 2 moedas e 2 cartas de influência
          </p>
          <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
            <span>👑</span> O último com influência vence!
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};
