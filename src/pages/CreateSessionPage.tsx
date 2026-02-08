import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { 
  BookOpen, 
  Calendar, 
  Clock, 
  MapPin, 
  Video, 
  Coins,
  Users,
  CheckCircle2,
  Info
} from 'lucide-react';
import { MODULES } from '@/types';
import { createSession } from '@/lib/storage';
import { toast } from 'sonner';
import { format } from 'date-fns';

const CreateSessionPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    module: '',
    date: '',
    heure: '',
    duree: '60',
    mode: 'en_ligne' as 'en_ligne' | 'presentiel',
    cout: '15',
    description: '',
    lieu: '',
    lienReunion: '',
    maxParticipants: '10',
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;

    setIsLoading(true);

    // Validation
    if (!formData.module || !formData.date || !formData.heure) {
      toast.error('Erreur de validation', {
        description: 'Veuillez remplir tous les champs obligatoires',
      });
      setIsLoading(false);
      return;
    }

    const sessionDate = new Date(`${formData.date}T${formData.heure}`);
    if (sessionDate <= new Date()) {
      toast.error('Date invalide', {
        description: 'La date de la session doit être dans le futur',
      });
      setIsLoading(false);
      return;
    }

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    try {
      createSession({
        aideurId: user.id,
        module: formData.module,
        date: sessionDate.toISOString(),
        duree: parseInt(formData.duree),
        mode: formData.mode,
        cout: parseInt(formData.cout),
        description: formData.description,
        lieu: formData.mode === 'presentiel' ? formData.lieu : undefined,
        lienReunion: formData.mode === 'en_ligne' ? formData.lienReunion || 'https://meet.example.com/session-' + Date.now() : undefined,
        maxParticipants: parseInt(formData.maxParticipants),
      });

      toast.success('Session créée avec succès!', {
        description: 'Votre session est maintenant visible par les autres stagiaires',
      });

      navigate('/dashboard');
    } catch (error) {
      toast.error('Erreur', {
        description: 'Une erreur est survenue lors de la création de la session',
      });
    }

    setIsLoading(false);
  };

  // Get minimum date (today)
  const today = format(new Date(), 'yyyy-MM-dd');

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Créer une session</h1>
          <p className="text-muted-foreground mt-1">
            Partagez vos connaissances et aidez vos camarades
          </p>
        </div>

        {/* Info Card */}
        <Card className="mb-6 border-primary/20 bg-primary/5">
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <Info className="h-6 w-6 text-primary flex-shrink-0" />
              <div>
                <p className="font-medium text-foreground mb-1">Comment ça marche?</p>
                <p className="text-sm text-muted-foreground">
                  Créez une session sur un module que vous maîtrisez. Les stagiaires qui s'inscrivent 
                  vous donnent des points à la fin de la session. Plus vous aidez, plus vous gagnez!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Form */}
        <Card className="border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              Détails de la session
            </CardTitle>
            <CardDescription>
              Remplissez les informations pour créer votre session d'aide
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Module */}
              <div className="space-y-2">
                <Label htmlFor="module">Module *</Label>
                <Select value={formData.module} onValueChange={(value) => handleChange('module', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner le module" />
                  </SelectTrigger>
                  <SelectContent>
                    {MODULES.map((module) => (
                      <SelectItem key={module} value={module}>{module}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Date & Heure */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date *</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="date"
                      type="date"
                      min={today}
                      value={formData.date}
                      onChange={(e) => handleChange('date', e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="heure">Heure *</Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="heure"
                      type="time"
                      value={formData.heure}
                      onChange={(e) => handleChange('heure', e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Durée & Participants */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Durée</Label>
                  <Select value={formData.duree} onValueChange={(value) => handleChange('duree', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">1 heure</SelectItem>
                      <SelectItem value="90">1h30</SelectItem>
                      <SelectItem value="120">2 heures</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Participants max</Label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="number"
                      min="1"
                      max="50"
                      value={formData.maxParticipants}
                      onChange={(e) => handleChange('maxParticipants', e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              {/* Mode */}
              <div className="space-y-3">
                <Label>Mode de la session</Label>
                <RadioGroup
                  value={formData.mode}
                  onValueChange={(value) => handleChange('mode', value)}
                  className="grid grid-cols-2 gap-4"
                >
                  <div className={`flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    formData.mode === 'en_ligne' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                  }`}>
                    <RadioGroupItem value="en_ligne" id="en_ligne" />
                    <Label htmlFor="en_ligne" className="flex items-center gap-2 cursor-pointer">
                      <Video className="h-5 w-5 text-primary" />
                      En ligne
                    </Label>
                  </div>
                  <div className={`flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    formData.mode === 'presentiel' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                  }`}>
                    <RadioGroupItem value="presentiel" id="presentiel" />
                    <Label htmlFor="presentiel" className="flex items-center gap-2 cursor-pointer">
                      <MapPin className="h-5 w-5 text-primary" />
                      Présentiel
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Location/Link based on mode */}
              {formData.mode === 'presentiel' ? (
                <div className="space-y-2">
                  <Label htmlFor="lieu">Lieu</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="lieu"
                      placeholder="ex: Salle B12, CMC Casablanca"
                      value={formData.lieu}
                      onChange={(e) => handleChange('lieu', e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="lien">Lien de réunion (optionnel)</Label>
                  <div className="relative">
                    <Video className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="lien"
                      placeholder="ex: https://meet.google.com/..."
                      value={formData.lienReunion}
                      onChange={(e) => handleChange('lienReunion', e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Un lien sera généré automatiquement si vous n'en fournissez pas
                  </p>
                </div>
              )}

              {/* Coût */}
              <div className="space-y-2">
                <Label>Coût en points</Label>
                <div className="flex items-center gap-4">
                  <div className="relative flex-1">
                    <Coins className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-secondary" />
                    <Input
                      type="number"
                      min="5"
                      max="100"
                      value={formData.cout}
                      onChange={(e) => handleChange('cout', e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <span className="text-muted-foreground">points par participant</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Recommandé: 10-30 points selon la durée et la complexité
                </p>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Décrivez le contenu de votre session, les prérequis, ce que les participants apprendront..."
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  className="min-h-[100px]"
                />
              </div>

              {/* Submit */}
              <Button
                type="submit"
                className="w-full gradient-primary text-primary-foreground gap-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  'Création en cours...'
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    Créer la session
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default CreateSessionPage;
