import { NextRequest, NextResponse } from 'next/server'

interface BillTo {
  firstName: string
  lastName: string
  address: string
  city: string
  state: string
  zip: string
  country: string
  email: string
}

interface ChargePayload {
  amount: string
  cardNumber: string
  expirationDate: string
  cardCode: string
  billTo: BillTo
}

export async function POST(request: NextRequest) {
  try {
    const body: ChargePayload = await request.json()
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/charge`, { 
        method: "POST",
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + Buffer.from(process.env.NEXT_PUBLIC_API_USERNAME + ':' + process.env.NEXT_PUBLIC_API_PASSWORD).toString('base64')
        }
    })
    const data = await response.json()
    // Return success response
    return NextResponse.json(data)

  } catch (error) {
    console.error('Payment processing error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 