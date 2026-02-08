import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Search, 
  Calendar, 
  Clock, 
  MapPin, 
  Video, 
  Users, 
  Coins,
  Filter,
  Star,
  CheckCircle2
} from 'lucide-react';
import { getSessions, getUserById, addParticipantToSession, updateUserPoints, createInscription, createTransaction } from '@/lib/storage';
import { Session, MODULES } from '@/types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from 'sonner';

const SessionsPage = () => {
  const { user, refreshUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [moduleFilter, setModuleFilter] = useState<string>('all');
  const [modeFilter, setModeFilter] = useState<string>('all');
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const allSessions = getSessions();

  const filteredSessions = useMemo(() => {
    return allSessions
      .filter(session => {
        // Only show upcoming sessions
        if (session.status !== 'a_venir') return false;
        
        // Search filter
        const aideur = getUserById(session.aideurId);
        const searchLower = searchQuery.toLowerCase();
        const matchesSearch = 
          session.module.toLowerCase().includes(searchLower) ||
          aideur?.nom.toLowerCase().includes(searchLower) ||
          aideur?.prenom.toLowerCase().includes(searchLower);
        
        // Module filter
        const matchesModule = moduleFilter === 'all' || session.module === moduleFilter;
        
        // Mode filter
        const matchesMode = modeFilter === 'all' || session.mode === modeFilter;

        return matchesSearch && matchesModule && matchesMode;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [allSessions, searchQuery, moduleFilter, modeFilter]);

  const handleEnroll = (session: Session) => {
    if (!user) return;

    // Check if user is the organizer
    if (session.aideurId === user.id) {
      toast.error('Action impossible', {
        description: 'Vous ne pouvez pas vous inscrire à votre propre session',
      });
      return;
    }

    // Check if already enrolled
    if (session.participants.includes(user.id)) {
      toast.info('Déjà inscrit', {
        description: 'Vous êtes déjà inscrit à cette session',
      });
      return;
    }

    // Check points
    if (user.points < session.cout) {
      toast.error('Points insuffisants', {
        description: `Vous avez besoin de ${session.cout} points. Solde actuel: ${user.points} points`,
      });
      return;
    }

    // Check capacity
    if (session.participants.length >= session.maxParticipants) {
      toast.error('Session complète', {
        description: 'Cette session a atteint sa capacité maximale',
      });
      return;
    }

    setSelectedSession(session);
    setShowConfirmDialog(true);
  };

  const confirmEnrollment = () => {
    if (!user || !selectedSession) return;

    // Add participant
    addParticipantToSession(selectedSession.id, user.id);

    // Deduct points from learner
    updateUserPoints(user.id, -selectedSession.cout);

    // Add points to helper
    updateUserPoints(selectedSession.aideurId, selectedSession.cout);

    // Create inscription record
    createInscription(selectedSession.id, user.id, selectedSession.cout);

    // Create transaction records
    createTransaction({
      userId: user.id,
      type: 'depense',
      montant: selectedSession.cout,
      description: `Inscription: ${selectedSession.module}`,
    });

    createTransaction({
      userId: selectedSession.aideurId,
      type: 'gain',
      montant: selectedSession.cout,
      description: `Session: ${selectedSession.module}`,
    });

    refreshUser();
    setShowConfirmDialog(false);
    setSelectedSession(null);

    toast.success('Inscription réussie!', {
      description: `Vous êtes inscrit à la session "${selectedSession.module}"`,
    });
  };

  const uniqueModules = [...new Set(allSessions.map(s => s.module))];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Sessions disponibles</h1>
          <p className="text-muted-foreground mt-1">
            Trouvez une session pour améliorer vos compétences
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher par module ou aideur..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Select value={moduleFilter} onValueChange={setModuleFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Module" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les modules</SelectItem>
                {uniqueModules.map((module) => (
                  <SelectItem key={module} value={module}>{module}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={modeFilter} onValueChange={setModeFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                <SelectItem value="en_ligne">En ligne</SelectItem>
                <SelectItem value="presentiel">Présentiel</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Sessions Grid */}
        {filteredSessions.length === 0 ? (
          <div className="text-center py-16">
            <Search className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
            <h3 className="text-xl font-semibold mb-2">Aucune session trouvée</h3>
            <p className="text-muted-foreground mb-4">
              Essayez de modifier vos filtres ou créez votre propre session
            </p>
            <Link to="/creer-session">
              <Button>Créer une session</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSessions.map((session) => (
              <SessionCard 
                key={session.id} 
                session={session} 
                currentUserId={user?.id}
                onEnroll={() => handleEnroll(session)}
              />
            ))}
          </div>
        )}

        {/* Confirmation Dialog */}
        <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmer l'inscription</DialogTitle>
              <DialogDescription>
                Vous êtes sur le point de vous inscrire à cette session.
              </DialogDescription>
            </DialogHeader>
            
            {selectedSession && (
              <div className="py-4 space-y-3">
                <div className="flex items-center justify-between p-4 rounded-lg bg-muted">
                  <span className="font-medium">{selectedSession.module}</span>
                  <Badge>{selectedSession.cout} points</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Votre solde actuel:</span>
                  <span className="font-semibold">{user?.points} points</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Après inscription:</span>
                  <span className="font-semibold text-success">
                    {(user?.points || 0) - selectedSession.cout} points
                  </span>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
                Annuler
              </Button>
              <Button onClick={confirmEnrollment} className="gradient-primary text-primary-foreground">
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Confirmer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

// Session Card Component
const SessionCard = ({ 
  session, 
  currentUserId,
  onEnroll 
}: { 
  session: Session; 
  currentUserId?: string;
  onEnroll: () => void;
}) => {
  const aideur = getUserById(session.aideurId);
  const isOrganizer = session.aideurId === currentUserId;
  const isEnrolled = currentUserId ? session.participants.includes(currentUserId) : false;
  const isFull = session.participants.length >= session.maxParticipants;
  const spotsLeft = session.maxParticipants - session.participants.length;

  return (
    <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
      {/* Header */}
      <div className="p-4 gradient-primary">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-bold text-lg text-primary-foreground">{session.module}</h3>
            <p className="text-primary-foreground/80 text-sm">
              par {aideur?.prenom} {aideur?.nom}
            </p>
          </div>
          <Badge variant="secondary" className="bg-white/20 text-white border-0">
            {session.mode === 'en_ligne' ? 'En ligne' : 'Présentiel'}
          </Badge>
        </div>
      </div>

      <CardContent className="p-4 space-y-4">
        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-2">{session.description}</p>

        {/* Details */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            {format(new Date(session.date), 'dd MMM yyyy', { locale: fr })}
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4" />
            {format(new Date(session.date), 'HH:mm', { locale: fr })} ({session.duree} min)
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            {session.mode === 'en_ligne' ? <Video className="h-4 w-4" /> : <MapPin className="h-4 w-4" />}
            {session.mode === 'en_ligne' ? 'Visioconférence' : session.lieu}
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="h-4 w-4" />
            {spotsLeft} place{spotsLeft > 1 ? 's' : ''} restante{spotsLeft > 1 ? 's' : ''}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div className="flex items-center gap-1">
            <Coins className="h-5 w-5 text-secondary" />
            <span className="font-bold text-lg">{session.cout}</span>
            <span className="text-sm text-muted-foreground">points</span>
          </div>

          {isOrganizer ? (
            <Badge variant="outline">Votre session</Badge>
          ) : isEnrolled ? (
            <Badge className="bg-success text-success-foreground">
              <CheckCircle2 className="h-4 w-4 mr-1" />
              Inscrit
            </Badge>
          ) : (
            <Button 
              size="sm" 
              onClick={onEnroll}
              disabled={isFull}
              className="gradient-primary text-primary-foreground"
            >
              {isFull ? 'Complet' : 'S\'inscrire'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SessionsPage;
