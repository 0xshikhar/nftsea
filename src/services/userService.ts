import { PrismaClient } from '@prisma/client'
import { ethers } from 'ethers'

const prisma = new PrismaClient()

/**
 * Get or create a user based on Ethereum address
 * @param address Ethereum address
 * @returns User object
 */
export async function getOrCreateUser(address: string) {
    if (!address || !ethers.isAddress(address)) {
        throw new Error('Invalid Ethereum address')
    }

    const normalizedAddress = address.toLowerCase()

    // Try to find existing user
    let user = await prisma.user.findUnique({
        where: { address: normalizedAddress }
    })

    // Create new user if it doesn't exist
    if (!user) {
        user = await prisma.user.create({
            data: {
                address: normalizedAddress,
                username: `User_${normalizedAddress.substring(2, 8)}` // Default username
            }
        })
    }

    return user
}

/**
 * Update user profile information
 * @param address Ethereum address
 * @param data Updated user data
 * @returns Updated user object
 */
export async function updateUserProfile(address: string, data: {
    username?: string
    bio?: string
    avatarUrl?: string
    twitterUrl?: string
    websiteUrl?: string
}) {
    if (!address || !ethers.isAddress(address)) {
        throw new Error('Invalid Ethereum address')
    }

    const normalizedAddress = address.toLowerCase()

    // Update user data
    const updatedUser = await prisma.user.update({
        where: { address: normalizedAddress },
        data
    })

    return updatedUser
}

/**
 * Get user by Ethereum address
 * @param address Ethereum address
 * @returns User object or null if not found
 */
export async function getUserByAddress(address: string) {
    if (!address || !ethers.isAddress(address)) {
        throw new Error('Invalid Ethereum address')
    }

    const normalizedAddress = address.toLowerCase()

    return prisma.user.findUnique({
        where: { address: normalizedAddress }
    })
} 