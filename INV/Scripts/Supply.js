﻿var Categories = [];

//fetch categories from database
function LoadCategory(element) {
    if (Categories.length === 0) {
        //ajax function for fetch data
        $.ajax({
            type: "GET",
            url: '/Orders/getProductCategories',
            success: function(data) {
                Categories = data;
                //render catagory
                renderCategory(element);
            }
        });
    } else {
        //render catagory to the element
        renderCategory(element);
    }
}

function renderCategory(element) {
    var $ele = $(element);
    $ele.empty();
    $ele.append($('<option/>').val('0').text('Select'));
    $.each(Categories,
        function(i, val) {
            $ele.append($('<option/>').val(val.cat_id).text(val.Name));
        });
}

//fetch Brands
function LoadBrand(categoryDD) {
    $.ajax({
        type: "GET",
        url: "/Orders/getProductBrands",
        data: { 'categoryID': $(categoryDD).val() },
        success: function(data) {
            //render brands to appropriate dropdown
            renderBrand($(categoryDD).parents('.mycontainer').find('select.brand'), data);
            //renderBrand($('.mycontainer').find('select.brand'), data);
        },
        error: function(error) {
            console.log(error);
        }
    });
}

function renderBrand(element, data) {
    //render brand
    var $ele = $(element);
    $ele.empty();
    $ele.append($('<option/>').val('0').text('Select'));
    $.each(data,
        function(i, val) {
            $ele.append($('<option/>').val(val.brand_id).text(val.Name));
        });
}

//fetch products
function LoadProduct(BrandDD) {
    $.ajax({
        type: "GET",
        url: "/Orders/getProducts",
        data: { 'BrandID': $(BrandDD).val() },
        success: function(data) {
            //render products to appropriate dropdown
            renderProduct($(BrandDD).parents('.mycontainer').find('select.product'), data);
            //renderProduct($('.mycontainer').find('select.product'), data);
        },
        error: function(error) {
            console.log(error);
        }
    });
}

function renderProduct(element, data) {
    //render product
    var $ele = $(element);
    $ele.empty();
    $ele.append($('<option/>').val('0').text('Select'));
    $.each(data,
        function(i, val) {
            $ele.append($('<option/>').val(val.pro_id).text(val.Name));
        });
}

//fetch ProductPrice
function LoadPrice(ProId) {
    $.ajax({
        type: "GET",
        url: "/Orders/getProductPrice",
        data: { 'Pro_id': $(ProId).val() },
        success: function(data) {
            //render Price to appropriate Input
            renderPrice($(ProId).parents('.mycontainer').find('input.UnitPrice'), data);
        },
        error: function(error) {
            console.log(error);
        }
    });

    $.ajax({
        type: "GET",
        url: "/Orders/getProductQuantiy",
        data: { 'Pro_id': $(ProId).val() },
        success: function(data) {
            //render Price to appropriate Input
            renderQuantity($(ProId).parents('.mycontainer').find('input.quantity'), data);
        },
        error: function(error) {
            console.log(error);
        }
    });
}

function renderPrice(element, data) {
    //render Price
    var $ele = $(element);
    $ele.empty();
    $ele.val(data);
    //$ele.attr("Max", data);
}

function renderQuantity(element, data) {
    //render Price
    var $ele = $(element);
    $ele.empty();
    $ele.val(data);
}

