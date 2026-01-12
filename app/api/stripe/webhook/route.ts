import { NextRequest, NextResponse } from 'next/server'

// Webhook handler para Stripe
// TODO: Implementar quando estiver pronto para monetização

export async function POST(request: NextRequest) {
  const body = await request.text()
  const sig = request.headers.get('stripe-signature')

  // TODO: Implementar webhook handler
  // let event: Stripe.Event

  // try {
  //   event = stripe.webhooks.constructEvent(body, sig!, webhookSecret)
  // } catch (err) {
  //   return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 })
  // }

  // TODO: Handle different event types
  // switch (event.type) {
  //   case 'checkout.session.completed':
  //     // Atualizar plano do usuário para PRO
  //     const session = event.data.object as Stripe.Checkout.Session
  //     await prisma.user.update({
  //       where: { id: session.metadata?.userId },
  //       data: { 
  //         plan: 'PRO',
  //         stripeCustomerId: session.customer as string,
  //         subscriptionStatus: 'active'
  //       }
  //     })
  //     break
  //   case 'invoice.payment_succeeded':
  //     // Renovação bem-sucedida
  //     break
  //   case 'customer.subscription.deleted':
  //     // Cancelamento - voltar para FREE
  //     await prisma.user.update({
  //       where: { stripeCustomerId: event.data.object.customer as string },
  //       data: { 
  //         plan: 'FREE',
  //         subscriptionStatus: 'canceled'
  //       }
  //     })
  //     break
  // }

  return NextResponse.json({ received: true })
}
