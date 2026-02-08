import { User, Session, Inscription, Transaction } from '@/types';

// Storage keys
const KEYS = {
  USERS: 'chra7liya_users',
  SESSIONS: 'chra7liya_sessions',
  INSCRIPTIONS: 'chra7liya_inscriptions',
  TRANSACTIONS: 'chra7liya_transactions',
  CURRENT_USER: 'chra7liya_current_user',
};

// Generic storage functions
const getFromStorage = <T>(key: string): T[] => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

const setToStorage = <T>(key: string, data: T[]): void => {
  localStorage.setItem(key, JSON.stringify(data));
};

// Users
export const getUsers = (): User[] => getFromStorage<User>(KEYS.USERS);

export const getUserById = (id: string): User | undefined => {
  const users = getUsers();
  return users.find(u => u.id === id);
};

export const getUserByEmail = (email: string): User | undefined => {
  const users = getUsers();
  return users.find(u => u.email.toLowerCase() === email.toLowerCase());
};

export const createUser = (userData: Omit<User, 'id' | 'points' | 'createdAt'>): User => {
  const users = getUsers();
  const newUser: User = {
    ...userData,
    id: `user-${Date.now()}`,
    points: 50, // Points de bienvenue
    createdAt: new Date().toISOString().split('T')[0],
  };
  users.push(newUser);
  setToStorage(KEYS.USERS, users);
  return newUser;
};

export const updateUser = (user: User): void => {
  const users = getUsers();
  const index = users.findIndex(u => u.id === user.id);
  if (index !== -1) {
    users[index] = user;
    setToStorage(KEYS.USERS, users);
  }
};

export const updateUserPoints = (userId: string, pointsDelta: number): void => {
  const users = getUsers();
  const index = users.findIndex(u => u.id === userId);
  if (index !== -1) {
    users[index].points += pointsDelta;
    setToStorage(KEYS.USERS, users);
  }
};

// Sessions
export const getSessions = (): Session[] => getFromStorage<Session>(KEYS.SESSIONS);

export const getSessionById = (id: string): Session | undefined => {
  const sessions = getSessions();
  return sessions.find(s => s.id === id);
};

export const getSessionsByAideur = (aideurId: string): Session[] => {
  const sessions = getSessions();
  return sessions.filter(s => s.aideurId === aideurId);
};

export const getSessionsByParticipant = (userId: string): Session[] => {
  const sessions = getSessions();
  return sessions.filter(s => s.participants.includes(userId));
};

export const createSession = (sessionData: Omit<Session, 'id' | 'participants' | 'status' | 'createdAt'>): Session => {
  const sessions = getSessions();
  const newSession: Session = {
    ...sessionData,
    id: `session-${Date.now()}`,
    participants: [],
    status: 'a_venir',
    createdAt: new Date().toISOString().split('T')[0],
  };
  sessions.push(newSession);
  setToStorage(KEYS.SESSIONS, sessions);
  return newSession;
};

export const updateSession = (session: Session): void => {
  const sessions = getSessions();
  const index = sessions.findIndex(s => s.id === session.id);
  if (index !== -1) {
    sessions[index] = session;
    setToStorage(KEYS.SESSIONS, sessions);
  }
};

export const addParticipantToSession = (sessionId: string, userId: string): boolean => {
  const sessions = getSessions();
  const session = sessions.find(s => s.id === sessionId);
  
  if (session && !session.participants.includes(userId) && session.participants.length < session.maxParticipants) {
    session.participants.push(userId);
    setToStorage(KEYS.SESSIONS, sessions);
    return true;
  }
  return false;
};

// Inscriptions
export const getInscriptions = (): Inscription[] => getFromStorage<Inscription>(KEYS.INSCRIPTIONS);

export const getInscriptionsByUser = (userId: string): Inscription[] => {
  const inscriptions = getInscriptions();
  return inscriptions.filter(i => i.apprenantId === userId);
};

export const getInscriptionsBySession = (sessionId: string): Inscription[] => {
  const inscriptions = getInscriptions();
  return inscriptions.filter(i => i.sessionId === sessionId);
};

export const createInscription = (sessionId: string, apprenantId: string, pointsDepenses: number): Inscription => {
  const inscriptions = getInscriptions();
  const newInscription: Inscription = {
    id: `inscription-${Date.now()}`,
    sessionId,
    apprenantId,
    dateInscription: new Date().toISOString().split('T')[0],
    pointsDepenses,
  };
  inscriptions.push(newInscription);
  setToStorage(KEYS.INSCRIPTIONS, inscriptions);
  return newInscription;
};

export const rateSession = (inscriptionId: string, note: number, commentaire?: string): void => {
  const inscriptions = getInscriptions();
  const index = inscriptions.findIndex(i => i.id === inscriptionId);
  if (index !== -1) {
    inscriptions[index].note = note;
    if (commentaire) inscriptions[index].commentaire = commentaire;
    setToStorage(KEYS.INSCRIPTIONS, inscriptions);
  }
};

// Transactions
export const getTransactions = (): Transaction[] => getFromStorage<Transaction>(KEYS.TRANSACTIONS);

export const getTransactionsByUser = (userId: string): Transaction[] => {
  const transactions = getTransactions();
  return transactions.filter(t => t.userId === userId).sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
};

export const createTransaction = (transactionData: Omit<Transaction, 'id' | 'date'>): Transaction => {
  const transactions = getTransactions();
  const newTransaction: Transaction = {
    ...transactionData,
    id: `trans-${Date.now()}`,
    date: new Date().toISOString().split('T')[0],
  };
  transactions.push(newTransaction);
  setToStorage(KEYS.TRANSACTIONS, transactions);
  return newTransaction;
};

// Auth helpers
export const getCurrentUser = (): User | null => {
  const data = localStorage.getItem(KEYS.CURRENT_USER);
  if (!data) return null;
  
  // Get fresh data from users storage
  const userId = JSON.parse(data).id;
  return getUserById(userId) || null;
};

export const setCurrentUser = (user: User | null): void => {
  if (user) {
    localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user));
  } else {
    localStorage.removeItem(KEYS.CURRENT_USER);
  }
};

export const login = (email: string, password: string): User | null => {
  const user = getUserByEmail(email);
  if (user && user.password === password) {
    setCurrentUser(user);
    return user;
  }
  return null;
};

export const logout = (): void => {
  setCurrentUser(null);
};
