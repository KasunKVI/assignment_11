export class InvoiceModel {
    constructor(order_id,  customer_id, customer_name, date, balance) {
        this.order_id=order_id;
        this.date=date;
        this.customer_id=customer_id;
        this.customer_name=customer_name;
        this.balance=balance;
    }
}