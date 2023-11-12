import {customers} from "../db/db";
import{CustomerModel} from "../model/CustomerModel.js"

var rawIndex = null;


var nicPattern = /^(19[2-9]\d|20[0-1]\d)\d{8}|^[2-9]\d{8}V$/;
var namePattern = /^[A-Za-z '-]+$/;
var contactNumberPattern = /^(070|071|076|077|072|078|075|074)\d{7}$/;
var emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;


// clean inputs
const cleanAddForm = () => {
    $('#customerId').val('');
    $('#customerName').val('');
    $('#customerContact').val('');
    $('#customerDob').val('');
    $('#customerEmail').val('');
    $(`input[name='flexRadioDefault']`).prop("checked", false);
    $('#customerAddress').val('');


};

const cleanUpdateForm = () => {

    $('#floatingInput5').val('');
    $('#floatingInput6').val('');
    $('#floatingInput7').val('');
    $('#floatingInput8').val('');
    $('#floatingInput9').val('');
    $(`input[name='flexRadioDefault1']`).prop("checked", false);
    $('#floatingInput10').val('');


};

$('#clear_customer_btn').on('click', () => {
    cleanAddForm();
});


// load customers
const loadCustomers = () => {

    $('#customerTableBody').empty();

    customers.map((item, index) => {
        let tbl_row = `<tr><td class="customer_id">${item.customer_id}</td><td class="customer_name">${item.customer_name}</td><td class="customer_contact_no">${item.contact_no}</td><td class="customer_dob">${item.dob}</td><td class="customer_email">${item.email}</td><td class="customer_gender">${item.gender}</td><<td class="customer_address">${item.address}</td>/tr>`;
        $('#customerTableBody').append(tbl_row);
    });

};


// Add customer
$('#add_customer_btn').on('click', () => {

    let customer_id = $('#customerId').val();
    let customer_name = $('#customerName').val();
    let contact_no = $('#customerContact').val();
    let dob = $('#customerDob').val();
    let email = $('#customerEmail').val();
    let gender =  $('input[name="flexRadioDefault"]:checked').val();
    let address = $('#customerAddress').val();

    let isIdValid = nicPattern.test(customer_id);

    if(customer_id && isIdValid) {

        let isNameValid = namePattern.test(customer_name);

          if(customer_name && isNameValid) {

            let isValidContact = contactNumberPattern.test(contact_no);

              if(contact_no && isValidContact) {

                   if(dob) {

                       let isValidEmail = emailPattern.test(email);

                        if (email && isValidEmail){

                            if (gender){


                                    let Customer = new CustomerModel(customer_id, customer_name, contact_no, dob, email, gender, address);
                                    customers.push(Customer);

                                    cleanAddForm();
                                    loadCustomers(); // call load customer function

                                    Swal.fire(
                                        'Success!',
                                        'Customer has been saved successfully!',
                                        'success'
                                    );


                            }else {
                                toastr.error('Input Gender Please');
                            }
                        }else {
                             toastr.error('Invalid Email Address');
                       }
                   }else {
                       toastr.error('Input Dob Please');
                  }
              }else {
                toastr.error('Enter A Valid Mobile');
              }
          }else {
            toastr.error('Invalid Customer Name');
         }
    } else {
        toastr.error('Invalid Customer Id');
    }

});

//check if customer already exist
$('#customerId').on('input', () => {

    let id = $('#customerId').val();

    // find item index
    let index = customers.findIndex(item => item.customer_id === id);

    if(index >= 0){

        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'The Customer already exist. Please use update option',
        })

        $('#add_customer_btn').prop('disabled', true);

    }else {
        $('#add_customer_btn').prop('disabled', false);
    }
});



//search customer

