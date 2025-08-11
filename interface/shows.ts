export interface IShow {
    id: number
    title: string
    description: string
    image: string
    comedians: IComedian[]
    date: string
    dateId: string
}

export interface IComedian {
    name: string
    image: string
}