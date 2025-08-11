import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { dateId: string } }) {
    try {
        const { dateId } = params
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/show-tickets/${dateId}`,
            {
                headers: {
                    'Authorization': 'Basic ' + Buffer.from(process.env.NEXT_PUBLIC_API_USERNAME + ':' + process.env.NEXT_PUBLIC_API_PASSWORD).toString('base64')
                }
            }
        )
        const data = await response.json()
        // Return success response
        return NextResponse.json(data)

    } catch (error) {
        console.log(error, "error")
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
} 