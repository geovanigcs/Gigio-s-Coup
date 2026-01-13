import { Player } from '@/types/game';
import { Button } from '@/components/ui/button';
import { CHARACTERS, CharacterType } from '@/assets/characters';
import { Coins, Shield, Sword, Crown, Skull, Ship, RefreshCw } from 'lucide-react';

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
      <div className="action-panel p-6 rounded-xl">
        <h3 className="text-game-gold font-bold text-lg mb-4 flex items-center gap-2">
          <Sword className="w-5 h-5" />
          Golpe Obrigatório! (10+ moedas)
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {otherAlivePlayers.map(player => (
            <Button
              key={player.id}
              onClick={() => onAction('coup', player.id)}
              variant="destructive"
              className="w-full"
            >
              Golpe em {player.name}
            </Button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="action-panel p-6 rounded-xl space-y-4">
      <h3 className="text-game-gold font-bold text-lg mb-2">Sua Vez, {currentPlayer.name}!</h3>
      
      {/* Basic Actions */}
      <div className="space-y-2">
        <h4 className="text-sm text-muted-foreground font-semibold flex items-center gap-2">
          <Coins className="w-4 h-4" /> Ações Básicas
        </h4>
        <div className="grid grid-cols-2 gap-2">
          <Button onClick={() => onAction('income')} variant="secondary" className="w-full">
            💰 Renda (+1)
          </Button>
          <Button onClick={() => onAction('foreign_aid')} variant="secondary" className="w-full">
            💰💰 Ajuda Externa (+2)
          </Button>
        </div>
        {currentPlayer.coins >= 7 && (
          <div className="grid grid-cols-2 gap-2 mt-2">
            {otherAlivePlayers.map(player => (
              <Button
                key={player.id}
                onClick={() => onAction('coup', player.id)}
                variant="destructive"
                className="w-full text-sm"
              >
                ⚔️ Golpe: {player.name}
              </Button>
            ))}
          </div>
        )}
      </div>

      {/* Character Actions */}
      <div className="space-y-2">
        <h4 className="text-sm text-muted-foreground font-semibold flex items-center gap-2">
          <Crown className="w-4 h-4" /> Ações de Personagem (pode blefar!)
        </h4>
        
        <Button onClick={() => onAction('tax')} className="w-full action-duke">
          👑 Duque: Taxar (+3)
        </Button>
        
        {currentPlayer.coins >= 3 && (
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">🗡️ Assassino: Assassinar (3 moedas)</p>
            <div className="grid grid-cols-2 gap-2">
              {otherAlivePlayers.map(player => (
                <Button
                  key={player.id}
                  onClick={() => onAction('assassinate', player.id)}
                  className="w-full action-assassin text-sm"
                >
                  🗡️ {player.name}
                </Button>
              ))}
            </div>
          </div>
        )}
        
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">⚓ Capitão: Roubar 2 moedas</p>
          <div className="grid grid-cols-2 gap-2">
            {otherAlivePlayers.filter(p => p.coins > 0).map(player => (
              <Button
                key={player.id}
                onClick={() => onAction('steal', player.id)}
                className="w-full action-captain text-sm"
              >
                ⚓ {player.name} ({player.coins}💰)
              </Button>
            ))}
          </div>
        </div>
        
        <Button onClick={() => onAction('exchange')} className="w-full action-ambassador">
          🎭 Embaixador: Trocar Cartas
        </Button>
      </div>
    </div>
  );
};
