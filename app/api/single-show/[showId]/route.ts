import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { showId: string } }) {
    try {
        const { showId } = params
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/get-single-show/${process.env.NEXT_PUBLIC_COMPANY_ID}/${showId}`,
            {
                headers: {
                    'Authorization': 'Basic ' + Buffer.from(process.env.NEXT_PUBLIC_API_USERNAME + ':' + process.env.NEXT_PUBLIC_API_PASSWORD).toString('base64')
                },
                cache : 'no-cache'
            }
        )
        const data = await response.json()
        console.log(data,"dataaa")
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