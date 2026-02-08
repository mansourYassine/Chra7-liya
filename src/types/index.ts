// Types for Chra7 liya application

export interface User {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  password: string;
  age: number;
  ville: string;
  sexe: 'homme' | 'femme';
  filiere: string;
  annee: 1 | 2;
  points: number;
  avatar?: string;
  createdAt: string;
}

export interface Session {
  id: string;
  aideurId: string;
  module: string;
  date: string;
  duree: number; // en minutes
  mode: 'en_ligne' | 'presentiel';
  cout: number; // en points
  description: string;
  lieu?: string; // pour le présentiel
  lienReunion?: string; // pour en ligne
  maxParticipants: number;
  participants: string[]; // IDs des participants
  status: 'a_venir' | 'en_cours' | 'terminee' | 'annulee';
  createdAt: string;
}

export interface Inscription {
  id: string;
  sessionId: string;
  apprenantId: string;
  dateInscription: string;
  pointsDepenses: number;
  note?: number; // 1-5 étoiles
  commentaire?: string;
}

export interface Transaction {
  id: string;
  userId: string;
  type: 'achat' | 'gain' | 'depense';
  montant: number;
  description: string;
  date: string;
  methode?: 'carte' | 'cash_plus';
}

export interface AuthState {
  isAuthenticated: boolean;
  currentUser: User | null;
}

// Filières disponibles au CMC
export const FILIERES = [
  'Développement Digital',
  'Infrastructure Digitale',
  'Gestion des Entreprises',
  'Commerce',
  'Comptabilité',
  'Électricité',
  'Mécanique Automobile',
  'Froid et Climatisation',
] as const;

// Villes du Maroc
export const VILLES = [
  'Casablanca',
  'Rabat',
  'Marrakech',
  'Fès',
  'Tanger',
  'Agadir',
  'Meknès',
  'Oujda',
  'Kénitra',
  'Tétouan',
  'Salé',
  'Nador',
  'Mohammedia',
  'El Jadida',
  'Beni Mellal',
] as const;

// Modules communs
export const MODULES = [
  'Programmation Web',
  'Base de données',
  'Réseaux informatiques',
  'Anglais technique',
  'Français professionnel',
  'Mathématiques',
  'Comptabilité générale',
  'Marketing',
  'Gestion de projet',
  'Électronique',
  'Mécanique',
  'Dessin technique',
  'Communication',
  'Droit des affaires',
] as const;
