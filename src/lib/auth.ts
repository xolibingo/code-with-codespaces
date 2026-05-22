import { User, Role } from '../types';
import { getUsers, saveUser, updateUser, setCurrentUser, setAuthToken, incrementUserCount, getUserCount } from './storage';

const ADMIN_EMAIL = 'bingosamu@gmail.com';

function generateId(): string {
  return crypto.randomUUID();
}

function generateReferralCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export function login(email: string, _password: string): User | null {
  // bingosamu@gmail.com always works as admin
  if (email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
    const users = getUsers();
    let adminUser = users.find(u => u.email.toLowerCase() === ADMIN_EMAIL.toLowerCase());
    if (!adminUser) {
      adminUser = {
        id: generateId(),
        email: ADMIN_EMAIL,
        name: 'Bingo Admin',
        phone: '+27000000000',
        country: 'ZA',
        role: 'admin',
        referralCode: 'ADMIN0001',
        discount: 0,
        createdAt: new Date().toISOString(),
        blocked: false,
      };
      saveUser(adminUser);
    } else if (adminUser.role !== 'admin') {
      adminUser = { ...adminUser, role: 'admin' };
      updateUser(adminUser);
    }
    setCurrentUser(adminUser);
    setAuthToken(generateId());
    return adminUser;
  }

  const users = getUsers();
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!user) return null;
  if (user.blocked) return null;

  setCurrentUser(user);
  setAuthToken(generateId());
  return user;
}

export function signup(data: {
  name: string;
  email: string;
  password: string;
  phone: string;
  country: string;
  referredBy?: string;
}): User {
  const users = getUsers();
  const existing = users.find(u => u.email.toLowerCase() === data.email.toLowerCase());
  if (existing) throw new Error('Email already registered');

  const count = incrementUserCount();
  const discount = count <= 50 ? 10 : 0;

  // Award referrer if applicable
  if (data.referredBy) {
    const referrer = users.find(u => u.referralCode === (data.referredBy ?? '').toUpperCase());
    if (referrer) {
      const referrals = parseInt(localStorage.getItem(`bc_referrals_${referrer.id}`) || '0') + 1;
      localStorage.setItem(`bc_referrals_${referrer.id}`, referrals.toString());
    }
  }

  const isAdmin = data.email.toLowerCase() === ADMIN_EMAIL.toLowerCase();

  const newUser: User = {
    id: generateId(),
    email: data.email,
    name: data.name,
    phone: data.phone,
    country: data.country,
    role: isAdmin ? 'admin' : 'client',
    referralCode: generateReferralCode(),
    referredBy: data.referredBy?.toUpperCase() || undefined,
    discount,
    createdAt: new Date().toISOString(),
    blocked: false,
  };

  saveUser(newUser);
  setCurrentUser(newUser);
  setAuthToken(generateId());
  return newUser;
}

export function sendOTP(phone: string): string {
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiry = Date.now() + 5 * 60 * 1000; // 5 minutes
  sessionStorage.setItem(`otp_${phone}`, JSON.stringify({ code, expiry }));
  console.log(`OTP for ${phone}: ${code}`); // In real app, would send SMS
  return code;
}

export function verifyOTP(phone: string, code: string): boolean {
  const stored = sessionStorage.getItem(`otp_${phone}`);
  if (!stored) return false;
  const { code: storedCode, expiry } = JSON.parse(stored);
  if (Date.now() > expiry) {
    sessionStorage.removeItem(`otp_${phone}`);
    return false;
  }
  if (storedCode !== code) return false;
  sessionStorage.removeItem(`otp_${phone}`);
  return true;
}

export function googleSignIn(): User {
  const mockEmails = [
    'user@gmail.com',
    'testuser@gmail.com',
    'john.doe@gmail.com',
    'jane.smith@gmail.com',
  ];
  const randomEmail = `google_${Date.now()}@gmail.com`;

  const users = getUsers();
  // Check if we have a google user already (session-based, use the most recent)
  const existingGoogle = users.find(u => u.email.startsWith('google_'));

  if (existingGoogle) {
    setCurrentUser(existingGoogle);
    setAuthToken(generateId());
    return existingGoogle;
  }

  const count = incrementUserCount();
  const discount = count <= 50 ? 10 : 0;
  const newUser: User = {
    id: generateId(),
    email: randomEmail,
    name: 'Google User',
    phone: '',
    country: 'ZA',
    role: 'client',
    referralCode: generateReferralCode(),
    discount,
    createdAt: new Date().toISOString(),
    blocked: false,
  };

  saveUser(newUser);
  setCurrentUser(newUser);
  setAuthToken(generateId());
  return newUser;
}

export function getReferralCount(userId: string): number {
  return parseInt(localStorage.getItem(`bc_referrals_${userId}`) || '0');
}

export function getUserCountValue(): number {
  return getUserCount();
}
