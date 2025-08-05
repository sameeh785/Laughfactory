import ShowsList from '@/components/ShowList'

export default async function Home(): Promise<JSX.Element> {
  const shows = await fetch('https://api.laughfactory.com/shows')
  console.log(shows)
  return <ShowsList />
}