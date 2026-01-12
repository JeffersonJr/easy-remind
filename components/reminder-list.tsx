"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Trash2, Calendar, Clock, Repeat } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getReminders, deleteReminder } from '@/app/actions/reminder'
import { useToast } from '@/components/ui/use-toast'

interface Reminder {
  id: string
  content: string
  rawText: string
  isRecurring: boolean
  frequency?: 'WEEKLY' | 'DAILY' | 'MONTHLY'
  daysOfWeek?: number[]
  nextRunAt: Date
  status: 'PENDING' | 'SENT' | 'CANCELED'
  createdAt: Date
  updatedAt: Date
}

export function ReminderList() {
  const [reminders, setReminders] = useState<Reminder[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchReminders()
  }, [])

  const fetchReminders = async () => {
    try {
      setLoading(true)
      const data = await getReminders()
      setReminders(data)
    } catch (error) {
      toast({
        title: "Erro ao carregar lembretes",
        description: "Não foi possível buscar seus lembretes.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    try {
      await deleteReminder(id)
      setReminders(prev => prev.filter(r => r.id !== id))
      toast({
        title: "Lembrete removido",
        description: "O lembrete foi excluído com sucesso.",
      })
    } catch (error) {
      toast({
        title: "Erro ao remover",
        description: "Não foi possível remover o lembrete.",
        variant: "destructive"
      })
    } finally {
      setDeletingId(null)
    }
  }

  const categorizeReminders = () => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const categories = {
      overdue: [] as Reminder[],
      today: [] as Reminder[],
      soon: [] as Reminder[],
      upcoming: [] as Reminder[]
    }

    reminders.forEach(reminder => {
      const reminderDate = new Date(reminder.nextRunAt)
      
      if (reminderDate < now) {
        categories.overdue.push(reminder)
      } else if (reminderDate < tomorrow) {
        categories.today.push(reminder)
      } else if (reminderDate < new Date(tomorrow.getTime() + 7 * 24 * 60 * 60 * 1000)) {
        categories.soon.push(reminder)
      } else {
        categories.upcoming.push(reminder)
      }
    })

    return categories
  }

  const categories = categorizeReminders()
  const hasReminders = Object.values(categories).some(cat => cat.length > 0)

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-muted rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  if (!hasReminders) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12"
      >
        <div className="text-6xl mb-4">📝</div>
        <h3 className="text-xl font-semibold mb-2">Nenhum lembrete ainda</h3>
        <p className="text-muted-foreground">
          Comece criando seu primeiro lembrete usando a barra de comando acima.
        </p>
      </motion.div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Desktop Grid View */}
      <div className="hidden md:grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
        {categories.overdue.length > 0 && (
          <CategorySection
            title="Atrasados"
            color="text-red-500"
            reminders={categories.overdue}
            onDelete={handleDelete}
            deletingId={deletingId}
          />
        )}
        {categories.today.length > 0 && (
          <CategorySection
            title="Hoje"
            color="text-blue-500"
            reminders={categories.today}
            onDelete={handleDelete}
            deletingId={deletingId}
          />
        )}
        {categories.soon.length > 0 && (
          <CategorySection
            title="Em Breve"
            color="text-yellow-500"
            reminders={categories.soon}
            onDelete={handleDelete}
            deletingId={deletingId}
          />
        )}
        {categories.upcoming.length > 0 && (
          <CategorySection
            title="Próximos"
            color="text-green-500"
            reminders={categories.upcoming}
            onDelete={handleDelete}
            deletingId={deletingId}
          />
        )}
      </div>

      {/* Mobile List View */}
      <div className="md:hidden space-y-4">
        <AnimatePresence>
          {reminders.map((reminder) => (
            <motion.div
              key={reminder.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              layout
            >
              <ReminderCard
                reminder={reminder}
                onDelete={handleDelete}
                deletingId={deletingId}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}

function CategorySection({ 
  title, 
  color, 
  reminders, 
  onDelete, 
  deletingId 
}: {
  title: string
  color: string
  reminders: Reminder[]
  onDelete: (id: string) => Promise<void>
  deletingId: string | null
}) {
  return (
    <div>
      <h3 className={`font-semibold mb-3 flex items-center gap-2 ${color}`}>
        <span className="text-lg">{title}</span>
        <Badge variant="secondary" className="text-xs">
          {reminders.length}
        </Badge>
      </h3>
      <div className="space-y-3">
        <AnimatePresence>
          {reminders.map((reminder) => (
            <motion.div
              key={reminder.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              layout
            >
              <ReminderCard
                reminder={reminder}
                onDelete={onDelete}
                deletingId={deletingId}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}

function ReminderCard({ 
  reminder, 
  onDelete, 
  deletingId 
}: {
  reminder: Reminder
  onDelete: (id: string) => Promise<void>
  deletingId: string | null
}) {
  const isOverdue = new Date(reminder.nextRunAt) < new Date()
  
  return (
    <Card className={`${isOverdue ? 'border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-950/20' : ''}`}>
      <CardContent className="p-4">
        <div className="flex justify-between items-start gap-3">
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-sm mb-2 truncate">
              {reminder.content}
            </h4>
            
            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {format(new Date(reminder.nextRunAt), "dd/MMM", { locale: ptBR })}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {format(new Date(reminder.nextRunAt), "HH:mm")}
              </div>
              {reminder.isRecurring && (
                <div className="flex items-center gap-1">
                  <Repeat className="h-3 w-3" />
                  {reminder.frequency === 'DAILY' ? 'Diário' : 
                   reminder.frequency === 'WEEKLY' ? 'Semanal' : 'Mensal'}
                </div>
              )}
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(reminder.id)}
            disabled={deletingId === reminder.id}
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
