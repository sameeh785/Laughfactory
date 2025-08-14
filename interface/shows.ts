export interface IShow {
    id: number
    title: string
    description: string
    image: string
    comedians: IComedian[]
    date: string
    dateId: number
}

export interface IComedian {
    name: string
    image: string
}