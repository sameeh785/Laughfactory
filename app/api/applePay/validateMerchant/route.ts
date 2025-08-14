import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
    try {
      const body = await request.json()
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/apple-pay-session`, { 
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
     console.log(error)
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      )
    }
  } 