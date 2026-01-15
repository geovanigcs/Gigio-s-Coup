import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Crown, Swords, LogIn, Gamepad2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handlePlayOffline = () => {
    navigate('/game/offline');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 overflow-hidden relative">
      {/* Background Image */}
      <div className="fixed inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(/images/background.jpeg)' }}
        />
        <div className="absolute inset-0 bg-black/70" />
      </div>
      
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
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
        className="w-full max-w-xl space-y-12 relative z-10"
      >
        {/* Logo */}
        <motion.div 
          className="text-center space-y-6"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
        >
          <div className="flex justify-center items-center gap-4">
            <motion.div
              animate={{ rotateZ: [-5, 5, -5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Crown className="w-16 h-16 text-game-gold" />
            </motion.div>
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <Swords className="w-14 h-14 text-game-blood" />
            </motion.div>
          </div>
          
          <motion.h1 
            className="text-7xl font-bold text-game-gold tracking-wider cursor-pointer"
            style={{ fontFamily: "'Uncial Antiqua', cursive" }}
            onClick={isAuthenticated ? handleDashboard : undefined}
            animate={{ 
              textShadow: [
                "0 0 20px rgba(212,175,55,0.3)",
                "0 0 40px rgba(212,175,55,0.6)",
                "0 0 20px rgba(212,175,55,0.3)"
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            whileHover={isAuthenticated ? { scale: 1.05 } : undefined}
          >
            Gigio's Coup
          </motion.h1>
          
          <motion.p 
            className="text-xl text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Um jogo de blefe, intriga e traição
          </motion.p>

          <motion.div
            className="text-sm text-game-gold/70 italic"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            "Na corte, a verdade é apenas uma ilusão..."
          </motion.div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={handleLogin}
              className="w-full h-16 text-xl bg-gradient-to-r from-game-gold to-game-gold-light hover:from-game-gold-light hover:to-game-gold text-game-dark font-bold shadow-lg shadow-game-gold/30"
            >
              <LogIn className="w-6 h-6 mr-3" />
              Entrar / Cadastrar
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={handlePlayOffline}
              variant="outline"
              className="w-full h-16 text-xl border-2 border-game-purple/50 bg-game-purple/20 hover:bg-game-purple/30 text-foreground font-semibold"
            >
              <Gamepad2 className="w-6 h-6 mr-3" />
              Jogar Offline
            </Button>
          </motion.div>

          <motion.div 
            className="text-center text-sm text-muted-foreground pt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <p>Modo offline: Jogue localmente sem precisar de conta</p>
          </motion.div>
        </motion.div>

        {/* Decorative Elements */}
        <motion.div 
          className="flex justify-center gap-8 text-game-gold/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          {['⚔️', '👑', '🗡️', '🛡️', '💰'].map((emoji, i) => (
            <motion.span
              key={i}
              className="text-2xl"
              animate={{ 
                y: [0, -10, 0],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                delay: i * 0.2
              }}
            >
              {emoji}
            </motion.span>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Home;