$(document).ready(function() {
    //Add button click event
    $('#add').click(function() {
        //validation and add Supply items
        var isAllValid = true;
        if ($('#productCategory').val() === "0") {
            isAllValid = false;
            $('#productCategory').siblings('span.error').css('visibility', 'visible');
        } else {
            $('#productCategory').siblings('span.error').css('visibility', 'hidden');
        }

        if ($('#productBrand').val() === "0") {
            isAllValid = false;
            $('#productBrand').siblings('span.error').css('visibility', 'visible');
        } else {
            $('#productBrand').siblings('span.error').css('visibility', 'hidden');
        }

        if ($('#product').val() === "0") {
            isAllValid = false;
            $('#product').siblings('span.error').css('visibility', 'visible');
        } else {
            $('#product').siblings('span.error').css('visibility', 'hidden');
        }

        if (!($('#quantity').val().trim() !== '' && (parseInt($('#quantity').val()) || 0))) {
            isAllValid = false;
            $('#quantity').siblings('span.error').css('visibility', 'visible');
        } else {
            $('#quantity').siblings('span.error').css('visibility', 'hidden');
        }

        if (!($('#UnitPrice').val().trim() !== '' && (parseInt($('#quantity').val()) || 0))) {
            isAllValid = false;
            $('#UnitPrice').siblings('span.error').css('visibility', 'visible');
        } else {
            $('#UnitPrice').siblings('span.error').css('visibility', 'hidden');
        }

        if (!($('#Discount').val().trim() !== '' && (parseInt($('#quantity').val()) || 0))) {
            isAllValid = false;
            $('#Discount').siblings('span.error').css('visibility', 'visible');
        } else {
            $('#Discount').siblings('span.error').css('visibility', 'hidden');
        }

        if (isAllValid) {
            var $newRow = $('#mainrow').clone().removeAttr('id');
            $('.pc', $newRow).val($('#productCategory').val());
            $('.brand', $newRow).val($('#productBrand').val());
            $('.product', $newRow).val($('#product').val());

            //Replace add button with remove button
            $('#add', $newRow).addClass('remove').val('Remove').removeClass('btn-success').addClass('btn-danger');

            //remove id attribute from new clone row
            $('#productCategory,#productBrand,#product,#quantity,#UnitPrice,#Discount,#add', $newRow).removeAttr('id');
            $('span.error', $newRow).remove();
            //append clone row
            $('#supplydetailsItems').append($newRow);

            //clear select data
            $('#productCategory,#productBrand,#product').val('0');
            $('#quantity,#UnitPrice,#Discount').val('');
            $('#supplyItemError').empty();
        }

    });

    //remove button click event
    $('#supplydetailsItems').on('click',
        '.remove',
        function() {
            $(this).parents('tr').remove();
        });

    $('#submit').click(function() {
        var isAllValid = true;

        //validate Supply items
        $('#supplyItemError').text('');
        var list = [];
        var errorItemCount = 0;
        $('#supplydetailsItems tbody tr').each(function(index, ele) {
            if (
                $('select.product', this).val() === "0" ||
                    (parseInt($('.quantity', this).val()) || 0) === 0 ||
                    (parseInt($('.UnitPrice', this).val()) || 0) === 0 ||
                    $('.UnitPrice', this).val() === "" ||
                    isNaN($('.UnitPrice', this).val())
            ) {
                errorItemCount++;
                $(this).addClass('error');
            } else {
                var supplyItem = {
                    pro_id: $('select.product', this).val(),
                    Quantity: parseInt($('.quantity', this).val()),
                    UnitPrice: parseInt($('.UnitPrice', this).val()),
                    Discount: parseInt($('.Discount', this).val())
                }
                list.push(supplyItem);
            }
        });

        if (errorItemCount > 0) {
            $('#supplyItemError').text(errorItemCount + " invalid entry in supply item list.");
            isAllValid = false;
        }

        if (list.length === 0) {
            $('#supplyItemError').text('At least 1 supply item required.');
            isAllValid = false;
        }

        if ($('#supplyNo').val().trim() === '') {
            $('#supplyNo').siblings('span.error').css('visibility', 'visible');
            isAllValid = false;
        } else {
            $('#supplyNo').siblings('span.error').css('visibility', 'hidden');
        }

        if ($('#SupplierNo').val().trim() === '') {
            $('#SupplierNo').siblings('span.error').css('visibility', 'visible');
            isAllValid = false;
        } else {
            $('#SupplierNo').siblings('span.error').css('visibility', 'hidden');
        }

        if ($('#supplyDate').val().trim() == '') {
            $('#supplyDate').siblings('span.error').css('visibility', 'visible');
            isAllValid = false;
        } else {
            $('#supplyDate').siblings('span.error').css('visibility', 'hidden');
        }

        if (isAllValid) {
            var data = {
                supplyNo: $('#supplyNo').val().trim(),
                sup_id: $('#SupplierNo').val().trim(),
                supplyDateString: $('#supplyDate').val().trim(),
                Description: $('#description').val().trim(),
                supplyDetails: list
            }

            $(this).val('Please wait...');

            $.ajax({
                type: 'POST',
                url: '/Supplies/save',
                data: JSON.stringify(data),
                contentType: 'application/json',
                success: function(data) {
                    if (data.status) {
                        //alert('Successfully saved');
                        swal({
                                title: "supply saved Successfully",
                                text:
                                    "Your supply has been saved Successfully, You will be rediredcted to Index within 5 seconds",
                                type: "success",
                                timer: 5000,
                                confirmButtonText: "OK",
                                closeOnConfirm: false
                            },
                            function() {
                                window.location.href = "/Supplies/Index";
                            });
                        //here we will clear the form
                        list = [];
                        $('#supplyNo,#supplyDate,#description').val('');
                        $('#supplydetailsItems').empty();
                    } else {
                        alert('Error');
                    }
                    $('#submit').text('Save');
                },
                error: function(error) {
                    console.log(error);
                    $('#submit').text('Save');
                }
            });
        }

    });

});

LoadCategory($('#productCategory'));