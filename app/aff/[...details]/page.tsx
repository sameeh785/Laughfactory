import React from 'react'
import { redirect } from 'next/navigation'
const Page = ({ params }: { params: { details: string[] } }) => {
    const details = params.details
    const affID = details?.[0]
    const showID = details?.[1]
    if (affID && showID) {
        // redirect to the home page with the prID and showID search params
        redirect(`/?aff=${affID}&showID=${showID}`)
    }
    else {
        redirect("/")
    }

    return (
        <div />
    )
}

export default Page