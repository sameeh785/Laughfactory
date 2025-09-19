import React from 'react'
import { redirect } from 'next/navigation'
const Page = ({ params }: { params: { details: string[] } }) => {
    const details = params.details
    const affID = details?.[0]
    if (affID) {
        // redirect to the home page with the prID and showID search params
        redirect(`/?aff=${affID}`)
    }
    else {
        redirect("/")
    }

    return (
        <div />
    )
}

export default Page