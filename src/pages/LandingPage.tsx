import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { 
  GraduationCap, 
  Users, 
  Coins, 
  ArrowRight, 
  BookOpen, 
  Star,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

const LandingPage = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: BookOpen,
      title: 'Sessions d\'aide',
      description: 'Trouvez des sessions sur les modules qui vous posent problème',
    },
    {
      icon: Users,
      title: 'Entraide communautaire',
      description: 'Apprenez de vos camarades qui maîtrisent les sujets',
    },
    {
      icon: Coins,
      title: 'Système de points',
      description: 'Gagnez des points en aidant, utilisez-les pour apprendre',
    },
    {
      icon: Star,
      title: 'Évaluations',
      description: 'Notez les aideurs pour garantir la qualité des sessions',
    },
  ];

  const steps = [
    { number: '01', title: 'Inscrivez-vous', description: 'Créez votre compte gratuitement et recevez 50 points de bienvenue' },
    { number: '02', title: 'Explorez', description: 'Parcourez les sessions disponibles ou créez la vôtre' },
    { number: '03', title: 'Participez', description: 'Rejoignez des sessions ou aidez d\'autres stagiaires' },
    { number: '04', title: 'Progressez', description: 'Améliorez vos notes et gagnez des points' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-lg">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-xl font-bold text-foreground">
                Chra7 <span className="text-primary">liya</span>
              </span>
            </Link>

            <div className="flex items-center gap-3">
              {isAuthenticated ? (
                <Link to="/dashboard">
                  <Button className="gradient-primary text-primary-foreground">
                    Tableau de bord
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/connexion">
                    <Button variant="ghost">Connexion</Button>
                  </Link>
                  <Link to="/inscription">
                    <Button className="gradient-primary text-primary-foreground">
                      Commencer
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 animate-fade-in">
            <GraduationCap className="h-4 w-4" />
            Plateforme d'entraide pour les stagiaires du CMC
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 animate-fade-in">
            Apprenez ensemble,{' '}
            <span className="text-gradient">réussissez ensemble</span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-in">
            Chra7 liya connecte les stagiaires du CMC pour s'entraider. 
            Partagez vos connaissances, gagnez des points, et améliorez vos résultats aux examens.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in">
            <Link to="/inscription">
              <Button size="lg" className="gradient-primary text-primary-foreground gap-2 px-8 h-12 text-lg shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all">
                <Sparkles className="h-5 w-5" />
                Créer un compte gratuit
              </Button>
            </Link>
            <Link to="/sessions">
              <Button size="lg" variant="outline" className="gap-2 px-8 h-12 text-lg">
                Voir les sessions
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-16 pt-16 border-t border-border">
            <div className="text-center">
              <div className="text-4xl font-bold text-gradient mb-2">500+</div>
              <div className="text-muted-foreground">Stagiaires actifs</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-gradient mb-2">200+</div>
              <div className="text-muted-foreground">Sessions organisées</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-gradient mb-2">15+</div>
              <div className="text-muted-foreground">Modules couverts</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-muted/50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Comment ça marche?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Une plateforme simple et efficace pour l'entraide entre stagiaires
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="p-6 rounded-2xl bg-card border border-border hover:shadow-lg hover:border-primary/30 transition-all duration-300 group"
              >
                <div className="h-14 w-14 rounded-xl gradient-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="h-7 w-7 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Commencez en 4 étapes
            </h2>
          </div>

          <div className="space-y-6">
            {steps.map((step, index) => (
              <div 
                key={index}
                className="flex items-start gap-6 p-6 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all"
              >
                <div className="flex-shrink-0 h-14 w-14 rounded-xl gradient-primary flex items-center justify-center">
                  <span className="text-xl font-bold text-primary-foreground">{step.number}</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-1">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="rounded-3xl gradient-hero p-12 text-center text-primary-foreground">
            <h2 className="text-3xl font-bold mb-4">
              Prêt à améliorer vos notes?
            </h2>
            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              Rejoignez la communauté Chra7 liya et commencez à apprendre avec vos camarades dès aujourd'hui.
            </p>
            <Link to="/inscription">
              <Button size="lg" variant="secondary" className="gap-2 px-8 h-12 text-lg font-semibold">
                <CheckCircle2 className="h-5 w-5" />
                S'inscrire gratuitement
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border">
        <div className="container mx-auto text-center text-muted-foreground text-sm">
          <p>© 2025 Chra7 liya - Plateforme d'entraide pour les stagiaires du CMC</p>
          <p className="mt-2">Prototype de démonstration</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
