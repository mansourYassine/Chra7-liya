import { User, Session, Inscription, Transaction } from '@/types';

// Mock Users
export const mockUsers: User[] = [
  {
    id: 'user-1',
    nom: 'Bennani',
    prenom: 'Youssef',
    email: 'youssef.bennani@cmc.ma',
    password: 'password123',
    age: 20,
    ville: 'Casablanca',
    sexe: 'homme',
    filiere: 'Développement Digital',
    annee: 2,
    points: 150,
    createdAt: '2024-01-15',
  },
  {
    id: 'user-2',
    nom: 'El Amrani',
    prenom: 'Fatima',
    email: 'fatima.elamrani@cmc.ma',
    password: 'password123',
    age: 19,
    ville: 'Rabat',
    sexe: 'femme',
    filiere: 'Gestion des Entreprises',
    annee: 1,
    points: 80,
    createdAt: '2024-02-10',
  },
  {
    id: 'user-3',
    nom: 'Tazi',
    prenom: 'Ahmed',
    email: 'ahmed.tazi@cmc.ma',
    password: 'password123',
    age: 21,
    ville: 'Marrakech',
    sexe: 'homme',
    filiere: 'Infrastructure Digitale',
    annee: 2,
    points: 200,
    createdAt: '2024-01-20',
  },
  {
    id: 'user-4',
    nom: 'Chraibi',
    prenom: 'Sara',
    email: 'sara.chraibi@cmc.ma',
    password: 'password123',
    age: 20,
    ville: 'Fès',
    sexe: 'femme',
    filiere: 'Développement Digital',
    annee: 2,
    points: 120,
    createdAt: '2024-03-05',
  },
];

// Mock Sessions
export const mockSessions: Session[] = [
  {
    id: 'session-1',
    aideurId: 'user-1',
    module: 'Programmation Web',
    date: '2025-02-15T14:00:00',
    duree: 90,
    mode: 'en_ligne',
    cout: 20,
    description: 'Session de révision sur HTML, CSS et JavaScript. Nous allons revoir les bases et faire des exercices pratiques.',
    lienReunion: 'https://meet.example.com/session-1',
    maxParticipants: 10,
    participants: ['user-2'],
    status: 'a_venir',
    createdAt: '2025-02-01',
  },
  {
    id: 'session-2',
    aideurId: 'user-3',
    module: 'Réseaux informatiques',
    date: '2025-02-12T10:00:00',
    duree: 60,
    mode: 'presentiel',
    cout: 15,
    description: 'Configuration des réseaux LAN et WLAN. Apportez vos ordinateurs portables!',
    lieu: 'Salle B12, CMC Casablanca',
    maxParticipants: 8,
    participants: ['user-1', 'user-4'],
    status: 'a_venir',
    createdAt: '2025-02-02',
  },
  {
    id: 'session-3',
    aideurId: 'user-4',
    module: 'Base de données',
    date: '2025-02-10T16:00:00',
    duree: 120,
    mode: 'en_ligne',
    cout: 25,
    description: 'SQL avancé : jointures, sous-requêtes et optimisation. Niveau intermédiaire requis.',
    lienReunion: 'https://meet.example.com/session-3',
    maxParticipants: 15,
    participants: ['user-2'],
    status: 'terminee',
    createdAt: '2025-02-01',
  },
  {
    id: 'session-4',
    aideurId: 'user-1',
    module: 'Gestion de projet',
    date: '2025-02-20T09:00:00',
    duree: 90,
    mode: 'presentiel',
    cout: 18,
    description: 'Introduction à la méthode Agile et Scrum. Idéal pour les débutants.',
    lieu: 'Salle A5, CMC Rabat',
    maxParticipants: 12,
    participants: [],
    status: 'a_venir',
    createdAt: '2025-02-05',
  },
];

// Mock Inscriptions
export const mockInscriptions: Inscription[] = [
  {
    id: 'inscription-1',
    sessionId: 'session-1',
    apprenantId: 'user-2',
    dateInscription: '2025-02-03',
    pointsDepenses: 20,
  },
  {
    id: 'inscription-2',
    sessionId: 'session-2',
    apprenantId: 'user-1',
    dateInscription: '2025-02-04',
    pointsDepenses: 15,
  },
  {
    id: 'inscription-3',
    sessionId: 'session-2',
    apprenantId: 'user-4',
    dateInscription: '2025-02-05',
    pointsDepenses: 15,
  },
  {
    id: 'inscription-4',
    sessionId: 'session-3',
    apprenantId: 'user-2',
    dateInscription: '2025-02-02',
    pointsDepenses: 25,
    note: 5,
    commentaire: 'Excellente explication, très claire!',
  },
];

// Mock Transactions
export const mockTransactions: Transaction[] = [
  {
    id: 'trans-1',
    userId: 'user-1',
    type: 'achat',
    montant: 100,
    description: 'Achat de points via carte bancaire',
    date: '2025-01-20',
    methode: 'carte',
  },
  {
    id: 'trans-2',
    userId: 'user-1',
    type: 'gain',
    montant: 50,
    description: 'Session: Programmation Web (2 participants)',
    date: '2025-02-01',
  },
  {
    id: 'trans-3',
    userId: 'user-2',
    type: 'depense',
    montant: 20,
    description: 'Inscription: Programmation Web',
    date: '2025-02-03',
  },
  {
    id: 'trans-4',
    userId: 'user-2',
    type: 'achat',
    montant: 50,
    description: 'Achat de points via Cash Plus',
    date: '2025-01-25',
    methode: 'cash_plus',
  },
];

// Initialize localStorage with mock data if empty
export const initializeMockData = () => {
  if (!localStorage.getItem('chra7liya_users')) {
    localStorage.setItem('chra7liya_users', JSON.stringify(mockUsers));
  }
  if (!localStorage.getItem('chra7liya_sessions')) {
    localStorage.setItem('chra7liya_sessions', JSON.stringify(mockSessions));
  }
  if (!localStorage.getItem('chra7liya_inscriptions')) {
    localStorage.setItem('chra7liya_inscriptions', JSON.stringify(mockInscriptions));
  }
  if (!localStorage.getItem('chra7liya_transactions')) {
    localStorage.setItem('chra7liya_transactions', JSON.stringify(mockTransactions));
  }
};
