import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Crown, LogIn, UserPlus, Loader2, Info, Swords } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { CHARACTERS } from '@/assets/characters';
import backgroundImg from '@/assets/images/background.jpeg';
import warrion from '@/assets/images/Warrion.png';
import '@fontsource/cinzel-decorative';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const Home = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  const [loginData, setLoginData] = useState({
    username: '',
    password: '',
  });

  const [registerData, setRegisterData] = useState({
    username: '',
    nick: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.login(loginData);
      login(response.token, response.user);
      toast.success('Login realizado com sucesso!');
      navigate('/dashboard');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Erro ao fazer login';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (registerData.password !== registerData.confirmPassword) {
      toast.error('As senhas não coincidem');
      return;
    }

    if (registerData.password.length < 6) {
      toast.error('A senha deve ter no mínimo 6 caracteres');
      return;
    }

    setLoading(true);

    try {
      const response = await api.register({
        username: registerData.username,
        nick: registerData.nick,
        email: registerData.email,
        password: registerData.password,
      });
      login(response.token, response.user);
      toast.success('Cadastro realizado com sucesso!');
      navigate('/dashboard');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Erro ao registrar';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 overflow-hidden relative">
      <div className="fixed inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${backgroundImg})` }}
        />
        <div className="absolute inset-0 bg-black/70" />
      </div>

      <div className="fixed top-6 right-6 z-50">
        <Dialog>
          <DialogTrigger asChild>
            <motion.button
              className="flex items-center gap-2 p-3 rounded-full bg-game-gold/20 hover:bg-game-gold/30 text-game-gold transition-colors backdrop-blur-sm"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Info className="w-6 h-6" />
            </motion.button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-gradient-to-b from-amber-50 to-yellow-50">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-amber-900 flex items-center gap-2">
                {/* <Crown className="w-6 h-6" /> */}
                <motion.div className="flex items-center justify-center gap-4 mb-4">
            <img src={warrion} alt="" className="w-15 h-[115px]" />            
          </motion.div>
                Como Jogar Coup
              </DialogTitle>
              <DialogDescription className="text-base space-y-4 mt-4 text-gray-800">
                <div>
                  <h3 className="font-bold text-amber-900 mb-2">🎯 Objetivo</h3>
                  <p className="text-gray-800">Ser o último jogador com influência, eliminando as cartas dos oponentes através de blefe, manipulação e estratégia.</p>
                </div>

                <div>
                  <h3 className="font-bold text-amber-900 mb-2">🃏 Preparação</h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-800">
                    <li>Cada jogador recebe 2 moedas e 2 cartas de personagem viradas para baixo</li>
                    <li>O baralho tem 15 cartas (3 cópias de cada um dos 5 personagens)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-bold text-amber-900 mb-2">👑 Personagens</h3>
                  <ul className="space-y-2 text-gray-800">
                    <li><strong className="text-gray-900">Duque:</strong> Pega 3 moedas (Taxação) | Bloqueia Ajuda Externa</li>
                    <li><strong className="text-gray-900">Assassino:</strong> Paga 3 moedas para assassinar outro jogador</li>
                    <li><strong className="text-gray-900">Condessa:</strong> Bloqueia assassinato</li>
                    <li><strong className="text-gray-900">Capitão:</strong> Rouba 2 moedas | Bloqueia roubo</li>
                    <li><strong className="text-gray-900">Embaixador:</strong> Troca cartas com o baralho | Bloqueia roubo</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-bold text-amber-900 mb-2">🎮 Ações do Turno</h3>
                  <p className="font-semibold text-gray-900">Ações Básicas:</p>
                  <ul className="list-disc list-inside space-y-1 mb-2 text-gray-800">
                    <li><strong className="text-gray-900">Renda:</strong> Pega 1 moeda (não pode ser bloqueada)</li>
                    <li><strong className="text-gray-900">Ajuda Externa:</strong> Pega 2 moedas (pode ser bloqueada pelo Duque)</li>
                    <li><strong className="text-gray-900">Golpe de Estado:</strong> Paga 7 moedas para eliminar influência (obrigatório com 10+ moedas)</li>
                  </ul>
                  <p className="font-semibold text-gray-900">Ações de Personagem:</p>
                  <p className="text-sm text-gray-800">Use as habilidades dos personagens acima. Você pode blefar sobre qual carta você tem!</p>
                </div>

                <div>
                  <h3 className="font-bold text-amber-900 mb-2">🎭 Desafios e Bloqueios</h3>
                  <p className="mb-2 text-gray-800"><strong className="text-gray-900">Desafio:</strong> Questione se o jogador realmente tem a carta alegada</p>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-800">
                    <li>Desafio bem-sucedido (blefou): Blefador perde 1 influência</li>
                    <li>Desafio falhou (tinha a carta): Desafiante perde 1 influência</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-bold text-amber-900 mb-2">🏆 Vitória</h3>
                  <p className="text-gray-800">O último jogador com pelo menos uma carta de influência virada para baixo vence!</p>
                </div>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative z-10 w-full max-w-6xl flex flex-col items-center gap-6">
        <div className="text-center space-y-4">
          <motion.div className="flex items-center justify-center gap-4 mb-4">
            <img src={warrion} alt="" className="w-15 h-[115px]" />            
          </motion.div>
          <div
            className="text-6xl font-bold flex justify-center"
            style={{ fontFamily: "'Cinzel Decorative', serif" }}
          >
            {['G', 'i', 'g', 'i', 'o', "'", 's', ' ', 'C', 'o', 'u', 'p'].map((letter, index) => (
              <motion.span
                key={index}
                className="inline-block"
                style={{
                  color: letter === ' ' ? 'transparent' : index < 7 ? '#D4AF37' : '#C9B037',
                  textShadow: '2px 2px 8px rgba(0,0,0,0.8), 0 0 20px rgba(212,175,55,0.5)'
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: 1,
                  y: [0, -8, 0],
                  textShadow: [
                    '2px 2px 8px rgba(0,0,0,0.8), 0 0 20px rgba(212,175,55,0.5)',
                    '1px 1px 4px rgba(0,0,0,0.8), 0 0 35px rgba(212,175,55,0.8)',
                    '2px 2px 8px rgba(0,0,0,0.8), 0 0 20px rgba(212,175,55,0.5)'
                  ]
                }}
                transition={{
                  opacity: { delay: index * 0.05, duration: 0.3 },
                  y: { duration: 2, repeat: Infinity, delay: index * 0.1 },
                  textShadow: { duration: 2, repeat: Infinity, delay: index * 0.1 }
                }}
              >
                {letter === ' ' ? '\u00A0' : letter}
              </motion.span>
            ))}
          </div>
          <p className="text-xl text-gray-300">
            Não importa a carta que você tem, mas a que eles acreditam que você tem.
          </p>
        </div>

        <div className="flex items-center justify-center gap-6">
          {Object.values(CHARACTERS).map((char, index) => (
            <motion.div
              key={char.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.05, y: -10 }}
              className="relative"
            >
              <div className="w-32 h-44 rounded-xl overflow-hidden border-4 border-game-gold/50 shadow-2xl">
                <img
                  src={char.image}
                  alt={char.namePortuguese}
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="w-full max-w-md"
        >
          <div className="game-card p-8 rounded-2xl space-y-6 backdrop-blur-sm bg-game-dark/80">
            <div className="flex gap-3 justify-center items-center">
              <button
                type="button"
                onClick={() => setIsLogin(true)}
                className={`text-sm transition-colors ${isLogin ? 'text-game-gold font-semibold' : 'text-muted-foreground hover:text-foreground'}`}
              >
                Login
              </button>
              <span className="text-muted-foreground">|</span>
              <button
                type="button"
                onClick={() => setIsLogin(false)}
                className={`text-sm transition-colors ${!isLogin ? 'text-game-gold font-semibold' : 'text-muted-foreground hover:text-foreground'}`}
              >
                Cadastrar
              </button>
            </div>

            {isLogin ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-username">Usuário</Label>
                  <Input
                    id="login-username"
                    type="text"
                    value={loginData.username}
                    onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="login-password">Senha</Label>
                  <Input
                    id="login-password"
                    type="password"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => navigate('/forgot-password')}
                    className="text-sm text-game-gold hover:text-game-gold-light underline transition-colors"
                  >
                    Esqueci minha senha
                  </button>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-game-gold hover:bg-game-gold-light text-game-dark font-bold h-12"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Entrando...
                    </>
                  ) : (
                    <>
                      <LogIn className="w-5 h-5 mr-2" />
                      Entrar
                    </>
                  )}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="register-nick">Apelido</Label>
                  <Input
                    id="register-nick"
                    type="text"
                    placeholder="Como você será chamado"
                    value={registerData.nick}
                    onChange={(e) => setRegisterData({ ...registerData, nick: e.target.value })}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-username">Usuário</Label>
                  <Input
                    id="register-username"
                    type="text"
                    placeholder="Nome único para login"
                    value={registerData.username}
                    onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-email">Email</Label>
                  <Input
                    id="register-email"
                    type="email"
                    placeholder="Para recuperação de conta"
                    value={registerData.email}
                    onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-password">Senha</Label>
                  <Input
                    id="register-password"
                    type="password"
                    placeholder="Mínimo 6 caracteres"
                    value={registerData.password}
                    onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-confirm">Confirmar Senha</Label>
                  <Input
                    id="register-confirm"
                    type="password"
                    placeholder="Digite a senha novamente"
                    value={registerData.confirmPassword}
                    onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                    required
                    disabled={loading}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-game-gold hover:bg-game-gold-light text-game-dark font-bold h-12"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Cadastrando...
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-5 h-5 mr-2" />
                      Cadastrar
                    </>
                  )}
                </Button>
              </form>
            )}

            {/* Button to Offline Mode */}
            <div className="pt-4 border-t border-game-gold/20 space-y-3">
              <Button
                type="button"
                onClick={() => navigate('/game/lobby')}
                className="w-full bg-game-gold text-game-dark hover:bg-game-gold/90"
              >
                <span className="mr-2">🌐</span>
                Jogar Online
              </Button>
              
              <Button
                type="button"
                onClick={() => navigate('/game/offline')}
                variant="outline"
                className="w-full border-game-gold/50 text-game-gold hover:bg-game-gold/10"
              >
                <span className="mr-2">🎮</span>
                Jogar Offline
              </Button>
              <p className="text-xs text-center text-muted-foreground mt-2">
                Modo offline: Jogue localmente sem precisar de conta
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;
