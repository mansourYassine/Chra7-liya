// Marketplace storage functions
import { MarketplaceOffer } from '@/types';
import { getUserById, updateUserPoints } from './storage';

const KEYS = {
  OFFERS: 'chra7liya_marketplace_offers',
};

const getFromStorage = <T>(key: string): T[] => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

const setToStorage = <T>(key: string, data: T[]): void => {
  localStorage.setItem(key, JSON.stringify(data));
};

// Get all available offers
export const getMarketplaceOffers = (): MarketplaceOffer[] => 
  getFromStorage<MarketplaceOffer>(KEYS.OFFERS);

export const getAvailableOffers = (): MarketplaceOffer[] =>
  getMarketplaceOffers().filter(o => o.status === 'disponible');

export const getOffersByUser = (userId: string): MarketplaceOffer[] =>
  getMarketplaceOffers().filter(o => o.vendeurId === userId);

// Create a new sell offer
export const createOffer = (vendeurId: string, points: number, prixMAD: number): MarketplaceOffer | null => {
  const user = getUserById(vendeurId);
  if (!user || user.points < points) return null;

  // Deduct points from seller immediately (reserved)
  updateUserPoints(vendeurId, -points);

  const offers = getMarketplaceOffers();
  const newOffer: MarketplaceOffer = {
    id: `offer-${Date.now()}`,
    vendeurId,
    points,
    prixMAD,
    status: 'disponible',
    createdAt: new Date().toISOString().split('T')[0],
  };
  offers.push(newOffer);
  setToStorage(KEYS.OFFERS, offers);
  return newOffer;
};

// Buy an offer
export const buyOffer = (offerId: string, buyerId: string): boolean => {
  const offers = getMarketplaceOffers();
  const index = offers.findIndex(o => o.id === offerId);
  if (index === -1 || offers[index].status !== 'disponible') return false;
  if (offers[index].vendeurId === buyerId) return false;

  const offer = offers[index];

  // Add points to buyer
  updateUserPoints(buyerId, offer.points);

  // Mark offer as sold
  offers[index].status = 'vendue';
  setToStorage(KEYS.OFFERS, offers);
  return true;
};

// Cancel an offer (return points to seller)
export const cancelOffer = (offerId: string, userId: string): boolean => {
  const offers = getMarketplaceOffers();
  const index = offers.findIndex(o => o.id === offerId);
  if (index === -1 || offers[index].status !== 'disponible' || offers[index].vendeurId !== userId) return false;

  updateUserPoints(userId, offers[index].points);
  offers.splice(index, 1);
  setToStorage(KEYS.OFFERS, offers);
  return true;
};