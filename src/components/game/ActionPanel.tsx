import { motion } from 'framer-motion';
import { Player } from '@/types/game';
import { Button } from '@/components/ui/button';
import { CHARACTERS } from '@/assets/characters';
import { Coins, Shield, Crown, Skull } from 'lucide-react';

interface ActionPanelProps {
  currentPlayer: Player;
  players: Player[];
  onAction: (action: string, targetId?: string) => void;
  mustCoup: boolean;
}

export const ActionPanel = ({ currentPlayer, players, onAction, mustCoup }: ActionPanelProps) => {
  const otherAlivePlayers = players.filter(p => p.id !== currentPlayer.id && p.isAlive);

  if (mustCoup) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="action-panel p-6 rounded-2xl"
      >
        <motion.h3 
          className="text-game-blood font-bold text-xl mb-4 flex items-center gap-2"
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          <Skull className="w-6 h-6" />
          Golpe Obrigatório! (10+ moedas)
        </motion.h3>
        <div className="grid grid-cols-1 gap-3">
          {otherAlivePlayers.map(player => (
            <motion.div key={player.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                onClick={() => onAction('coup', player.id)}
                variant="destructive"
                className="w-full h-14 text-lg"
              >
                ⚔️ Golpe de Estado em {player.name}
              </Button>
            </motion.div>
          ))}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="action-panel p-6 rounded-2xl space-y-5"
    >
      <h3 className="text-game-gold font-bold text-xl flex items-center gap-2">
        <Crown className="w-6 h-6" />
        Sua Vez, {currentPlayer.name}!
      </h3>
      
      {/* Basic Actions */}
      <div className="space-y-3">
        <h4 className="text-sm text-muted-foreground font-semibold flex items-center gap-2">
          <Coins className="w-4 h-4" /> Ações Básicas (Sem Blefe)
        </h4>
        <div className="grid grid-cols-2 gap-3">
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Button onClick={() => onAction('income')} variant="secondary" className="w-full h-14 flex-col">
              <span className="text-lg">💰</span>
              <span className="text-xs">Renda (+1)</span>
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Button onClick={() => onAction('foreign_aid')} variant="secondary" className="w-full h-14 flex-col">
              <span className="text-lg">💰💰</span>
              <span className="text-xs">Ajuda Externa (+2)</span>
            </Button>
          </motion.div>
        </div>
        {currentPlayer.coins >= 7 && (
          <div className="grid grid-cols-2 gap-3">
            {otherAlivePlayers.map(player => (
              <motion.div key={player.id} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button
                  onClick={() => onAction('coup', player.id)}
                  variant="destructive"
                  className="w-full h-12"
                >
                  ⚔️ Golpe: {player.name}
                </Button>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Character Actions */}
      <div className="space-y-3">
        <h4 className="text-sm text-muted-foreground font-semibold flex items-center gap-2">
          <Shield className="w-4 h-4" /> Ações de Personagem (Pode Blefar!)
        </h4>
        
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button onClick={() => onAction('tax')} className="w-full h-14 action-duke gap-3 justify-start">
            <img src={CHARACTERS.duke.image} alt="Duke" className="w-10 h-10 rounded-lg object-cover" />
            <div className="text-left">
              <p className="font-bold">Duque: Taxar</p>
              <p className="text-xs opacity-80">Pegar 3 moedas</p>
            </div>
          </Button>
        </motion.div>
        
        {currentPlayer.coins >= 3 && otherAlivePlayers.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground flex items-center gap-2">
              <img src={CHARACTERS.assassin.image} alt="Assassin" className="w-6 h-6 rounded object-cover" />
              Assassino: Pagar 3 moedas para assassinar
            </p>
            <div className="grid grid-cols-2 gap-2">
              {otherAlivePlayers.map(player => (
                <motion.div key={player.id} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Button
                    onClick={() => onAction('assassinate', player.id)}
                    className="w-full action-assassin"
                  >
                    🗡️ {player.name}
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>
        )}
        
        {otherAlivePlayers.filter(p => p.coins > 0).length > 0 && (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground flex items-center gap-2">
              <img src={CHARACTERS.captain.image} alt="Captain" className="w-6 h-6 rounded object-cover" />
              Capitão: Roubar 2 moedas
            </p>
            <div className="grid grid-cols-2 gap-2">
              {otherAlivePlayers.filter(p => p.coins > 0).map(player => (
                <motion.div key={player.id} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Button
                    onClick={() => onAction('steal', player.id)}
                    className="w-full action-captain"
                  >
                    ⚓ {player.name} ({player.coins}💰)
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>
        )}
        
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button onClick={() => onAction('exchange')} className="w-full h-14 action-ambassador gap-3 justify-start">
            <img src={CHARACTERS.ambassador.image} alt="Ambassador" className="w-10 h-10 rounded-lg object-cover" />
            <div className="text-left">
              <p className="font-bold">Embaixador: Trocar</p>
              <p className="text-xs opacity-80">Trocar cartas com o deck</p>
            </div>
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};
