import ShowsList from '@/components/showList'

export default async function Home(): Promise<JSX.Element> {
    const shows = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/get-shows/${process.env.NEXT_PUBLIC_COMPANY_ID}`, {
        headers: {
            'Authorization': 'Basic ' + Buffer.from(process.env.NEXT_PUBLIC_API_USERNAME + ':' + process.env.NEXT_PUBLIC_API_PASSWORD).toString('base64')
        },
        cache: 'no-store',
        next: { tags: ['shows'] }
    });

    const { data: showsData } = await shows.json();
    return <ShowsList shows={showsData?.shows} />;
}