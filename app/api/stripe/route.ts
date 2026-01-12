import { NextRequest, NextResponse } from 'next/server'

// Esta é uma estrutura básica para integração com Stripe
// TODO: Implementar quando estiver pronto para monetização

export async function POST(request: NextRequest) {
  try {
    const { priceId, userId } = await request.json()

    // TODO: Implementar criação de checkout session Stripe
    // const session = await stripe.checkout.sessions.create({
    //   customer: stripeCustomerId,
    //   payment_method_types: ['card'],
    //   line_items: [
    //     {
    //       price: priceId,
    //       quantity: 1,
    //     },
    //   ],
    //   mode: 'subscription',
    //   success_url: `${request.nextUrl.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
    //   cancel_url: `${request.nextUrl.origin}/canceled`,
    // })

    return NextResponse.json({ 
      message: 'Stripe integration coming soon',
      // url: session.url 
    })
  } catch (error) {
    console.error('Stripe error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
