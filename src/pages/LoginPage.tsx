import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { LogIn, Mail, Lock, ArrowRight } from 'lucide-react';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const success = login(email, password);
    
    if (success) {
      toast.success('Connexion réussie!', {
        description: 'Bienvenue sur Chra7 liya',
      });
      navigate('/dashboard');
    } else {
      toast.error('Échec de la connexion', {
        description: 'Email ou mot de passe incorrect',
      });
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8 animate-fade-in">
          {/* Logo */}
          <div className="text-center">
            <Link to="/" className="inline-flex items-center gap-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl gradient-primary">
                <span className="text-2xl font-bold text-primary-foreground">C</span>
              </div>
              <span className="text-2xl font-bold text-foreground">
                Chra7 <span className="text-primary">liya</span>
              </span>
            </Link>
          </div>

          <Card className="border-0 shadow-xl">
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-2xl font-bold">Connexion</CardTitle>
              <CardDescription>
                Entrez vos identifiants pour accéder à votre compte
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="votre.email@cmc.ma"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Mot de passe</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full gradient-primary text-primary-foreground gap-2"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    'Connexion en cours...'
                  ) : (
                    <>
                      <LogIn className="h-4 w-4" />
                      Se connecter
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center text-sm">
                <span className="text-muted-foreground">Pas encore de compte? </span>
                <Link to="/inscription" className="text-primary font-medium hover:underline inline-flex items-center gap-1">
                  S'inscrire
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>

              {/* Demo credentials */}
              <div className="mt-6 p-4 rounded-lg bg-muted/50 text-sm">
                <p className="font-medium text-foreground mb-2">Compte de démonstration:</p>
                <p className="text-muted-foreground">
                  Email: <code className="text-primary">youssef.bennani@cmc.ma</code>
                </p>
                <p className="text-muted-foreground">
                  Mot de passe: <code className="text-primary">password123</code>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Right Side - Decorative */}
      <div className="hidden lg:flex flex-1 gradient-hero items-center justify-center p-12">
        <div className="max-w-lg text-center text-primary-foreground space-y-6">
          <h2 className="text-4xl font-bold">Bienvenue sur Chra7 liya</h2>
          <p className="text-xl opacity-90">
            La plateforme d'entraide entre stagiaires du CMC. 
            Partagez vos connaissances, gagnez des points, réussissez ensemble!
          </p>
          <div className="flex justify-center gap-8 pt-8">
            <div className="text-center">
              <div className="text-4xl font-bold">500+</div>
              <div className="text-sm opacity-80">Stagiaires</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold">200+</div>
              <div className="text-sm opacity-80">Sessions</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold">15+</div>
              <div className="text-sm opacity-80">Modules</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
