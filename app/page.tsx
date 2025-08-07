import ShowsList from '@/components/ShowList'

export default async function Home(): Promise<JSX.Element> {
    const shows = await fetch('http://34.212.24.109/api/get-shows/1', {
        headers: {
            'Authorization': 'Basic ' + Buffer.from(process.env.NEXT_PUBLIC_API_USERNAME + ':' + process.env.NEXT_PUBLIC_API_PASSWORD).toString('base64')
        },
        cache: 'no-store'
    });

    const { data: showsData } = await shows.json();
    return <ShowsList shows={showsData?.data} />;
}