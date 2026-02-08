import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { FILIERES, VILLES } from '@/types';
import { getUserByEmail } from '@/lib/storage';
import { toast } from 'sonner';
import { UserPlus, Mail, Lock, User, MapPin, Calendar, GraduationCap, ArrowLeft, Gift } from 'lucide-react';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    password: '',
    confirmPassword: '',
    age: '',
    ville: '',
    sexe: '' as 'homme' | 'femme' | '',
    filiere: '',
    annee: '' as '1' | '2' | '',
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validation
    if (formData.password !== formData.confirmPassword) {
      toast.error('Erreur de validation', {
        description: 'Les mots de passe ne correspondent pas',
      });
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Erreur de validation', {
        description: 'Le mot de passe doit contenir au moins 6 caractères',
      });
      setIsLoading(false);
      return;
    }

    // Check if email already exists
    if (getUserByEmail(formData.email)) {
      toast.error('Erreur d\'inscription', {
        description: 'Cet email est déjà utilisé',
      });
      setIsLoading(false);
      return;
    }

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    try {
      register({
        nom: formData.nom,
        prenom: formData.prenom,
        email: formData.email,
        password: formData.password,
        age: parseInt(formData.age),
        ville: formData.ville,
        sexe: formData.sexe as 'homme' | 'femme',
        filiere: formData.filiere,
        annee: parseInt(formData.annee) as 1 | 2,
      });

      toast.success('Inscription réussie!', {
        description: 'Vous avez reçu 50 points de bienvenue 🎉',
      });
      navigate('/dashboard');
    } catch (error) {
      toast.error('Erreur d\'inscription', {
        description: 'Une erreur est survenue. Veuillez réessayer.',
      });
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Decorative */}
      <div className="hidden lg:flex flex-1 gradient-hero items-center justify-center p-12">
        <div className="max-w-lg text-center text-primary-foreground space-y-6">
          <div className="flex justify-center">
            <div className="p-4 rounded-full bg-white/10 backdrop-blur-sm">
              <Gift className="h-16 w-16" />
            </div>
          </div>
          <h2 className="text-4xl font-bold">Rejoignez Chra7 liya</h2>
          <p className="text-xl opacity-90">
            Créez votre compte et recevez <span className="font-bold">50 points de bienvenue</span> pour commencer!
          </p>
          <div className="space-y-4 text-left bg-white/10 backdrop-blur-sm rounded-xl p-6">
            <h3 className="font-semibold text-lg">Pourquoi rejoindre?</h3>
            <ul className="space-y-2 opacity-90">
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-white"></span>
                Trouvez de l'aide pour les matières difficiles
              </li>
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-white"></span>
                Partagez vos connaissances et gagnez des points
              </li>
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-white"></span>
                Connectez-vous avec d'autres stagiaires du CMC
              </li>
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-white"></span>
                Améliorez vos notes aux examens
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 overflow-y-auto">
        <div className="w-full max-w-lg space-y-6 animate-fade-in py-8">
          {/* Back Link */}
          <Link to="/connexion" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Retour à la connexion
          </Link>

          <Card className="border-0 shadow-xl">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold">Créer un compte</CardTitle>
              <CardDescription>
                Remplissez vos informations pour rejoindre la communauté
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Nom & Prénom */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="prenom">Prénom</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="prenom"
                        placeholder="Youssef"
                        value={formData.prenom}
                        onChange={(e) => handleChange('prenom', e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nom">Nom</Label>
                    <Input
                      id="nom"
                      placeholder="Bennani"
                      value={formData.nom}
                      onChange={(e) => handleChange('nom', e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="votre.email@cmc.ma"
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">Mot de passe</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={(e) => handleChange('password', e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirmer</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={(e) => handleChange('confirmPassword', e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Age & Sexe */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="age">Âge</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="age"
                        type="number"
                        min="16"
                        max="60"
                        placeholder="20"
                        value={formData.age}
                        onChange={(e) => handleChange('age', e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Sexe</Label>
                    <Select value={formData.sexe} onValueChange={(value) => handleChange('sexe', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="homme">Homme</SelectItem>
                        <SelectItem value="femme">Femme</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Ville */}
                <div className="space-y-2">
                  <Label>Ville</Label>
                  <Select value={formData.ville} onValueChange={(value) => handleChange('ville', value)}>
                    <SelectTrigger>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <SelectValue placeholder="Sélectionner votre ville" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      {VILLES.map((ville) => (
                        <SelectItem key={ville} value={ville}>{ville}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Filière & Année */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2 space-y-2">
                    <Label>Filière</Label>
                    <Select value={formData.filiere} onValueChange={(value) => handleChange('filiere', value)}>
                      <SelectTrigger>
                        <div className="flex items-center gap-2">
                          <GraduationCap className="h-4 w-4 text-muted-foreground" />
                          <SelectValue placeholder="Sélectionner" />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        {FILIERES.map((filiere) => (
                          <SelectItem key={filiere} value={filiere}>{filiere}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Année</Label>
                    <Select value={formData.annee} onValueChange={(value) => handleChange('annee', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Année" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1ère année</SelectItem>
                        <SelectItem value="2">2ème année</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full gradient-primary text-primary-foreground gap-2 mt-6"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    'Inscription en cours...'
                  ) : (
                    <>
                      <UserPlus className="h-4 w-4" />
                      Créer mon compte
                    </>
                  )}
                </Button>
              </form>

              <p className="mt-6 text-center text-sm text-muted-foreground">
                En vous inscrivant, vous acceptez nos conditions d'utilisation et notre politique de confidentialité.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
