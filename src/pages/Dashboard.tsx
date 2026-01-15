import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Crown, Gamepad2, Globe, History, Users, BookOpen, LogOut, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const menuItems = [
    {
      icon: Globe,
      title: 'Jogar Online',
      description: 'Encontre adversários e entre em partidas online',
      color: 'from-blue-500 to-cyan-500',
      path: '/game/online',
      available: false,
    },
    {
      icon: Gamepad2,
      title: 'Jogar Offline',
      description: 'Jogue localmente com amigos',
      color: 'from-purple-500 to-pink-500',
      path: '/game/offline',
      available: true,
    },
    {
      icon: History,
      title: 'Histórico',
      description: 'Veja suas partidas e estatísticas',
      color: 'from-amber-500 to-orange-500',
      path: '/history',
      available: false,
    },
    {
      icon: Users,
      title: 'Amigos',
      description: 'Gerencie sua lista de amigos',
      color: 'from-green-500 to-emerald-500',
      path: '/friends',
      available: false,
    },
    {
      icon: BookOpen,
      title: 'Instruções',
      description: 'Aprenda as regras e mecânicas do jogo',
      color: 'from-indigo-500 to-purple-500',
      path: '/instructions',
      available: false,
    },
  ];

  return (
    <div className="min-h-screen bg-background overflow-hidden relative">
      {/* Background Image */}
      <div className="fixed inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(/images/background.jpeg)' }}
        />
        <div className="absolute inset-0 bg-black/75" />
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

      <div className="relative z-10 min-h-screen p-6">
        {/* Header */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto flex items-center justify-between mb-12"
        >
          <div 
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => navigate('/')}
          >
            <Crown className="w-10 h-10 text-game-gold" />
            <h1 
              className="text-4xl font-bold text-game-gold"
              style={{ fontFamily: "'Uncial Antiqua', cursive" }}
            >
              Gigio's Coup
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 bg-card/50 px-4 py-2 rounded-lg border border-game-gold/30">
              <User className="w-5 h-5 text-game-gold" />
              <div>
                <p className="text-sm font-semibold text-foreground">{user?.nick}</p>
                <p className="text-xs text-muted-foreground">@{user?.username}</p>
              </div>
            </div>
            
            <Button
              onClick={handleLogout}
              variant="outline"
              className="border-game-blood/50 text-game-blood hover:bg-game-blood/10"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </motion.header>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-foreground mb-3">
              Bem-vindo à Corte, {user?.nick}!
            </h2>
            <p className="text-muted-foreground text-lg">
              Escolha seu próximo movimento com sabedoria
            </p>
          </motion.div>

          {/* Menu Grid */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {menuItems.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                whileHover={{ scale: item.available ? 1.03 : 1 }}
                whileTap={{ scale: item.available ? 0.98 : 1 }}
              >
                <button
                  onClick={() => item.available && navigate(item.path)}
                  disabled={!item.available}
                  className={`relative w-full h-48 rounded-2xl overflow-hidden border-2 transition-all ${
                    item.available 
                      ? 'border-game-gold/50 hover:border-game-gold cursor-pointer' 
                      : 'border-muted/30 cursor-not-allowed opacity-60'
                  }`}
                >
                  {/* Gradient Background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-20`} />
                  
                  {/* Content */}
                  <div className="relative h-full flex flex-col items-center justify-center p-6 text-center space-y-4">
                    <item.icon className="w-16 h-16 text-game-gold" />
                    <div>
                      <h3 className="text-2xl font-bold text-foreground mb-2">
                        {item.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                    
                    {!item.available && (
                      <div className="absolute top-3 right-3">
                        <span className="px-3 py-1 bg-muted rounded-full text-xs font-semibold">
                          Em breve
                        </span>
                      </div>
                    )}
                  </div>
                </button>
              </motion.div>
            ))}
          </motion.div>

          {/* Footer Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-12 text-center text-muted-foreground text-sm"
          >
            <p>Na corte de Coup, apenas os mais astutos sobrevivem...</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