$('#search_customer').on('input', () => {

    let search_term = $('#search_customer').val();

    let results = customers.filter((item) =>

        item.customer_id.toLowerCase().startsWith(search_term.toLowerCase()) || item.customer_name.toLowerCase().startsWith(search_term.toLowerCase())

    );

    console.log(results);

    results.map((item, index) => {

        $('#floatingInput5').val(item.customer_id);
        $('#floatingInput5').prop('disabled', true); // Disable the input field
        $('#floatingInput6').val(item.customer_name);
        $('#floatingInput7').val(item.contact_no);
        $('#floatingInput8').val(item.dob);
        $('#floatingInput9').val(item.email);
        $('input[name="flexRadioDefault1"][value="' + item.gender + '"]').prop('checked', true);
        $('#floatingInput10').val(item.address);

    });

});




//update item
$("#update_customer_btn").on("click", () => {


    Swal.fire({
        title: 'Do you want to update this customer?',
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: 'yes',
        denyButtonText: `no
        `,
    }).then((result) => {

        if (result.isConfirmed) {

            let customer_id = $('#floatingInput5').val();
            let customer_name = $('#floatingInput6').val();
            let customer_contact = $('#floatingInput7').val();
            let customer_dob = $('#floatingInput8').val();
            let customer_email = $('#floatingInput9').val();
            let customer_gender = $('input[name="flexRadioDefault1"]:checked').val();
            let customer_address = $('#floatingInput10').val();

            let isNameValid = namePattern.test(customer_name);

            if(customer_name && isNameValid) {

                let isValidContact = contactNumberPattern.test(customer_contact);

                if(customer_contact && isValidContact) {

                    if(customer_dob) {

                        let isValidEmail = emailPattern.test(customer_email);

                        if (customer_email && isValidEmail){

                            if (customer_gender){

                                    let customer_obj = new CustomerModel(customer_id, customer_name, customer_contact, customer_dob, customer_email, customer_gender, customer_address);

                                    // find customer index
                                    let index = customers.findIndex(item => item.customer_id === customer_id);

                                    // update item in the db
                                    customers[index] = customer_obj;

                                    // clear();
                                    cleanUpdateForm()

                                    // load student data
                                    loadCustomers();
                                    Swal.fire('Updated!', '', 'success')

                            }else {
                                toastr.error('Input Gender Please');
                            }
                        }else {
                            toastr.error('Invalid Email Address');
                        }
                    }else {
                        toastr.error('Input Dob Please');
                    }
                }else {
                    toastr.error('Invalid Mobile Number');
                }
            }else {
                toastr.error('Invalid Customer Name');
            }

        } else if (result.isDenied) {
            Swal.fire('Changes are not saved', '', 'info')
        }
    })
});


//load table raw data
$("#customerTableBody").on("click", "tr", function() {

    rawIndex = $(this).index();

    let customer_id =  $(this).find(".customer_id").text();
    let customer_name = $(this).find(".customer_name").text();
    let customer_contact = $(this).find(".customer_contact_no").text();
    let customer_dob  = $(this).find(".customer_dob").text();
    let customer_email = $(this).find(".customer_email").text();
    let customer_gender = $(this).find(".customer_gender").text();
    let customer_address = $(this).find(".customer_address").text();


    $('#floatingInput5').val(customer_id);
    $('#floatingInput5').prop('disabled', true); // Disable the input field
    $('#floatingInput6').val(customer_name);
    $('#floatingInput7').val(customer_contact);
    $('#floatingInput8').val(customer_dob);
    $('#floatingInput9').val(customer_email);
    $('input[name="flexRadioDefault1"][value="' + customer_gender + '"]').prop('checked', true);
    $('#floatingInput10').val(customer_address);

});



// delete item
$("#delete_customer_btn").on("click", () => {

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

            let customer_id = $("#floatingInput5").val();

            // find item index
            let index = customers.findIndex(customer => customer.customer_id === customer_id);

            // remove the item from the db
            customers.splice(index, 1);


            loadCustomers();

            swalWithBootstrapButtons.fire(
                'Deleted!',
                'Your file has been deleted.',
                'success'
            )

            cleanUpdateForm()

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
