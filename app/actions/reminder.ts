'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function createReminder(data: {
  content: string
  rawText: string
  isRecurring: boolean
  frequency?: 'WEEKLY' | 'DAILY' | 'MONTHLY'
  daysOfWeek?: number[]
  nextRunAt: Date
}) {
  try {
    // TODO: Implement user authentication and get actual userId
    const userId = 'temp-user-id'
    
    // Check user's plan limits
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { reminders: { where: { status: 'PENDING' } } }
    })

    if (!user) {
      throw new Error('User not found')
    }

    if (user.plan === 'FREE' && user.reminders.length >= 10) {
      return { 
        success: false, 
        error: 'FREE_PLAN_LIMIT',
        message: 'Você atingiu o limite de 10 lembretes no plano gratuito. Faça upgrade para o plano PRO!'
      }
    }

    const reminder = await prisma.reminder.create({
      data: {
        userId,
        content: data.content,
        rawText: data.rawText,
        isRecurring: data.isRecurring,
        frequency: data.frequency,
        daysOfWeek: data.daysOfWeek,
        nextRunAt: data.nextRunAt,
      }
    })

    revalidatePath('/')
    return { success: true, reminder }
  } catch (error) {
    console.error('Error creating reminder:', error)
    throw new Error('Falha ao criar lembrete. Tente novamente.')
  }
}

export async function getReminders() {
  try {
    // TODO: Implement user authentication and get actual userId
    const userId = 'temp-user-id'
    
    const reminders = await prisma.reminder.findMany({
      where: { 
        userId,
        status: 'PENDING'
      },
      orderBy: { nextRunAt: 'asc' }
    })

    return reminders
  } catch (error) {
    console.error('Error fetching reminders:', error)
    throw new Error('Falha ao buscar lembretes.')
  }
}

export async function deleteReminder(id: string) {
  try {
    // TODO: Implement user authentication and get actual userId
    const userId = 'temp-user-id'
    
    const reminder = await prisma.reminder.deleteMany({
      where: { 
        id,
        userId // Ensure user can only delete their own reminders
      }
    })

    if (reminder.count === 0) {
      throw new Error('Reminder not found')
    }

    revalidatePath('/')
    return { success: true }
  } catch (error) {
    console.error('Error deleting reminder:', error)
    throw new Error('Falha ao deletar lembrete.')
  }
}
