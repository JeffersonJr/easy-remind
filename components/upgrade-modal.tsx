"use client"

import { useState } from 'react'
import { Crown, X, Check, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'

interface UpgradeModalProps {
  isOpen: boolean
  onClose: () => void
}

export function UpgradeModal({ isOpen, onClose }: UpgradeModalProps) {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly')

  const monthlyPrice = 19.90
  const yearlyPrice = 199.90
  const currentPrice = billingCycle === 'monthly' ? monthlyPrice : yearlyPrice
  const savings = billingCycle === 'yearly' ? Math.round(((monthlyPrice * 12 - yearlyPrice) / (monthlyPrice * 12)) * 100) : 0

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden">
        {/* Header */}
        <div className="relative p-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-white/80 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
          
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-full mb-4">
              <Crown className="h-6 w-6" />
            </div>
            <DialogTitle className="text-2xl font-bold mb-2">
              Desbloqueie o Poder PRO
            </DialogTitle>
            <p className="text-white/90">
              Você atingiu o limite de 10 lembretes no plano gratuito
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Billing Toggle */}
          <div className="flex justify-center">
            <div className="inline-flex items-center bg-muted rounded-lg p-1">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  billingCycle === 'monthly'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Mensal
              </button>
              <button
                onClick={() => setBillingCycle('yearly')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all relative ${
                  billingCycle === 'yearly'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Anual
                {savings > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-green-500 text-white text-xs">
                    -{savings}%
                  </Badge>
                )}
              </button>
            </div>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h3 className="font-semibold text-muted-foreground">Plano FREE</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span>•</span>
                  <span>10 lembretes ativos</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span>•</span>
                  <span>Parser básico</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span>•</span>
                  <span>Sincronização limitada</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 border rounded-lg p-4 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20 border-purple-200 dark:border-purple-800">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">Plano PRO</h3>
                <Badge className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
                  ILIMITADO
                </Badge>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-green-600">
                  <Check className="h-4 w-4" />
                  <span>Lembretes ilimitados</span>
                </div>
                <div className="flex items-center gap-2 text-green-600">
                  <Check className="h-4 w-4" />
                  <span>AI avançado (GPT-4)</span>
                </div>
                <div className="flex items-center gap-2 text-green-600">
                  <Check className="h-4 w-4" />
                  <span>Sincronização em tempo real</span>
                </div>
                <div className="flex items-center gap-2 text-green-600">
                  <Check className="h-4 w-4" />
                  <span>Exportação de dados</span>
                </div>
                <div className="flex items-center gap-2 text-green-600">
                  <Check className="h-4 w-4" />
                  <span>Prioridade no suporte</span>
                </div>
              </div>
            </div>
          </div>

          {/* Price */}
          <div className="text-center space-y-2">
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-4xl font-bold">R$</span>
              <span className="text-4xl font-bold">{currentPrice.toFixed(2)}</span>
              <span className="text-muted-foreground">
                /{billingCycle === 'monthly' ? 'mês' : 'ano'}
              </span>
            </div>
            {billingCycle === 'yearly' && (
              <p className="text-sm text-green-600">
                Economize R${((monthlyPrice * 12) - yearlyPrice).toFixed(2)} por ano
              </p>
            )}
          </div>

          {/* CTA */}
          <div className="space-y-3">
            <Button className="w-full zen-gradient text-white text-lg py-3" size="lg">
              <Sparkles className="h-5 w-5 mr-2" />
              Assinar Plano PRO
            </Button>
            
            <p className="text-center text-xs text-muted-foreground">
              Cancela a qualquer momento • 7 dias de garantia
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
