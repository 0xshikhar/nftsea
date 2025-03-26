import { generateNonce, SiweMessage } from 'siwe';
// import { prisma } from './prisma';
import jwt from 'jsonwebtoken';

export async function createAuthMessage(address: string, chainId: number) {
    const nonce = generateNonce();
    const message = new SiweMessage({
        domain: window.location.host,
        address,
        statement: 'Sign in to NFTsea marketplace',
        uri: window.location.origin,
        version: '1',
        chainId,
        nonce
    });

    return message.prepareMessage();
}

export async function verifySignature(message: string, signature: string) {
    const siweMessage = new SiweMessage(message);
    const fields = await siweMessage.verify({ signature });
    return fields.data;
}

// Define the user type for the JWT payload
export interface JwtPayload {
    userId: string;
    address: string;
    iat?: number;
    exp?: number;
}

// Generate a JWT token
export function generateJwtToken(payload: { userId: string; address: string }) {
    const secret = process.env.JWT_SECRET || 'your-secret-key';

    return jwt.sign(payload, secret, {
        expiresIn: '7d' // Token expires in 7 days
    });
}

// Verify a JWT token
export function verifyJwtToken(token: string) {
    const secret = process.env.JWT_SECRET || 'your-secret-key';

    try {
        return jwt.verify(token, secret);
    } catch (error) {
        return null;
    }
}

// Debug function to check token validity
export function debugJwtToken(token: string): { valid: boolean; payload?: JwtPayload; error?: string } {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
        return { valid: false, error: 'JWT_SECRET is not defined' };
    }

    try {
        const decoded = jwt.verify(token, secret);
        return { valid: true, payload: decoded as JwtPayload };
    } catch (error) {
        return {
            valid: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        };
    }
}

// Auth utilities for client
export function getAuthToken() {
    if (typeof window === 'undefined') return null;

    return localStorage.getItem('auth_token');
}

export function setAuthToken(token: string) {
    if (typeof window === 'undefined') return;

    localStorage.setItem('auth_token', token);
}

export function clearAuthToken() {
    if (typeof window === 'undefined') return;

    localStorage.removeItem('auth_token');
}

export function getAuthHeader() {
    const token = getAuthToken();

    return token ? { Authorization: `Bearer ${token}` } : {};
}
