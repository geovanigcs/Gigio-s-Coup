import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Crown, LogIn, UserPlus, ArrowLeft, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { toast } from 'sonner';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  // Login form
  const [loginData, setLoginData] = useState({
    username: '',
    password: '',
  });

  // Register form
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
    <div className="min-h-screen bg-background flex items-center justify-center p-4 overflow-hidden relative">
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
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Back Button */}
        <motion.button
          onClick={() => navigate('/')}
          className="mb-6 flex items-center gap-2 text-game-gold hover:text-game-gold-light transition-colors"
          whileHover={{ x: -5 }}
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Voltar</span>
        </motion.button>

        <div className="game-card p-8 rounded-2xl space-y-6">
          {/* Header */}
          <div className="text-center space-y-3">
            <motion.div
              animate={{ rotateZ: [-5, 5, -5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex justify-center"
            >
              <Crown className="w-12 h-12 text-game-gold" />
            </motion.div>
            <h1 
              className="text-3xl font-bold text-game-gold"
              style={{ fontFamily: "'Uncial Antiqua', cursive" }}
            >
              {isLogin ? 'Entrar' : 'Cadastrar'}
            </h1>
            <p className="text-muted-foreground">
              {isLogin ? 'Entre na corte real' : 'Junte-se à corte'}
            </p>
          </div>

          {/* Toggle */}
          <div className="flex gap-2 p-1 bg-muted/50 rounded-lg">
            <Button
              type="button"
              variant={isLogin ? 'default' : 'ghost'}
              className={`flex-1 ${isLogin ? 'bg-game-gold text-game-dark' : ''}`}
              onClick={() => setIsLogin(true)}
            >
              <LogIn className="w-4 h-4 mr-2" />
              Login
            </Button>
            <Button
              type="button"
              variant={!isLogin ? 'default' : 'ghost'}
              className={`flex-1 ${!isLogin ? 'bg-game-gold text-game-dark' : ''}`}
              onClick={() => setIsLogin(false)}
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Cadastro
            </Button>
          </div>

          {/* Forms */}
          <AnimatePresence mode="wait">
            {isLogin ? (
              <motion.form
                key="login"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handleLogin}
                className="space-y-4"
              >
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
              </motion.form>
            ) : (
              <motion.form
                key="register"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleRegister}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="register-nick">Apelido (Nick)</Label>
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
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
