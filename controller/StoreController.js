import {store} from "/db/db.js";
import{StoreModel} from "/model/StoreModel.js"


var rawIndex = null;

//regex
var itemNamePattern = new RegExp("^[A-Z][A-Za-z0-9]*([-_ ]?[A-Za-z0-9]+)*$");
var pricePattern = /^(\d+(\.\d{1,2})?)$/;

// clean inputs
const cleanAddForm = () => {
    $('#itemId').val('');
    $('#itemQty').val('');
    $('#itemName').val('');
    $('#itemExpDate').val('');
    $('#itemSize').val('');

};

const cleanUpdateForm = () => {
    $('#floatingInput').val('');
    $('#floatingInput2').val('');
    $('#floatingInput3').val('');
    $('#floatingInput4').val('');
    $('#inputGroupSelect01').val('');

};

// load items
export const loadItems = () => {

    $('#itemsTableBody').empty();

    store.map((item, index) => {

         if (item.qty>0) {

            let tbl_row = `<tr><td class="item_id">${item.item_id}</td><td class="item_name">${item.name}</td><td class="item_qty">${item.qty}</td><td class="item_exp_date">${item.exp_date}</td><td class="item_size">${item.size}</td></tr>`;
            $('#itemsTableBody').append(tbl_row);

         }

    });

};

// Add item
$('#add_item_btn').on('click', () => {

    console.log("Add item");

    let item_id = $('#itemId').val();
    let item_qty = $('#itemQty').val();
    let item_name = $('#itemName').val();
    let item_exp_date = $('#itemExpDate').val();
    let item_size = $('#itemSize').val();

    if(item_id) {

        if(item_qty) {

            let isValid = itemNamePattern.test(item_name);

            if(item_name && isValid) {

                if(item_exp_date) {

                    let isPriceValid = pricePattern.test(item_size)

                    if (item_size && isPriceValid){


                        let Item = new StoreModel(item_id, item_qty, item_name, item_exp_date, item_size);
                        store.push(Item);

                        Swal.fire(
                            'Success!',
                            'Item has been saved successfully!',
                            'success'
                        );

                        cleanAddForm();
                        loadItems(); // call load customer function


                    }else {
                            toastr.error('Input Item Price');
                    }

                } else {
                    toastr.error('Input Item Exp Date');
                }

            } else {
                toastr.error('Invalid Item Name');
            }

        } else {
            toastr.error('Input Item Qty');
        }

    } else {
        toastr.error('Invalid Item Id');
    }

});


$('#clear_item_btn').on('click', () => {

   cleanAddForm();

});


//update item
$("#item_update_btn").on("click", () => {


    Swal.fire({
        title: 'Do you want to update this item?',
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: 'yes',
        denyButtonText: `no
        `,
    }).then((result) => {

        if (result.isConfirmed) {

            let item_id = $('#floatingInput').val();
            let item_qty = $('#floatingInput2').val();
            let item_name = $('#floatingInput3').val();
            let item_exp_date = $('#floatingInput4').val();
            let item_size = $('#inputGroupSelect01').val();

            if(item_qty) {

                let isValid = itemNamePattern.test(item_name);

                if(item_name && isValid) {

                    if(item_exp_date) {

                        let isPriceValid = pricePattern.test(item_size)

                        if (item_size && isPriceValid){


                            let item_obj = new StoreModel(item_id, item_qty, item_name, item_exp_date, item_size);

                        // find item index
                        let index = store.findIndex(item => item.item_id === item_id);

                        // update item in the db
                        store[index] = item_obj;

                        // clear();
                        cleanUpdateForm()

                        // load student data
                        loadItems();
                        Swal.fire('Updated!', '', 'success')

                        }else {
                            toastr.error('Input Item Price');
                        }
                    } else {
                        toastr.error('Input Item Exp Date');
                    }

                } else {
                    toastr.error('Invalid Item Name');
                }

            } else {
                toastr.error('Input Item Qty');

            }


        } else if (result.isDenied) {
            Swal.fire('Changes are not saved', '', 'info')
        }
    })



});


//check if item already exist
$('#itemId').on('input', () => {

    let id = $('#itemId').val();

    // find item index
    let index = store.findIndex(item => item.item_id === id);

    if(index >= 0){

        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'The Item already exist. Please use update option',
        })

        $('#add_item_btn').prop('disabled', true);

    }else {

        $('#add_item_btn').prop('disabled', false);

    }
});


//search item
$('#search_item').on('input', () => {

    let search_term = $('#search_item').val();

    let results = store.filter((item) =>

        item.item_id.toLowerCase().startsWith(search_term.toLowerCase()) || item.name.toLowerCase().startsWith(search_term.toLowerCase())

    );

    console.log(results);

    results.map((item, index) => {

        $('#floatingInput').val(item.item_id);
        $('#floatingInput').prop('disabled', true); // Disable the input field
        $('#floatingInput2').val(item.qty);
        $('#floatingInput3').val(item.name);
        $('#floatingInput4').val(item.exp_date);
        $('#inputGroupSelect01').val(item.size);

    });

});



// delete item
$("#item_delete_btn").on("click", () => {

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

            let item_id = $("#floatingInput").val();

            // find item index
            let index = store.findIndex(item => item.item_id === item_id);

            // remove the item from the db
            store.splice(index, 1);


            loadItems();

            swalWithBootstrapButtons.fire(
                'Deleted!',
                'Your file has been deleted.',
                'success'
            )
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


//load table raw data
$("#itemsTableBody").on("click", "tr", function() {

    rawIndex = $(this).index();

    let itemId = $(this).find(".item_id").text();
    let itemQty = $(this).find(".item_qty").text();
    let name = $(this).find(".item_name").text();
    let exp_date = $(this).find(".item_exp_date").text();
    let size = $(this).find(".item_size").text();

    $("#floatingInput").val(itemId);
    $('#floatingInput').prop('disabled', true); // Disable the input field
    $("#floatingInput2").val(itemQty);
    $("#floatingInput3").val(name);
    $("#floatingInput4").val(exp_date);
    $("#inputGroupSelect01").val(size);

});

