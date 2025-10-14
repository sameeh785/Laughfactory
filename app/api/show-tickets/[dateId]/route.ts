import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { dateId: string } }) {
    try {
        const { dateId } = params
        const searchParams = request.nextUrl.searchParams
        const promoterCode = searchParams.get('promoter_code')
        const affiliateCode = searchParams.get('affiliate_code')
        let path = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/show-tickets/${dateId}`
        if(promoterCode) {
            path += `?promoter_code=${promoterCode}`
        }
        if(affiliateCode) {
            path += `?affiliate_code=${affiliateCode}`
        }
        const response = await fetch(path,
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
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
} 