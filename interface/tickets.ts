export interface ITicket {
    ticket_id: number
    name: string
    description: string
    price: string
    available_quantity: number
    is_sold_out: boolean
}
export interface IPurchaseTicket extends ITicket {
    quantity: number
}