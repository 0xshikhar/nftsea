import { NextRequest, NextResponse } from 'next/server';
import { generateJwtToken } from '@/lib/auth';
import { SiweMessage } from 'siwe';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, signature } = body;

    if (!message || !signature) {
      return NextResponse.json(
        { error: 'Missing message or signature' },
        { status: 400 }
      );
    }

    console.log('Message:', message);
    console.log('Signature:', signature);

    // Verify the SIWE message
    const siweMessage = new SiweMessage(message);
    const { success, data } = await siweMessage.verify({
      signature,
    });

    if (!success) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    // Get the address from the verified message
    const walletAddress = data.address;

    console.log('Wallet Address:', walletAddress);

    // Find or create user in database
    const user = await prisma.user.upsert({
      where: { address: walletAddress.toLowerCase() },
      update: { updatedAt: new Date() },
      create: {
        address: walletAddress.toLowerCase(),
        updatedAt: new Date(),
      },
    });

    console.log('User:', user);

    // Generate JWT token
    const token = generateJwtToken({
      userId: user.id,
      address: user.address,
    });

    console.log('Token:', token);

    // Return token and user data
    return NextResponse.json({
      token,
      user: {
        id: user.id,
        address: user.address,
        username: user.username,
        createdAt: user.createdAt,
        avatar: user.avatar,
        bio: user.bio,
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
} 