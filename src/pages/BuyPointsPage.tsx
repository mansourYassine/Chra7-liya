import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Coins, 
  CreditCard, 
  Banknote,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  Gift,
  Zap
} from 'lucide-react';
import { updateUserPoints, createTransaction } from '@/lib/storage';
import { toast } from 'sonner';

const pointsPackages = [
  { id: 'pack1', points: 50, price: 25, popular: false },
  { id: 'pack2', points: 100, price: 45, popular: true, bonus: 10 },
  { id: 'pack3', points: 200, price: 80, popular: false, bonus: 30 },
  { id: 'pack4', points: 500, price: 180, popular: false, bonus: 100 },
];

const BuyPointsPage = () => {
  const { user, refreshUser } = useAuth();
  const [selectedPackage, setSelectedPackage] = useState<string>('pack2');
  const [paymentMethod, setPaymentMethod] = useState<'carte' | 'cash_plus'>('carte');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [customAmount, setCustomAmount] = useState('');

  const selectedPack = pointsPackages.find(p => p.id === selectedPackage);

  const handlePurchase = () => {
    if (!selectedPack && !customAmount) {
      toast.error('Erreur', {
        description: 'Veuillez sélectionner un pack ou entrer un montant',
      });
      return;
    }
    setShowConfirmDialog(true);
  };

  const confirmPurchase = async () => {
    if (!user) return;
    
    setIsProcessing(true);

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 1500));

    const pointsToAdd = selectedPack 
      ? selectedPack.points + (selectedPack.bonus || 0)
      : parseInt(customAmount);

    // Update user points
    updateUserPoints(user.id, pointsToAdd);

    // Create transaction
    createTransaction({
      userId: user.id,
      type: 'achat',
      montant: pointsToAdd,
      description: `Achat de points via ${paymentMethod === 'carte' ? 'carte bancaire' : 'Cash Plus'}`,
      methode: paymentMethod,
    });

    refreshUser();
    setIsProcessing(false);
    setShowConfirmDialog(false);

    toast.success('Achat réussi!', {
      description: `${pointsToAdd} points ont été ajoutés à votre compte`,
    });
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">Acheter des points</h1>
          <p className="text-muted-foreground mt-1">
            Rechargez votre solde pour rejoindre plus de sessions
          </p>
          <div className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-full bg-secondary/10">
            <Coins className="h-5 w-5 text-secondary" />
            <span className="font-semibold">Solde actuel: {user?.points} points</span>
          </div>
        </div>

        {/* Simulation Notice */}
        <Card className="mb-8 border-secondary/30 bg-secondary/5">
          <CardContent className="pt-6">
            <div className="flex gap-4 items-center">
              <div className="h-12 w-12 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="h-6 w-6 text-secondary" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Mode Démonstration</p>
                <p className="text-sm text-muted-foreground">
                  Ceci est une simulation. Aucun paiement réel ne sera effectué. 
                  Les points seront ajoutés instantanément à votre compte.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Points Packages */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Choisir un pack
            </h2>
            
            <div className="grid sm:grid-cols-2 gap-4">
              {pointsPackages.map((pack) => (
                <Card 
                  key={pack.id}
                  className={`cursor-pointer transition-all duration-200 ${
                    selectedPackage === pack.id 
                      ? 'border-2 border-primary shadow-lg shadow-primary/20' 
                      : 'border hover:border-primary/50'
                  } ${pack.popular ? 'relative overflow-hidden' : ''}`}
                  onClick={() => {
                    setSelectedPackage(pack.id);
                    setCustomAmount('');
                  }}
                >
                  {pack.popular && (
                    <div className="absolute top-0 right-0 bg-secondary text-secondary-foreground text-xs font-semibold px-3 py-1 rounded-bl-lg">
                      Populaire
                    </div>
                  )}
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="h-12 w-12 rounded-full gradient-primary flex items-center justify-center">
                        <Coins className="h-6 w-6 text-primary-foreground" />
                      </div>
                      {selectedPackage === pack.id && (
                        <CheckCircle2 className="h-6 w-6 text-primary" />
                      )}
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold">{pack.points}</span>
                        <span className="text-muted-foreground">points</span>
                      </div>
                      {pack.bonus && (
                        <div className="flex items-center gap-1 text-success text-sm font-medium">
                          <Gift className="h-4 w-4" />
                          +{pack.bonus} points bonus
                        </div>
                      )}
                      <div className="text-lg font-semibold text-foreground">
                        {pack.price} DH
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Custom Amount */}
            <Card className={`${customAmount ? 'border-2 border-primary' : ''}`}>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                    <Zap className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <Label htmlFor="custom" className="text-base font-semibold">Montant personnalisé</Label>
                    <div className="flex items-center gap-2 mt-2">
                      <Input
                        id="custom"
                        type="number"
                        min="10"
                        placeholder="Entrer le nombre de points"
                        value={customAmount}
                        onChange={(e) => {
                          setCustomAmount(e.target.value);
                          if (e.target.value) setSelectedPackage('');
                        }}
                        className="max-w-[200px]"
                      />
                      <span className="text-muted-foreground">points</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment Method & Summary */}
          <div className="space-y-4">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Mode de paiement</CardTitle>
                <CardDescription>Choisissez comment payer</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <RadioGroup
                  value={paymentMethod}
                  onValueChange={(value) => setPaymentMethod(value as 'carte' | 'cash_plus')}
                  className="space-y-3"
                >
                  <div className={`flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    paymentMethod === 'carte' ? 'border-primary bg-primary/5' : 'border-border'
                  }`}>
                    <RadioGroupItem value="carte" id="carte" />
                    <Label htmlFor="carte" className="flex items-center gap-3 cursor-pointer flex-1">
                      <CreditCard className="h-5 w-5 text-primary" />
                      <div>
                        <div className="font-medium">Carte bancaire</div>
                        <div className="text-xs text-muted-foreground">Visa, Mastercard</div>
                      </div>
                    </Label>
                  </div>
                  <div className={`flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    paymentMethod === 'cash_plus' ? 'border-primary bg-primary/5' : 'border-border'
                  }`}>
                    <RadioGroupItem value="cash_plus" id="cash_plus" />
                    <Label htmlFor="cash_plus" className="flex items-center gap-3 cursor-pointer flex-1">
                      <Banknote className="h-5 w-5 text-success" />
                      <div>
                        <div className="font-medium">Cash Plus</div>
                        <div className="text-xs text-muted-foreground">Paiement en espèces</div>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>

                {/* Summary */}
                <div className="pt-4 border-t border-border space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Points</span>
                    <span className="font-medium">
                      {selectedPack?.points || customAmount || 0}
                    </span>
                  </div>
                  {selectedPack?.bonus && (
                    <div className="flex justify-between text-sm text-success">
                      <span>Bonus</span>
                      <span className="font-medium">+{selectedPack.bonus}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-bold pt-2 border-t border-border">
                    <span>Total</span>
                    <span className="text-primary">
                      {selectedPack 
                        ? `${selectedPack.points + (selectedPack.bonus || 0)} points`
                        : customAmount 
                          ? `${customAmount} points` 
                          : '0 points'
                      }
                    </span>
                  </div>
                </div>

                <Button
                  onClick={handlePurchase}
                  className="w-full gradient-primary text-primary-foreground"
                  disabled={!selectedPack && !customAmount}
                >
                  Acheter maintenant
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Confirmation Dialog */}
        <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmer l'achat</DialogTitle>
              <DialogDescription>
                Cette transaction est une simulation (aucun paiement réel).
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-4 space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted">
                <div className="flex items-center gap-3">
                  <Coins className="h-6 w-6 text-secondary" />
                  <span className="font-medium">Points à recevoir</span>
                </div>
                <span className="text-xl font-bold text-secondary">
                  {selectedPack 
                    ? selectedPack.points + (selectedPack.bonus || 0)
                    : customAmount
                  }
                </span>
              </div>
              
              <div className="flex items-center gap-3 p-4 rounded-lg border border-border">
                {paymentMethod === 'carte' ? (
                  <CreditCard className="h-5 w-5 text-primary" />
                ) : (
                  <Banknote className="h-5 w-5 text-success" />
                )}
                <span>{paymentMethod === 'carte' ? 'Carte bancaire' : 'Cash Plus'}</span>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowConfirmDialog(false)} disabled={isProcessing}>
                Annuler
              </Button>
              <Button 
                onClick={confirmPurchase} 
                className="gradient-primary text-primary-foreground"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  'Traitement en cours...'
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Confirmer
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default BuyPointsPage;
