export interface IShow {
    title: string
    subtitle: string
    bannerImage: string
    comedians: IComedian[]
    date: {
        month: string
        day: string
        time: string
    }
    dateId: string
}

export interface IComedian {
    name: string
    image: string
}