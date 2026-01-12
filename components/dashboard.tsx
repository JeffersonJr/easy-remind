"use client"

import { useState } from 'react'
import { CommandBar } from './command-bar'
import { ReminderList } from './reminder-list'
import { ThemeToggle } from './theme-toggle'

export function Dashboard() {
  const [refreshKey, setRefreshKey] = useState(0)

  const handleReminderCreated = () => {
    setRefreshKey(prev => prev + 1)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold zen-text-gradient mb-2">
              EasyRemind
            </h1>
            <p className="text-muted-foreground">
              Lembretes inteligentes com linguagem natural
            </p>
          </div>
          <ThemeToggle />
        </div>

        {/* Command Bar */}
        <div className="mb-12">
          <CommandBar onReminderCreated={handleReminderCreated} />
        </div>

        {/* Reminder List */}
        <ReminderList key={refreshKey} />
      </div>
    </div>
  )
}
