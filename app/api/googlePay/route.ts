import { NextRequest, NextResponse } from "next/server"
import { revalidateTag } from 'next/cache'

export async function POST(request: NextRequest) {
    try {
      const body = await request.json()
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/google-pay`, { 
          method: "POST",
          body: JSON.stringify(body),
          headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Basic ' + Buffer.from(process.env.NEXT_PUBLIC_API_USERNAME + ':' + process.env.NEXT_PUBLIC_API_PASSWORD).toString('base64')
          }
      })
      const data = await response.json()
      
      // Revalidate the shows data after successful purchase
      if (data?.status || data?.success) {
        revalidateTag('shows')
      }
      
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