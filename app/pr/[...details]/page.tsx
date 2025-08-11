import React from 'react'
import { redirect } from 'next/navigation'
const Page = ({ params }: { params: { details: string[] } }) => {
    const details = params.details
    const prID = details?.[0]
    const showID = details?.[1]
    if (prID && showID) {
        // redirect to the home page with the prID and showID search params
        redirect(`/?prID=${prID}&showID=${showID}`)
    }
    else {
        redirect("/")
    }

    return (
        <div />
    )
}

export default Page