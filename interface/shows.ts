export interface IShow {
    id: number
    title: string
    description: string
    image: string
    comedians: IComedian[]
    date: string
    dateId: number
    is_sold_out: number
    alert_is_percentage: number
    alert_message: string
    alert_quantity: number
    tags: ITag[]
    thumbnail?: string
}

export interface IComedian {
    name: string
    image: string
}

export interface ITag {
    name: string
    id: string
}