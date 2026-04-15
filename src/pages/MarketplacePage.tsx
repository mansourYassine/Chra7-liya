import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Coins, ShoppingBag, Tag, User, ArrowUpDown, Plus, X, Store } from 'lucide-react';
import { getAvailableOffers, createOffer, buyOffer, cancelOffer, getOffersByUser } from '@/lib/marketplace';
import { getUserById } from '@/lib/storage';
import { createTransaction } from '@/lib/storage';
import { MarketplaceOffer } from '@/types';
import { useToast } from '@/hooks/use-toast';

const MarketplacePage = () => {
  const { user, refreshUser } = useAuth();
  const { toast } = useToast();
  const [offers, setOffers] = useState<MarketplaceOffer[]>([]);
  const [myOffers, setMyOffers] = useState<MarketplaceOffer[]>([]);
  const [showSellForm, setShowSellForm] = useState(false);
  const [sellPoints, setSellPoints] = useState('');
  const [sellPrice, setSellPrice] = useState('');
  const [sortBy, setSortBy] = useState<string>('recent');
  const [filterMinPoints, setFilterMinPoints] = useState('');
  const [filterMaxPrice, setFilterMaxPrice] = useState('');

  useEffect(() => {
    refreshUser();
    loadOffers();
  }, []);

  const loadOffers = () => {
    setOffers(getAvailableOffers());
    if (user) setMyOffers(getOffersByUser(user.id).filter(o => o.status === 'disponible'));
  };

  if (!user) return null;

  // Filter & sort
  let filtered = offers.filter(o => o.vendeurId !== user.id);
  if (filterMinPoints) filtered = filtered.filter(o => o.points >= Number(filterMinPoints));
  if (filterMaxPrice) filtered = filtered.filter(o => o.prixMAD <= Number(filterMaxPrice));

  if (sortBy === 'prix_asc') filtered.sort((a, b) => a.prixMAD - b.prixMAD);
  else if (sortBy === 'prix_desc') filtered.sort((a, b) => b.prixMAD - a.prixMAD);
  else if (sortBy === 'points_desc') filtered.sort((a, b) => b.points - a.points);
  else filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const handleSell = () => {
    const pts = Number(sellPoints);
    const price = Number(sellPrice);
    if (!pts || pts <= 0 || !price || price <= 0) {
      toast({ title: 'Erreur', description: 'Veuillez remplir tous les champs correctement.', variant: 'destructive' });
      return;
    }
    if (pts > user.points) {
      toast({ title: 'Solde insuffisant', description: `Vous n'avez que ${user.points} points.`, variant: 'destructive' });
      return;
    }
    const offer = createOffer(user.id, pts, price);
    if (offer) {
      createTransaction({ userId: user.id, type: 'depense', montant: pts, description: `Marketplace: ${pts} points mis en vente` });
      refreshUser();
      loadOffers();
      setSellPoints('');
      setSellPrice('');
      setShowSellForm(false);
      toast({ title: 'Offre publiée ✅', description: `${pts} points mis en vente pour ${price} MAD.` });
    }
  };

  const handleBuy = (offer: MarketplaceOffer) => {
    const vendeur = getUserById(offer.vendeurId);
    if (buyOffer(offer.id, user.id)) {
      createTransaction({ userId: user.id, type: 'achat', montant: offer.points, description: `Marketplace: achat de ${offer.points} points à ${vendeur?.prenom || 'un stagiaire'}` });
      createTransaction({ userId: offer.vendeurId, type: 'gain', montant: offer.prixMAD, description: `Marketplace: vente de ${offer.points} points` });
      refreshUser();
      loadOffers();
      toast({ title: 'Achat réussi ✅', description: `Vous avez acheté ${offer.points} points pour ${offer.prixMAD} MAD.` });
    }
  };

  const handleCancel = (offerId: string) => {
    if (cancelOffer(offerId, user.id)) {
      createTransaction({ userId: user.id, type: 'gain', montant: 0, description: 'Marketplace: offre annulée, points restitués' });
      refreshUser();
      loadOffers();
      toast({ title: 'Offre annulée', description: 'Vos points ont été restitués.' });
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <Store className="h-8 w-8 text-primary" />
              Marketplace
            </h1>
            <p className="text-muted-foreground mt-1">Achetez et vendez des points entre stagiaires</p>
          </div>
          <Button onClick={() => setShowSellForm(!showSellForm)} className="gap-2">
            <Plus className="h-4 w-4" />
            Vendre mes points
          </Button>
        </div>

        {/* Sell Form */}
        {showSellForm && (
          <Card className="border-0 shadow-lg mb-8 animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="h-5 w-5 text-secondary" />
                Publier une offre de vente
              </CardTitle>
              <CardDescription>Votre solde actuel : <strong className="text-secondary">{user.points} points</strong></CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                <div>
                  <Label>Nombre de points</Label>
                  <Input type="number" min="1" max={user.points} placeholder="Ex: 50" value={sellPoints} onChange={e => setSellPoints(e.target.value)} />
                </div>
                <div>
                  <Label>Prix demandé (MAD)</Label>
                  <Input type="number" min="1" placeholder="Ex: 50" value={sellPrice} onChange={e => setSellPrice(e.target.value)} />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleSell} className="flex-1">Publier</Button>
                  <Button variant="ghost" onClick={() => setShowSellForm(false)}><X className="h-4 w-4" /></Button>
                </div>
              </div>
              {sellPoints && sellPrice && Number(sellPoints) > 0 && Number(sellPrice) > 0 && (
                <p className="text-sm text-muted-foreground mt-3">
                  💡 Prix unitaire : <strong>{(Number(sellPrice) / Number(sellPoints)).toFixed(2)} MAD/point</strong>
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {/* My active offers */}
        {myOffers.length > 0 && (
          <Card className="border-0 shadow-lg mb-8">
            <CardHeader>
              <CardTitle className="text-lg">Mes offres en cours ({myOffers.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {myOffers.map(offer => (
                  <div key={offer.id} className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/30">
                    <div>
                      <span className="font-semibold text-secondary">{offer.points} pts</span>
                      <span className="text-muted-foreground mx-2">→</span>
                      <span className="font-semibold">{offer.prixMAD} MAD</span>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => handleCancel(offer.id)} className="text-destructive hover:text-destructive">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <ArrowUpDown className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Trier par" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Plus récentes</SelectItem>
              <SelectItem value="prix_asc">Prix croissant</SelectItem>
              <SelectItem value="prix_desc">Prix décroissant</SelectItem>
              <SelectItem value="points_desc">Plus de points</SelectItem>
            </SelectContent>
          </Select>
          <Input type="number" placeholder="Points min." className="w-[140px]" value={filterMinPoints} onChange={e => setFilterMinPoints(e.target.value)} />
          <Input type="number" placeholder="Prix max. (MAD)" className="w-[160px]" value={filterMaxPrice} onChange={e => setFilterMaxPrice(e.target.value)} />
        </div>

        {/* Offers Grid */}
        {filtered.length === 0 ? (
          <Card className="border-0 shadow-lg">
            <CardContent className="py-16 text-center">
              <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
              <h3 className="text-lg font-semibold text-muted-foreground">Aucune offre disponible</h3>
              <p className="text-sm text-muted-foreground mt-1">Soyez le premier à vendre vos points !</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(offer => {
              const vendeur = getUserById(offer.vendeurId);
              const unitPrice = (offer.prixMAD / offer.points).toFixed(2);
              return (
                <Card key={offer.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
                        {vendeur?.prenom[0]}{vendeur?.nom[0]}
                      </div>
                      <div>
                        <p className="font-medium">{vendeur?.prenom} {vendeur?.nom}</p>
                        <p className="text-xs text-muted-foreground">{vendeur?.filiere}</p>
                      </div>
                    </div>
                    <div className="flex items-baseline justify-between mb-2">
                      <div>
                        <span className="text-2xl font-bold text-secondary">{offer.points}</span>
                        <span className="text-sm text-muted-foreground ml-1">points</span>
                      </div>
                      <div className="text-right">
                        <span className="text-xl font-bold">{offer.prixMAD}</span>
                        <span className="text-sm text-muted-foreground ml-1">MAD</span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mb-4">{unitPrice} MAD/point</p>
                    <Button className="w-full gap-2" onClick={() => handleBuy(offer)}>
                      <Coins className="h-4 w-4" />
                      Acheter
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MarketplacePage;