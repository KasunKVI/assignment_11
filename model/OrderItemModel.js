export class OrderItemModel{

    constructor(item_id, item_name, unit_prize, qty, total) {
        this.item_id=item_id;
        this.item_name=item_name;
        this.unit_prize = unit_prize;
        this.qty = qty;
        this.total = total;
    }
}