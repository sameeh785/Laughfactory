import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/company/${process.env.NEXT_PUBLIC_COMPANY_ID}/settings`,
            {
                headers: {
                    'Authorization': 'Basic ' + Buffer.from(process.env.NEXT_PUBLIC_API_USERNAME + ':' + process.env.NEXT_PUBLIC_API_PASSWORD).toString('base64')
                },
                cache : 'no-cache'
            }
        )
        const data = await response.json()
        // Return success response
        return NextResponse.json(data)

    } catch (error) {
        console.log(error,"error")
        return NextResponse.json(
            { error:  error instanceof Error ? error.message : 'Internal server error' },
            { status: 500 }
        )
    }
} 