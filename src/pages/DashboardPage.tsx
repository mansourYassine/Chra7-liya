import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Coins, 
  Calendar, 
  Users, 
  BookOpen, 
  TrendingUp, 
  PlusCircle,
  Clock,
  MapPin,
  Video,
  Star,
  ArrowRight
} from 'lucide-react';
import { getSessions, getSessionsByAideur, getSessionsByParticipant, getTransactionsByUser, getUserById } from '@/lib/storage';
import { Session } from '@/types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const DashboardPage = () => {
  const { user, refreshUser } = useAuth();

  // Refresh user data on mount
  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  if (!user) return null;

  const mySessions = getSessionsByAideur(user.id);
  const enrolledSessions = getSessionsByParticipant(user.id);
  const transactions = getTransactionsByUser(user.id);

  const upcomingSessions = [...mySessions, ...enrolledSessions]
    .filter(s => s.status === 'a_venir')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  const totalEarned = transactions
    .filter(t => t.type === 'gain')
    .reduce((sum, t) => sum + t.montant, 0);

  const totalSpent = transactions
    .filter(t => t.type === 'depense')
    .reduce((sum, t) => sum + t.montant, 0);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            Bonjour, <span className="text-gradient">{user.prenom}</span> 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            Voici un aperçu de votre activité sur Chra7 liya
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="border-0 shadow-lg">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Solde actuel</p>
                  <p className="text-3xl font-bold text-secondary">{user.points}</p>
                  <p className="text-xs text-muted-foreground">points</p>
                </div>
                <div className="h-12 w-12 rounded-full gradient-secondary flex items-center justify-center">
                  <Coins className="h-6 w-6 text-secondary-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Sessions organisées</p>
                  <p className="text-3xl font-bold text-foreground">{mySessions.length}</p>
                  <p className="text-xs text-muted-foreground">en tant qu'aideur</p>
                </div>
                <div className="h-12 w-12 rounded-full gradient-primary flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-primary-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Inscriptions</p>
                  <p className="text-3xl font-bold text-foreground">{enrolledSessions.length}</p>
                  <p className="text-xs text-muted-foreground">en tant qu'apprenant</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                  <Users className="h-6 w-6 text-muted-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Points gagnés</p>
                  <p className="text-3xl font-bold text-success">{totalEarned}</p>
                  <p className="text-xs text-muted-foreground">au total</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-success/10 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Link to="/creer-session">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer group">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-xl gradient-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                    <PlusCircle className="h-7 w-7 text-primary-foreground" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">Créer une session</h3>
                    <p className="text-sm text-muted-foreground">Partagez vos connaissances et gagnez des points</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/acheter-points">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer group">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-xl gradient-secondary flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Coins className="h-7 w-7 text-secondary-foreground" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">Acheter des points</h3>
                    <p className="text-sm text-muted-foreground">Rechargez votre solde pour rejoindre plus de sessions</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Upcoming Sessions & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upcoming Sessions */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Sessions à venir
              </CardTitle>
              <CardDescription>Vos prochaines sessions programmées</CardDescription>
            </CardHeader>
            <CardContent>
              {upcomingSessions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>Aucune session programmée</p>
                  <Link to="/sessions">
                    <Button variant="link" className="mt-2">
                      Parcourir les sessions
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {upcomingSessions.map((session) => (
                    <SessionCard key={session.id} session={session} currentUserId={user.id} />
                  ))}
                  <Link to="/sessions" className="block">
                    <Button variant="ghost" className="w-full mt-2">
                      Voir toutes les sessions
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Transactions */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Historique des points
              </CardTitle>
              <CardDescription>Vos dernières transactions</CardDescription>
            </CardHeader>
            <CardContent>
              {transactions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Coins className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>Aucune transaction pour le moment</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {transactions.slice(0, 5).map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-3">
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                          transaction.type === 'gain' ? 'bg-success/10 text-success' :
                          transaction.type === 'achat' ? 'bg-primary/10 text-primary' :
                          'bg-destructive/10 text-destructive'
                        }`}>
                          <Coins className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{transaction.description}</p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(transaction.date), 'dd MMM yyyy', { locale: fr })}
                          </p>
                        </div>
                      </div>
                      <span className={`font-semibold ${
                        transaction.type === 'depense' ? 'text-destructive' : 'text-success'
                      }`}>
                        {transaction.type === 'depense' ? '-' : '+'}{transaction.montant}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

// Session Card Component
const SessionCard = ({ session, currentUserId }: { session: Session; currentUserId: string }) => {
  const aideur = getUserById(session.aideurId);
  const isOrganizer = session.aideurId === currentUserId;

  return (
    <div className="p-4 rounded-xl border border-border bg-card hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-2">
        <div>
          <h4 className="font-semibold">{session.module}</h4>
          <p className="text-sm text-muted-foreground">
            par {isOrganizer ? 'Vous' : `${aideur?.prenom} ${aideur?.nom}`}
          </p>
        </div>
        <Badge variant={isOrganizer ? 'default' : 'secondary'}>
          {isOrganizer ? 'Organisateur' : 'Participant'}
        </Badge>
      </div>
      <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
        <span className="flex items-center gap-1">
          <Calendar className="h-4 w-4" />
          {format(new Date(session.date), 'dd MMM à HH:mm', { locale: fr })}
        </span>
        <span className="flex items-center gap-1">
          <Clock className="h-4 w-4" />
          {session.duree} min
        </span>
        <span className="flex items-center gap-1">
          {session.mode === 'en_ligne' ? <Video className="h-4 w-4" /> : <MapPin className="h-4 w-4" />}
          {session.mode === 'en_ligne' ? 'En ligne' : 'Présentiel'}
        </span>
      </div>
    </div>
  );
};

export default DashboardPage;
