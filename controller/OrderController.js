import {store} from "/db/db.js";
import {customers, order_item,orders} from "../db/db.js";
import{InvoiceModel} from "../model/InvoiceModel.js"
import {OrderItemModel} from "../model/OrderItemModel.js";
import { loadItems } from "/controller/StoreController.js";

var nicPattern = /^(19[2-9]\d|20[0-1]\d)\d{8}|^[2-9]\d{8}V$/;
var namePattern = /^[A-Za-z '-]+$/;
var contactNumberPattern = /^(070|071|076|077|072|078|075|074)\d{7}$/;
var pricePattern = /^(\d+(\.\d{1,2})?)$/;
var discountPattern = /^\d+(\.\d+)?$/;


var item_price = 0;
var qty = 0;
var price_for_item = 0;

var total = 0;
var rawIndex = null;
let orderCounter = 1;


//generate new order id
const generateOrderId = () => {

    if (orders.length === 0) {

        $('#floatingInput11').val('0001');


    } else {


        const formattedOrderId = String(orderCounter).padStart(4, '0');
        const latestOrder = orders[orders.length - 1];
        let lastOrderId = latestOrder.order_id;

        lastOrderId = (parseInt(lastOrderId) + 1).toString().padStart(4, '0');

        $('#floatingInput11').val(lastOrderId);


    }

}

//generate order id when go to the order page
$(document).ready(function() {

    $('.nav-link').on('click', () => {
        console.log('Nav link clicked');
        generateOrderId();
    });
});


//load customer details and validate customer id
$('#floatingInput13').on('input', () => {

    let customer_id = $('#floatingInput13').val();

    let isIdValid = nicPattern.test(customer_id);

    if(customer_id && isIdValid) {


        let search_term = $('#floatingInput13').val();

        let results = customers.filter((item) =>

            item.customer_id.toLowerCase().startsWith(search_term.toLowerCase())
        );

        console.log(results);

        results.map((item, index) => {

            $('#floatingInput14').val(item.customer_name);
            $('#floatingInput15').val(item.contact_no);

        });
    }else {
        toastr.error('Invalid Customer Id');
    }

});

//load customer details and validate the customer name
$('#floatingInput14').on('input', () => {

    let customer_name = $('#floatingInput14').val();

    let isNameValid = namePattern.test(customer_name);

    if(customer_name && isNameValid) {

        let search_term = $('#floatingInput14').val();

        let results = customers.filter((item) =>

            item.customer_name.toLowerCase().startsWith(search_term.toLowerCase())
        );

        console.log(results);

        results.map((item, index) => {

            $('#floatingInput13').val(item.customer_id);
            $('#floatingInput15').val(item.contact_no);

        });
    }else {
        toastr.error('Invalid Customer Name');
    }

});


//load customer details and validate the customer contact
$('#floatingInput15').on('input', () => {

    let contact_no = $('#floatingInput15').val();

    let isValidContact = contactNumberPattern.test(contact_no);

    if(contact_no && isValidContact) {

        let search_term = $('#floatingInput15').val();

        let results = customers.filter((item) =>

            item.contact_no.toLowerCase().startsWith(search_term.toLowerCase())
        );

        console.log(results);

        results.map((item, index) => {

            $('#floatingInput14').val(item.customer_name);
            $('#floatingInput13').val(item.customer_id);

        });
    }else {
        toastr.error('Enter A Valid Mobile');
    }

});


//load Item details
$('#floatingInput16').on('input', () => {



    let search_term = $('#floatingInput16').val();

    let results = store.filter((item) =>

        item.item_id.toLowerCase().startsWith(search_term.toLowerCase())

    );

    console.log(results);

    results.map((item, index) => {

        $('#floatingInput18').val(item.name);
        $('#floatingInput20').val(item.exp_date);
        $('#floatingInput19').val(item.size);

    });

});

//load item details through the price and validate the price
$('#floatingInput19').on('input', () => {

    let item_size = $('#floatingInput19').val();

    let isPriceValid = pricePattern.test(item_size)

    if (item_size && isPriceValid) {

        let search_term = $('#floatingInput19').val();

        let results = store.filter((item) =>

            item.size.toLowerCase().startsWith(search_term.toLowerCase())
        );

        console.log(results);

        results.map((item, index) => {

            $('#floatingInput18').val(item.name);
            $('#floatingInput20').val(item.exp_date);
            $('#floatingInput16').val(item.item_id);

        });
    }else {
        toastr.error('Input Item Price');
    }

});

//call add item to cart function
$("#item_add_cart").on("click", () => {

    addItemToCart();

});

//add item to cart
function addItemToCart() {

    let itemId = $('#floatingInput16').val();
    let name =  $('#floatingInput18').val();
    let item_price =  $('#floatingInput19').val();
    let qty = $('#floatingInput17').val();
    let exp_date = $('#floatingInput20').val();

    if(itemId) {

        if(name) {

            if (item_price) {

                if(exp_date) {

                    let for_item = item_price * qty;

                    total += for_item;

                    $("#total_bal").text(total.toFixed(2));

                    // find item index
                    let index = store.findIndex(item => item.item_id === itemId);

                    let qty1 = store[index].qty;

                    // update item qty in the db
                    store[index].qty = qty1 - qty;

                    let order_items = new OrderItemModel(itemId, name, item_price, qty, total);
                    order_item.push(order_items);

                    $("#total_big").text("Rs. " + total.toFixed(2));

                    loadItems();
                    loadOrderItems();
                    clearItemDetails();

                }else {
                    toastr.error('Input Item Exp Date');
                }
            }else {
                toastr.error('Input Item Price');
            }
        }else {
            toastr.error('Invalid Item Name');
        }
    }else {
        toastr.error('Invalid Item Id');
    }

}

//add discount to item and validate the discount
$('#floatingInput30').on('input', () => {

    let discount = $('#floatingInput30').val();

    if (discount){

        let isMatch = discountPattern.test(discount);

        if (isMatch){

            total = total - (total * discount / 100);

            $('#item_add_cart').prop('disabled', false);

        }else {
            $('#item_add_cart').prop('disabled', true);
            toastr.error('Invalid discount value');
        }

    }else {
        $('#item_add_cart').prop('disabled', false);
    }


});


//call the add customer payment function
$('#customer_payment').on('keydown', (event) => {

    if (event.key === "Enter") {
        event.preventDefault();
        addCustomerPayment();

    }

});

//call the add customer payment function
$("#addCustomerPayment").on("click", (event) => {
    event.preventDefault(); // Prevent the default form submission behavior
    addCustomerPayment();

});


//add customer payment add count the balance
function addCustomerPayment () {

    let customerPayment = parseFloat($('#customer_payment').val());

    $("#customer_payed").text(customerPayment.toFixed(2));

    let last_balance = customerPayment - total;

    $("#last_balance").text(last_balance.toFixed(2));


}


// clean inputs
const clearOrderUpdateForm = () => {
    $('#floatingInput21').val('');
    $('#floatingInput22').val('');
    $('#floatingInput23').val('');
    $('#floatingInput24').val('');
    $('#floatingInput25').val('');

};

const clearItemDetails = () => {
    $('#floatingInput16').val('');
    $('#floatingInput17').val('');
    $('#floatingInput18').val('');
    $('#floatingInput19').val('');

};

const clearInvoiceDetails = () =>{

    $('#floatingInput11').val('');
    $('#floatingInput12').val('');
    $('#floatingInput13').val('');
    $('#floatingInput14').val('');
    $('#floatingInput15').val('');

}

const clearTotalForm = () => {

    var totalBal = document.getElementById("total_bal");
    var customerPayed = document.getElementById("customer_payed");
    var lastBalance = document.getElementById("last_balance");
    const label = document.getElementById("total_big");

    totalBal.textContent = "";
    customerPayed.textContent = "";
    lastBalance.textContent = "";
    label.innerHTML = "";
    $('#customer_payment').val('');
};


//Add data to items in order table
export const loadOrderItems = () => {

    $('#items_in_order_table').empty();

    order_item.map((item, index) => {

        let tbl_row = `<tr><td class="item_id">${item.item_id}</td><td class="item_name">${item.item_name}</td><td class="unit_price">${item.unit_prize}</td><td class="qty">${item.qty}</td><td class="total">${item.total}</td></tr>`;
        $('#items_in_order_table').append(tbl_row);


    });

};

//Add order details to the orders table
export const loadOrders = () => {

    $('#orders_table').empty();

    orders.map((item, index) => {

        let tbl_row = `<tr><td class="order_id">${item.order_id}</td><td class="customer_id">${item.customer_id}</td><td class="customer_name">${item.customer_name}</td><td class="date">${item.date}</td><td class="total">${item.balance}</td></tr>`;
        $('#orders_table').append(tbl_row);


    });

};

//place the order
$("#place_order_btn").on("click", () => {

    let orderId =  $('#floatingInput11').val();
    let date = $('#floatingInput12').val();
    let customerId = $('#floatingInput13').val();
    let customerName = $('#floatingInput14').val();

    if (orderId) {

        if (date) {

            let order = new InvoiceModel(orderId, customerId, customerName, date, total);
            orders.push(order);

            loadOrders()

            clearItemDetails()

            Swal.fire({
                position: "center",
                icon: "success",
                title: "Order Placed Successfully",
                showConfirmButton: false,
                timer: 1500
            });

            clearTotalForm();
            clearInvoiceDetails();

        } else {
            toastr.error('Select Date First');

        }
    }else {
        toastr.error('Invalid Order Id');
    }

});


//Search order through order id
$('#order_search_input').on('input', () => {

    let orderId = $('#order_search_input').val();

    if (orderId){

        let results = orders.filter((order) =>

            order.order_id.toLowerCase().startsWith(orderId.toLowerCase())

        );

        results.map((order, index) => {
            $('#floatingInput21').val(order.order_id);
            $('#floatingInput22').val(order.customer_id);
            $('#floatingInput23').val(order.customer_name);
            $('#floatingInput24').val(order.date);
            $('#floatingInput25').val(order.balance);

            $('#floatingInput21').prop('disabled', true);
        });


    }else {
        toastr.error('Invalid Order Id');
    }
});


//update order details
$("#update_order").on("click", () => {


    Swal.fire({
        title: 'Do you want to update this order details?',
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: 'yes',
        denyButtonText: `no
        `,
    }).then((result) => {

        if (result.isConfirmed) {

            let order_id = $('#floatingInput21').val();
            let customer_id = $('#floatingInput22').val();
            let customer_name = $('#floatingInput23').val();
            let date = $('#floatingInput24').val();
            let balance = $('#floatingInput25').val();

            if (customer_id){
                if (customer_name){
                    if (date){
                        if (balance){

                            let order_update = new InvoiceModel(order_id,customer_id,customer_name,date,balance);

                            let index = orders.findIndex(order => order.order_id === order_id);

                            orders[index] = order_update;

                            clearOrderUpdateForm();

                            loadOrders();

                        }else {
                            toastr.error('Input the balance');
                        }
                    }else {
                        toastr.error('Input the date');
                    }
                }else {
                    toastr.error('Input the customer name');
                }

            }else {
                toastr.error('Input the customer id');
            }

        } else if (result.isDenied) {
            Swal.fire('Changes are not saved', '', 'info')
        }
    });
});


//remove the order
$("#remove_order").on("click", () => {

    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            confirmButton: 'btn btn-success',
            cancelButton: 'btn btn-danger'
        },
        buttonsStyling: false
    })

    swalWithBootstrapButtons.fire({

        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, cancel!',
        reverseButtons: true

    }).then((result) => {
        if (result.isConfirmed) {


            let order_id = $("#floatingInput21").val();

            // find item index
            let index = orders.findIndex(order => order.order_id === order_id);

            // remove the item from the db
            orders.splice(index, 1);


            loadOrders();

            swalWithBootstrapButtons.fire(
                'Deleted!',
                'Your file has been deleted.',
                'success'
            )

            clearOrderUpdateForm()


        } else if (
            result.dismiss === Swal.DismissReason.cancel
        ) {
            swalWithBootstrapButtons.fire(
                'Cancelled',
                'Your imaginary file is safe :)',
                'error'
            )
        }
    })

 });

//load order details to the form when clicked table raw
$("#orders_table").on("click", "tr", function() {

    rawIndex = $(this).index();

    let order_id =  $(this).find(".order_id").text();
    let customer_id = $(this).find(".customer_id").text();
    let customer_name = $(this).find(".customer_name").text();
    let date  = $(this).find(".date").text();
    let balance = $(this).find(".total").text();

    $('#floatingInput21').val(order_id);
    $('#floatingInput21').prop('disabled', true); // Disable the input field
    $('#floatingInput22').val(customer_id);
    $('#floatingInput23').val(customer_name);
    $('#floatingInput24').val(date);
    $('#floatingInput25').val(balance);

    $('#popupModelOrders .btn-close').click();

});
