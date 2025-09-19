export interface ITicket {
    ticket_id: number
    name: string
    description: string
    price: string
    available_quantity: number
    is_sold_out: boolean
    ticket_type_id: number  
    is_in_pool: boolean
    pool_capacity : number | null
    is_special: boolean

}
export interface ITicketList extends ITicket {
    quantity: number
}
export interface IAppliedCouponApiResponse {
    coupon_code: string
    discount_applied: number
    final_amount: number
    applied_ticket_types: [
        {
            ticket_type_id: number
            discount_amount: number
        }
    ]
}