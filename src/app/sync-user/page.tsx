import { auth, clerkClient } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import React from 'react'
import { db } from '~/server/db'

const SyncUser = async () => {

    const { userId } = await auth()

    if (!userId) {
        throw new Error('Not authenticated')
    }

    const client = await clerkClient()

    const user = await client.users.getUser(userId)

    if (!user.emailAddresses[0]?.emailAddress) {
        throw new Error('User not found')
    }
    await db.user.upsert({
        where: { emailAddress: user.emailAddresses[0].emailAddress },
        update: {
            id: user.id,
            imageUrl: user.imageUrl,
            firstName: user.firstName,
            lastName: user.lastName,

        },
        create: {
            id: user.id,
            emailAddress: user.emailAddresses[0].emailAddress,
            imageUrl: user.imageUrl,
            firstName: user.firstName,
            lastName: user.lastName,
        },
    })
    return redirect('/dashboard')
}

export default SyncUser