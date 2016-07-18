console.log('script is getting executed');
var user = {};
var user_detail = localStorage.getItem("user_detail");
if (user_detail) {
    user = JSON.parse(user_detail);
}
var CC_LENGTH = 14;
/*
$( document ).ready(function() {
    console.log('document ready event fired');
    $.mobile.pageContainer.pagecontainer("change", "login.html");
});
*/
function registerLoginPageFunctions() {
    console.log('inside registerLoginPageFunctions');
    $('#login_button').click(function(event) {
        event.preventDefault();
        if (!($('#user_name').val())) {
            showMessage('Enter a valid user name');
            $('#user_name').focus();
            return false;
        }
        if (!($('#password').val())) {
            showMessage('Enter valid password');
            $('#password').focus();
            return false;
        }
        //disbale the buttons on the screen before making the ajax call
        $("button").attr("disabled", true); 
        var urlDetails = $.mobile.path.parseUrl($.mobile.path.getDocumentBase());
        console.log(urlDetails.domain);
        var loginUrl = urlDetails.domain + '/login';
        console.log('user name :' + $('#user_name').val());
        console.log('password :' + $('#password').val());
        $.ajax({
            url: loginUrl,
            async: true,
            method:'POST',
            data : {username : $('#user_name').val(), password : $('#password').val()},
            beforeSend: function() {
                $.mobile.loading('show');
            },
            complete: function() {
                $.mobile.loading('hide');
                //enable the previously disabled buttons
                $("button").removeAttr("disabled");
            },
            success: function (result) {
                console.log(result);
                if (!result.status) {
                    console.log('record not found');
                    showMessage(result.message);
                    $('#user_name').focus();
                } 
                else {
                    user.password = result.data.password;
                    user.username = result.data.username;
                    user.role = result.data.role;
                    user.plant = result.data.plant;
                    user.screen = result.data.screen || 'pairing';//if the default screen is available, use that otherwise make pairing as the default screen.
                    localStorage.setItem("user_detail", JSON.stringify(user));
                    showDefaultScreen(user.screen);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(textStatus);
                console.log(errorThrown);
                console.log('Network error has occurred please try again!');
                showMessage(errorThrown?errorThrown:textStatus);
            }
        });         
    });
    
    $('#login_cancel_button').click(function(event) {
        event.preventDefault();
        $('#user_name').val('');
        $('#password').val('');
        $('#user_name').focus();
    });

//hide error message when any of the form fields is modified
    $('#login_form').on('input', function() {
        hideMessage();
    });
}
$( document ).delegate("#first_page", "pagebeforeshow", function() {
    if (userLoggedIn()) {
        showDefaultScreen(user.screen);
    }
    else {
        $.mobile.pageContainer.pagecontainer("change", "login.html");
    }
});

$( document ).delegate("#login", "pageshow", function() {
  registerLoginPageFunctions();
});

$( document ).delegate("#pairing", "pageshow", function() {
  registerPairingPageFunctions();
});


$( document ).delegate("#paging", "pageshow", function() {
  registerPagingPageFunctions();
});

$( document ).delegate("#unpairing", "pageshow", function() {
  registerUnpairingPageFunctions();
});
/*
$( document ).delegate("#unpairing", "pageshow", function() {
    //show unpair all button only for admin users
    if (user.role === 'admin') {
        $('#unpairing_pager_grid').show();
        $('#unpairing_pager').prop('disabled', false);
        $('#get_crankcase_div').show();
        $('#unpair_all_button').show();
        $('#unpairing_pager').parent('div').removeClass('ui-state-disabled');
    }
    else {
        $('#get_crankcase_div').hide();
        $('#unpair_all_button').hide();    
    }
});
*/
$( document ).delegate("#maintenance", "pageshow", function() {
  registerMaintenancePageFunctions();
});
$( document ).delegate("#change_password", "pageshow", function() {
  registerChangePasswordPageFunctions();
});
$( document ).delegate("#add_user", "pageshow", function() {
  registerAddUserPageFunctions();
});
$( document ).delegate("#modify_user", "pageshow", function() {
  registerModifyUserPageFunctions();
});
$( document ).delegate("#list_users", "pageshow", function() {
  registerListUsersPageFunctions();
});
$( document ).delegate("#pairs_report", "pageshow", function() {
  registerPairsReportPageFunctions();
});
$( document ).delegate("#logout", "click", function() {
    localStorage.removeItem("user_detail");
    $.mobile.pageContainer.pagecontainer("change", "login.html");
});
/*
TO DO - use jQuery validation plugin to validate forms
$(document).on("pageshow", "#login", function() {
    $('#login_form').validate({
        submitHandler : function(event, validator) {
            console.log('the form is valid');
        },
        invalidHandler : function(event, validator) {
            console.log('the form is invalid');
        }
    });
});
*/
function registerPairingPageFunctions() {
    console.log('inside registerPairingPageFunctions');
    if (!userLoggedIn()){
        $('#pairing').remove();
        $.mobile.pageContainer.pagecontainer("change", "login.html");
        return false;
    }
    ensureInputGetFocus('pairing');
    $('#pairing_crank_case').blur(function(){
        var inputCc = $('#pairing_crank_case').val();
        $('#pairing_crank_case').val(inputCc.slice(0, CC_LENGTH));
    });    
    formatLeftPanel('pairing');
    
    $('#pair_button').click(function(event) {
        event.preventDefault();
        console.log('crank case :' + $('#pairing_crank_case').val());
        console.log('beeper :' + $('#pairing_beeper').val());
        if (!($('#pairing_crank_case').val())) {
            showMessage('A valid crankcase entry required');
            $('#pairing_crank_case').focus();
            return false;
        }
        //Check whether a valid beeper id is entered
        if (!valid_beeper($('#pairing_beeper').val())) {
            //Not a valid beeper ID
            showMessage('A valid beeper ID required');
            $('#pairing_beeper').focus(function () { this.setSelectionRange(0, 9999); return false; } ).mouseup( function () { return false; });
            $('#pairing_beeper').focus();
            return false;
        }
        var urlDetails = $.mobile.path.parseUrl($.mobile.path.getDocumentBase());
        console.log(urlDetails.domain);
        var loginUrl = urlDetails.domain + '/pair';
        
        $.ajax({
            url: loginUrl,
            async: true,
            method:'POST',
            data : {crankCase : $('#pairing_crank_case').val(), beeper : $('#pairing_beeper').val(), user : user.username},
            beforeSend: function() {
                $.mobile.loading('show');
            },
            complete: function() {
                $.mobile.loading('hide');
            },
            success: function (result) {
                console.log(result);
                //showPopup(result.message);
                
                if (result.status) {
                    showMessage(result.message, 'green');
                    $('#pairing_crank_case').val('');
                    $('#pairing_beeper').val('');
                    $('#pairing_crank_case').focus();
                    
                } 
                else {
                    showMessage(result.message);
                    $('#pairErrorMessage').text(result.message);
                    $('#pairErrorPopup').popup('open');//opens the popup
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(textStatus);
                console.log(errorThrown);
                console.log('Network error has occurred please try again!');
                showMessage(errorThrown);
            }
        });         
    });
    $('#pair_cancel_button').click(function(event) {
        event.preventDefault();
        hideMessage();
        $('#pairing_crank_case').val('');
        $('#pairing_crank_case').focus();
        $('#pairing_beeper').val('');
    });

    //hide error message when any of the form fields is modified
    $('#pairing_form').on('input', function() {
        hideMessage();
    });
}

function registerPagingPageFunctions(){ 
    console.log('in registerPagingPageFunctions');
    if (!userLoggedIn()){
        $('#paging').remove();
        $.mobile.pageContainer.pagecontainer("change", "login.html");
        return false;
    }
    ensureInputGetFocus('paging');
    $('#paging_crank_case').blur(function(){
        var inputCc = $('#paging_crank_case').val();
        $('#paging_crank_case').val(inputCc.slice(0, CC_LENGTH));
    });

    //hide the pager form fields and the other related buttons (page and unpair) initially
    $('#paging_pager_div').hide();
    $('#custom_fieldset_buttons').hide();
    formatLeftPanel('paging');
    $('#page_button').click(function(event) {
        event.preventDefault();
        hideMessage();   
        if (!($('#paging_crank_case').val())) {
            showMessage('A valid crankcase entry required');
            $('#paging_crank_case').focus();
            return false;
        }
        if (!($('#paging_pager').val())) {
            showMessage('A valid beeper ID required');
            $('#paging_pager').focus();
            return false;
        }
        var urlDetails = $.mobile.path.parseUrl($.mobile.path.getDocumentBase());
        console.log(urlDetails.domain);
        var loginUrl = urlDetails.domain + '/page';
        console.log('crank case :' + $('#paging_crank_case').val());
        $.ajax({
            url: loginUrl,  
            async: true,
            method:'POST',
            data : {crankCase : $('#paging_crank_case').val()},
            beforeSend: function() {
                $.mobile.loading('show');
            },
            complete: function() {
                $.mobile.loading('hide');
            },
            success: function (result) {
                console.log(result);
                if (!result.status) {
                    $("#paging_crank_case").focus();
                    //$("#paging_crank_case").focus(function () { this.setSelectionRange(0, 9999); return false; } ).mouseup( function () { return false; });
                    showMessage(result.message);
                } 
                else {
                    showMessage(result.message, 'green');
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(textStatus);
                console.log(errorThrown);
                console.log('Network error has occurred please try again!');
            }
        });         
    });
    $('#get_buzzer').click(function(event) {
        event.preventDefault();
        hideMessage();
        if (!($('#paging_crank_case').val())) {
            showMessage('A valid crankcase entry required');
            $('#paging_crank_case').focus();
            return false;
        }
        var urlDetails = $.mobile.path.parseUrl($.mobile.path.getDocumentBase());
        console.log(urlDetails.domain);
        var loginUrl = urlDetails.domain + '/page';
        console.log('crank case :' + $('#paging_crank_case').val());
        $.ajax({
            url: loginUrl,  
            async: true,
            method:'POST',
            data : {crankCase : $('#paging_crank_case').val()},
            beforeSend: function() {
                $.mobile.loading('show');
            },
            complete: function() {
                $.mobile.loading('hide');
            },
            success: function (result) {
                console.log(result);
                
                if (result.data && result.data.beeper) {
                    $('#paging_pager_div').show();
                    $('#custom_fieldset_buttons').show();
                    $('#paging_pager').val(result.data.beeper);
                }
                if (!result.status) {
                    $("#paging_crank_case").focus(function () { this.setSelectionRange(0, 9999); return false; } ).mouseup( function () { return false; });
                    showMessage(result.message);
                } 
                else {
                    var message = 'Beeper ' + result.data.beeper + ' paged successfully';
                    showMessage(message, 'green');
                    //$("#paging_crank_case").val('');
                }
                $("#paging_crank_case").focus(function () { this.setSelectionRange(0, 9999); return false; } ).mouseup( function () { return false; });
                $('#paging_crank_case').focus();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(textStatus);
                console.log(errorThrown);
                console.log('Network error has occurred please try again!');
            }
        });         
    });
    $('#paging_unpair_button').click(function(event) {
        event.preventDefault();
        hideMessage();
        if (!($('#paging_crank_case').val())) {
            showMessage('A valid crankcase entry required');
            $('#paging_crank_case').focus();
            return false;
        }
        if (!($('#paging_pager').val())) {
            showMessage('A valid beeper ID required');
            $('#paging_pager').focus();
            return false;
        }
        var urlDetails = $.mobile.path.parseUrl($.mobile.path.getDocumentBase());
        var loginUrl = urlDetails.domain + '/unpair';
        console.log('crank case :' + $('#paging_crank_case').val());
        console.log('beeper id :' + $('#paging_pager').val());
        console.log(loginUrl);
        $.ajax({
            url: loginUrl,  
            async: true,
            method:'POST',
            data : {crankCase : $('#paging_crank_case').val(), beeper : $('#paging_pager').val()},
            beforeSend: function() {
                $.mobile.loading('show');
            },
            complete: function() {
                $.mobile.loading('hide');
            },
            success: function (result) {
                console.log('Unpaired');
                console.log(result);
                if (result.status) {
                    showMessage(result.message,'green');
                    $('#paging_pager_div').hide();
                    $('#custom_fieldset_buttons').hide();
                    $('#paging_crank_case').val('');
                }
                else {
                    //Unpairing was not successful
                    console.log('Unpairing was not successful');
                    console.log(result);
                    showMessage(result.message);
                } 
                $('#paging_crank_case').focus();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(textStatus);
                console.log(errorThrown);
                console.log('Network error has occurred please try again!');
            }
        });         
    });

    //hide the error message(if any), when any of the form fields modified
    $('#paging_form').on('input', function() {
        hideMessage();
    });

    $('#page_cancel_button').click(function(event) {
        event.preventDefault();
        hideMessage();
        $('#paging_pager_div').hide();
        $('#custom_fieldset_buttons').hide();
        $('#paging_crank_case').val('');
        $('#paging_crank_case').focus();
    });
    
}

function registerUnpairingPageFunctions(){ 
    console.log('in registerUnpairingPageFunctions');
    if (!userLoggedIn()){
        $('#unpairing').remove();
        $.mobile.pageContainer.pagecontainer("change", "login.html");
        return false;
    }
    ensureInputGetFocus('unpairing');
    if (user.role === 'admin') {
        $('#unpairing_pager_grid').show();
        $('#unpairing_pager').prop('disabled', false);
        $('#get_crankcase_div').show();
        $('#unpair_all_button').show();
        $('#unpairing_pager').parent('div').removeClass('ui-state-disabled');
    }
    else {
        $('#get_crankcase_div').hide();
        $('#unpair_all_button').hide();    
    }
    $('#unpairing_crank_case').blur(function(){
        var inputCc = $('#unpairing_crank_case').val();
        $('#unpairing_crank_case').val(inputCc.slice(0, CC_LENGTH));
    });        
    formatLeftPanel('unpairing');
    
    //hide the unpair button initially
    $('#unpair_unpair_button').hide();
    $('#get_crankcase').click(function(event) {
        event.preventDefault();
        $('#unpairing_crank_case').val('');//clear the pager data, if it is already there
        hideMessage();//hide the message, if it is there.
        $('#unpair_button').hide();
        if (!($('#unpairing_pager').val())) {
            showMessage('A valid buzzer ID required');
            $('#unpairing_pager').focus();
            return false;
        }
        var urlDetails = $.mobile.path.parseUrl($.mobile.path.getDocumentBase());
        console.log(urlDetails.domain);
        var loginUrl = urlDetails.domain + '/get_crankcase/' + $('#unpairing_pager').val();
        console.log('pager :' + $('#unpairing_pager').val());
        $.ajax({
            url: loginUrl,  
            async: true,
            method:'POST',
            data : {pager : $('#unpairing_pager').val()},
            beforeSend: function() {
                $.mobile.loading('show');
            },
            complete: function() {
                $.mobile.loading('hide');
            },
            success: function (result) {
                console.log(result);
                if (result.data && result.data.crankCase) {
                    $('#unpair_unpair_button').show();
                    $('#unpairing_crank_case').val(result.data.crankCase);
                }
                if (!result.status) {
                    $("#unpairing_pager").focus(function () { this.setSelectionRange(0, 9999); return false; } ).mouseup( function () { return false; });
                    showMessage(result.message);
                } 
                else {
                    showMessage(result.message, 'green');
                }
                $('#unpairing_pager').focus();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(textStatus);
                console.log(errorThrown);
                console.log('Network error has occurred please try again!');
            }
        });         
    });
    $('#get_unpair_buzzer').click(function(event) {
        event.preventDefault();
        $('#unpairing_pager').val('');//clear the pager data, if it is already there
        hideMessage();//hide the message, if it is there.
        $('#unpair_button').hide();
        if (!($('#unpairing_crank_case').val())) {
            showMessage('A valid crankCase label required');
            $('#unpairing_crank_case').focus();
            return false;
        }
        var urlDetails = $.mobile.path.parseUrl($.mobile.path.getDocumentBase());
        console.log(urlDetails.domain);
        var loginUrl = urlDetails.domain + '/page';
        console.log('crank case :' + $('#unpairing_crank_case').val());
        $.ajax({
            url: loginUrl,  
            async: true,
            method:'POST',
            data : {crankCase : $('#unpairing_crank_case').val()},
            beforeSend: function() {
                $.mobile.loading('show');
            },
            complete: function() {
                $.mobile.loading('hide');
            },
            success: function (result) {
                console.log(result);
                if (result.data && result.data.beeper) {
                    $('#unpairing_pager_grid').show();
                    $('#unpair_unpair_button').show();
                    $('#unpairing_pager').val(result.data.beeper);
                }
                var messageColor = result.status ? 'green' : 'red';
                showMessage(result.message, messageColor);
                $("#unpairing_crank_case").focus(function () { this.setSelectionRange(0, 9999); return false; } ).mouseup( function () { return false; });
                $("#unpairing_crank_case").focus();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(textStatus);
                console.log(errorThrown);
                console.log('Network error has occurred please try again!');
            }
        });         
    });
    $('#unpair_unpair_button').click(function(event) {
        event.preventDefault();
        hideMessage();
        if (!($('#unpairing_pager').val())) {
            showMessage('A valid buzzer ID required');
            $('#unpairing_pager').focus();
            return false;
        }
        if (!($('#unpairing_crank_case').val())) {
            showMessage('A valid crankCase label required');
            $('#unpairing_crank_case').focus();
            return false;
        }
        var urlDetails = $.mobile.path.parseUrl($.mobile.path.getDocumentBase());
        var loginUrl = urlDetails.domain + '/unpair';
        console.log('crank case :' + $('#unpairing_crank_case').val());
        console.log('beeper id :' + $('#unpairing_pager').val());
        console.log(loginUrl);
        $.ajax({
            url: loginUrl,  
            async: true,
            method:'POST',
            data : {crankCase : $('#unpairing_crank_case').val(), beeper : $('#unpairing_pager').val()},
            beforeSend: function() {
                $.mobile.loading('show');
            },
            complete: function() {
                $.mobile.loading('hide');
            },
            success: function (result) {
                console.log('Unpaired');
                console.log(result);
                if (result.status) {
                    showMessage(result.message,'green');
                    $('#unpairing_crank_case').val('');
                    $('#unpairing_pager').val('');
                    $('#unpair_button').hide();
                }
                else {
                    //Unpairing was not successful
                    console.log('Unpairing was not successful');
                    console.log(result);
                    showMessage(result.message);
                } 
                $('#unpairing_crank_case').focus();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(textStatus);
                console.log(errorThrown);
                console.log('Network error has occurred please try again!');
            }
        });         
    });
    $('#unpair_all_button').click(function(event) {
        console.log('inside unpairall handler')
        event.preventDefault();
        hideMessage();
        confirmDialog('Remove all pairs?');
    });
    
    $(document).on('unpair:all', function() {
        var urlDetails = $.mobile.path.parseUrl($.mobile.path.getDocumentBase());
        var loginUrl = urlDetails.domain + '/unpairall';
        console.log(loginUrl);
        $.ajax({
            url: loginUrl,  
            async: true,
            method:'POST',
            data : {},
            beforeSend: function() {
                $.mobile.loading('show');
            },
            complete: function() {
                $.mobile.loading('hide');
            },
            success: function (result) {
                console.log('All Unpaired');
                console.log(result);
                if (result.status) {
                    showMessage(result.message,'green');
                    $('#unpairing_crank_case').val('');
                    $('#unpairing_pager').val('');
                    $('#unpair_button').hide();
                }
                else {
                    //Unpairing was not successful
                    console.log('Unpairing failed');
                    console.log(result);
                    showMessage(result.message);
                } 
                $('#unpairing_pager').focus();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(textStatus);
                console.log(errorThrown);
                console.log('Network error has occurred please try again!');
                showMessage(errorThrown);
            }
        });         
    });

    //hide the error message(if any), when any of the form fields modified
    $('#unpairing_form').on('input', function() {
        hideMessage();
    });

    $('#unpair_cancel_button').click(function(event) {
        event.preventDefault();
        hideMessage();
        $('#unpairing_crank_case').val('');
        $('#unpairing_pager').val('');
        $('#unpair_unpair_button').hide();
        $("#unpairing_crank_case").focus();
    });
    
}

function registerMaintenancePageFunctions() {
    console.log('inside registerMaintenancePageFunctions');
    if (!userLoggedIn()){
        $('#maintenance').remove();
        $.mobile.pageContainer.pagecontainer("change", "login.html");
        return false;
    }
    formatLeftPanel('maintenance');

    //modify user and add user options are availabe for admin only
    if (user.role !== 'admin') {
        $('#modify_user_button').hide();
        $('#add_user_button').hide();
    }
    
    $('#change_password_button').click(function(event) {
        event.preventDefault();
        console.log('change_password_button clicked');
        $.mobile.pageContainer.pagecontainer("change", "change_password.html");
    });
    $('#modify_user_button').click(function(event) {
        event.preventDefault();
        console.log('update_user_button clicked');
        $.mobile.pageContainer.pagecontainer("change", "modify_user.html");
    });
    $('#add_user_button').click(function(event) {
        event.preventDefault();
        console.log('add_user_button clicked');
        $.mobile.pageContainer.pagecontainer("change", "add_user.html");
    });
    $('#list_users_button').click(function(event) {
        event.preventDefault();
        console.log('list_users_button clicked');
        $.mobile.pageContainer.pagecontainer("change", "list_users.html");
    });
}
function registerChangePasswordPageFunctions() {
    console.log('inside registerChangePasswordPageFunctions');
    if (!userLoggedIn()){
        $('#change_password').remove();
        $.mobile.pageContainer.pagecontainer("change", "login.html");
        return false;
    }
    formatLeftPanel('change_password');
    $('#cp_username').val(user.username);
    
    $('#cp_button').click(function(event) {
        event.preventDefault();
        console.log('current password :' + $('#cp_current_password').val());
        console.log('new password:' + $('#cp_new_password').val());
        console.log('new password repeat:' + $('#cp_new2_password').val());
        if (!($('#cp_current_password').val())) {
            showMessage('Please enter current password');
            $('#cp_current_password').focus();
            return false;
        }
        if (!($('#cp_new_password').val())) {
            showMessage('New Password can not be blank');
            $('#cp_new_password').focus();
            return false;
        }
        if ( $('#cp_new2_password').val() !== $('#cp_new_password').val() ) {
            showMessage('New passwords should be same');
            $('#cp_new2_password').focus();
            return false;
        }
        var urlDetails = $.mobile.path.parseUrl($.mobile.path.getDocumentBase());
        console.log(urlDetails.domain);
        var loginUrl = urlDetails.domain + '/cp';
        
        $.ajax({
            url: loginUrl,
            async: true,
            method:'POST',
            data : {username : user.username, cp : $('#cp_current_password').val(), np : $('#cp_new_password').val()},
            beforeSend: function() {
                $.mobile.loading('show');
            },
            complete: function() {
                $.mobile.loading('hide');
            },
            success: function (result) {
                console.log(result);
                //showPopup(result.message);
                
                if (result.status) {
                    showMessage(result.message, 'green');
                    $('#cp_current_password').val('');
                    $('#cp_new_password').val('');
                    $('#cp_new2_password').val('');
                    $('#cp_current_password').focus();
                } 
                else {
                    showMessage(result.message);
                    $('#cp_current_password').focus();
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(textStatus);
                console.log(errorThrown);
                console.log('Network error has occurred please try again!');
                showMessage(errorThrown);
            }
        });         
    });
    $('#cp_cancel_button').click(function(event) {
        event.preventDefault();
        hideMessage();
        $('#cp_current_password').val('');
        $('#cp_new_password').val('');
        $('#cp_new2_password').val('');
        $('#cp_current_password').focus();
    });

    //hide error message when any of the form fields is modified
    $('#change_passsword_form').on('input', function() {
        hideMessage();
    });
}

function registerAddUserPageFunctions() {
    console.log('inside registerAddUserPageFunctions');
    if (!userLoggedIn()){
        $('#add_user').remove();
        $.mobile.pageContainer.pagecontainer("change", "login.html");
        return false;
    }
    formatLeftPanel('add_user');
    
    $('#au_add_button').click(function(event) {
        event.preventDefault();
        if (!($('#au_username').val())) {
            showMessage('Please enter user name');
            $('#au_username').focus();
            return false;
        }
        if (!($('#au_password').val())) {
            showMessage('Please enter password');
            $('#au_password').focus();
            return false;
        }
        var urlDetails = $.mobile.path.parseUrl($.mobile.path.getDocumentBase());
        console.log(urlDetails.domain);
        var loginUrl = urlDetails.domain + '/add_user';
        
        $.ajax({
            url: loginUrl,
            async: true,
            method:'POST',
            data : {username : $('#au_username').val(), password : $('#au_password').val(), plant : $('#au_plant').val(), role : $("input[name=role-choice]:checked").val(), screen : $("input[name=screen-choice]:checked").val()},
            beforeSend: function() {
                $.mobile.loading('show');
            },
            complete: function() {
                $.mobile.loading('hide');
            },
            success: function (result) {
                console.log(result);
                //showPopup(result.message);
                
                if (result.status) {
                    showMessage(result.message, 'green');
                    $('#au_username').val('');
                    $('#au_password').val('');
                    $('#au_plant').val('');
                    $('#regular-role').prop('checked', true);
                    $('input[type="radio"]').checkboxradio('refresh');
                    //$('#admin-role').prop('checked', false).checkboxradio("refresh");
                    //$('#admin-role').attr('checked', false);
                    $('#au_username').focus();
                } 
                else {
                    showMessage(result.message);
                    $('#au_username').focus();
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(textStatus);
                console.log(errorThrown);
                console.log('Network error has occurred please try again!');
                showMessage(errorThrown);
            }
        });         
    });
    $('#au_cancel_button').click(function(event) {
        event.preventDefault();
        hideMessage();
        $('#au_username').val('');
        $('#au_password').val('');
        $('#au_plant').val('');
        $('#regular-role').prop('checked', true);
        $('input[type="radio"]').checkboxradio('refresh');
        $('#au_username').focus();
    });

    //hide error message when any of the form fields is modified
    $('#add_user_form').on('input', function() {
        hideMessage();
    });
}

function registerModifyUserPageFunctions() {
    console.log('inside registerModifyUserPageFunctions');
    if (!userLoggedIn()){
        $('#modify_user').remove();
        $.mobile.pageContainer.pagecontainer("change", "login.html");
        //return false;
    }
    formatLeftPanel('modify_user');
    
    $('#get_user_detail_button').click(function(event) {
        event.preventDefault();
        console.log('user name :' + $('#mu_username').val());
        if (!($('#mu_username').val())) {
            showMessage('Please enter a user name');
            $('#mu_username').focus();
            return false;
        }
        var urlDetails = $.mobile.path.parseUrl($.mobile.path.getDocumentBase());
        console.log(urlDetails.domain);
        var loginUrl = urlDetails.domain + '/get_user';
        
        $.ajax({
            url: loginUrl,
            async: true,
            method:'POST',
            data : {username : $('#mu_username').val()},
            beforeSend: function() {
                $.mobile.loading('show');
            },
            complete: function() {
                $.mobile.loading('hide');
            },
            success: function (result) {
                console.log(result);
                //showPopup(result.message);
                
                if (result.status) {
                    showMessage(result.message, 'green');
                    $('#mu_username').prop('disabled', true);
                    $('#mu_password').val(result.data.password);
                    $('#mu_plant').val(result.data.plant);
                    if (result.data.role) {
                        $('input[name="mu-role-choice"][value="'+result.data.role+'"]').prop('checked', true);
                        $('input[type="radio"]').checkboxradio('refresh');
                    }
                    if (result.data.screen) {
                        $('input[name="mu-screen-choice"][value="'+result.data.screen+'"]').prop('checked', true);
                        $('input[type="radio"]').checkboxradio('refresh');
                    }
                    $('#mu_user_detail_id').show();
                    $('#mu_modify_button').show();
                    $('#mu_delete_button').show();
                    $('#mu_plant').focus();
                } 
                else {
                    showMessage(result.message);
                    $('#mu_username').focus();
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(textStatus);
                console.log(errorThrown);
                console.log('Network error has occurred please try again!');
                showMessage(errorThrown);
            }
        });         
    });
    $('#mu_modify_button').click(function(event) {
        event.preventDefault();
        if (!($('#mu_password').val())) {
            showMessage('Please enter a password');
            $('#mu_password').focus();
            return false;
        }
        var urlDetails = $.mobile.path.parseUrl($.mobile.path.getDocumentBase());
        console.log(urlDetails.domain);
        var loginUrl = urlDetails.domain + '/modify_user';
        
        $.ajax({
            url: loginUrl,
            async: true,
            method:'POST',
            data : {username : $('#mu_username').val(), password : $('#mu_password').val(), plant : $('#mu_plant').val(), role : $("input[name=mu-role-choice]:checked").val(), screen : $("input[name=mu-screen-choice]:checked").val()},
            beforeSend: function() {
                $.mobile.loading('show');
            },
            complete: function() {
                $.mobile.loading('hide');
            },
            success: function (result) {
                console.log(result);
                if (result.status) {
                    showMessage(result.message, 'green');
                    $('#mu_user_detail_id').hide();
                    $('#mu_modify_button').hide();
                    $('#mu_username').prop('disabled', false);
                    $('#mu_username').val('');
                    $('#mu_password').val('');
                    $('#mu_plant').val('');
                    $('input[name="mu-role-choice"][value="regular"]').prop('checked', true);
                    $('input[name="mu-screen-choice"][value="pairing"]').prop('checked', true);
                    $('input[type="radio"]').checkboxradio('refresh');
                    $('#mu_username').focus();
                } 
                else {
                    showMessage(result.message);
                    $('#mu_plant').focus();
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(textStatus);
                console.log(errorThrown);
                console.log('Network error has occurred please try again!');
                showMessage(errorThrown);
            }
        });         
    });

    $('#mu_delete_button').click(function(event) {
        event.preventDefault();
        console.log('mu_delete_button clicked');
        var urlDetails = $.mobile.path.parseUrl($.mobile.path.getDocumentBase());
        console.log(urlDetails.domain);
        var loginUrl = urlDetails.domain + '/delete_user';
        
        $.ajax({
            url: loginUrl,
            async: true,
            method:'POST',
            data : {username : $('#mu_username').val()},
            beforeSend: function() {
                $.mobile.loading('show');
            },
            complete: function() {
                $.mobile.loading('hide');
            },
            success: function (result) {
                console.log(result);
                if (result.status) {
                    showMessage(result.message, 'green');
                    $('#mu_user_detail_id').hide();
                    $('#mu_modify_button').hide();
                    $('#mu_delete_button').hide();
                    $('#mu_username').prop('disabled', false);
                    $('#mu_username').val('');
                    $('#mu_password').val('');
                    $('#mu_plant').val('');
                    $('input[name="mu-role-choice"][value="regular"]').prop('checked', true);
                    $('input[name="mu-screen-choice"][value="pairing"]').prop('checked', true);
                    $('input[type="radio"]').checkboxradio('refresh');
                    $('#mu_username').focus();
                } 
                else {
                    showMessage(result.message);
                    $('#mu_plant').focus();
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(textStatus);
                console.log(errorThrown);
                console.log('Network error has occurred please try again!');
                showMessage(errorThrown);
            }
        });         
    });

    $('#mu_cancel_button').click(function(event) {
        event.preventDefault();
        hideMessage();
        $('#mu_user_detail_id').hide();
        $('#mu_modify_button').hide();
        $('#mu_delete_button').hide();
        $('#mu_username').prop('disabled', false);
        $('#mu_username').val('');
        $('#mu_password').val('');
        $('#mu_plant').val('');
        $('input[name="mu-role-choice"][value="regular"]').prop('checked', true);
        $('input[name="mu-screen-choice"][value="pairing"]').prop('checked', true);
        $('input[type="radio"]').checkboxradio('refresh');
        $('#mu_username').focus();
    });

    //hide error message when any of the form fields is modified
    $('#modify_user_form').on('input', function() {
        hideMessage();
    });
}
function registerListUsersPageFunctions() {
    console.log('inside registerListUsersPageFunctions');
    if (!userLoggedIn()){
        $('#list_users').remove();
        $.mobile.pageContainer.pagecontainer("change", "login.html");
        return false;
    }
    formatLeftPanel('list_users');
    var urlDetails = $.mobile.path.parseUrl($.mobile.path.getDocumentBase());
    var loginUrl = urlDetails.domain + '/get_users';
    console.log(loginUrl);
    $.ajax({
            url: loginUrl,
            async: true,
            method:'GET',
            beforeSend: function() {
                $.mobile.loading('show');
            },
            complete: function() {
                $.mobile.loading('hide');
                //enable the previously disabled buttons
                //$("button").removeAttr("disabled");
            },
            success: function (result) {
                console.log(result);
                if (!result.status) {
                    console.log('record not found');
                    showMessage(result.message);
                } 
                else {
                    $('#list_users_table tbody').html('');
                    for (var i=0; i<result.data.length;i++) {
                        //clear the template row data. result.data[i].user can be undefined. If it is undefined, html() won't clear the previous value in the template.
                        $('#list-users-row-template table tbody tr td').html('');
                        $('#list-users-row-template table tbody tr td:nth-child(1)').html(result.data[i].username);
                        $('#list-users-row-template table tbody tr td:nth-child(2)').html(result.data[i].role);
                        $('#list-users-row-template table tbody tr td:nth-child(3)').html(result.data[i].plant);
                        var template = $('#list-users-row-template table tbody').html();
                        console.log(template);
                        $('#list_users_table tbody').append(template);
                    }
                    $('#list_users_table tbody tr:even').css('background-color', '#DDDFE4');
                    $('#list_users_table tbody tr:odd').css('background-color', '#E0B2AE');
                    $('#list_users_table').table('refresh');
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(textStatus);
                console.log(errorThrown);
                console.log('Network error has occurred please try again!');
                showMessage(errorThrown?errorThrown:textStatus);
            }
        });         
}


function registerPairsReportPageFunctions() {
    console.log('inside registerPairsReportPageFunctions');
    if (!userLoggedIn()){
        $('#pairs_report').remove();
        $.mobile.pageContainer.pagecontainer("change", "login.html");
        return false;
    }
    formatLeftPanel('pairs_report');
    var urlDetails = $.mobile.path.parseUrl($.mobile.path.getDocumentBase());
    var loginUrl = urlDetails.domain + '/get_pairs';
    console.log(loginUrl);
    $.ajax({
            url: loginUrl,
            async: true,
            method:'GET',
            beforeSend: function() {
                $.mobile.loading('show');
            },
            complete: function() {
                $.mobile.loading('hide');
                //enable the previously disabled buttons
                $("button").removeAttr("disabled");
            },
            success: function (result) {
                console.log(result);
                if (!result.status) {
                    console.log('record not found');
                    showMessage(result.message);
                } 
                else {
                    $('#pairs_report_table tbody').html('');
                    for (var i=0; i<result.data.length;i++) {
                        //clear the template row data. result.data[i].user can be undefined. If it is undefined, html() won't clear the previous value in the template.
                        $('#pairs-report-row-template table tbody tr td').html('');
                        $('#pairs-report-row-template table tbody tr td:nth-child(1)').html(result.data[i].crankCase);
                        $('#pairs-report-row-template table tbody tr td:nth-child(2)').html(result.data[i].beeper);
                        $('#pairs-report-row-template table tbody tr td:nth-child(3)').html(result.data[i].user);
                        var template = $('#pairs-report-row-template table tbody').html();
                        $('#pairs_report_table tbody').append(template);
                    }
                    $('#pairs_report_table tbody tr:even').css('background-color', '#DDDFE4');
                    $('#pairs_report_table tbody tr:odd').css('background-color', '#E0B2AE');
                    $('#pairs_report_table').table('refresh');
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(textStatus);
                console.log(errorThrown);
                console.log('Network error has occurred please try again!');
                showMessage(errorThrown?errorThrown:textStatus);
            }
        });         
}
function loadLeftPanel(containerID) {
    console.log('starting the loadLeftPanel');
    
    //loading the panel causes the current active element to loose focus
    //so identify the element which is focused before loading the panel
    //once the panel is loaded, get the focus to that element
    var focusedElement = $(':focus');
    $.get('left-panel.html', function(data) { 
            console.log('loading left-panel.html');
            var pageID = '#' + containerID;
            $(pageID).append(data);
            $("[data-role=panel]").panel().enhanceWithin(); 
            $(pageID + ' [data-role=panel] li').filter(pageID + '_page').remove();
            if (user.role === 'regular' && user.screen === 'pairing') {
                $(pageID + ' [data-role=panel]  #paging_page').remove();
            }
            if (user.role === 'regular' && user.screen === 'paging') {
                $(pageID + ' [data-role=panel]  #pairing_page').remove();
                $(pageID + ' [data-role=panel]  #unpairing_page').remove();
                $(pageID + ' [data-role=panel]  #pairs_report_page').remove();
            }
            if (user.role === 'regular' && user.screen === 'unpairing') {
                $(pageID + ' [data-role=panel]  #paging_page').remove();
                $(pageID + ' [data-role=panel]  #pairing_page').remove();
                $(pageID + ' [data-role=panel]  #pairs_report_page').remove();
            }
            console.log('left panel loaded');
            //get the focus to the element which had the focus before loading the panel
            focusedElement.focus();
        }, 'html');
}

function formatLeftPanel(containerID) {
    console.log('starting the formatLeftPanel');
    var pageID = '#' + containerID;
    $(pageID + ' [data-role=panel] li').filter(pageID + '_page').remove();
    if (user.role === 'regular' && user.screen === 'pairing') {
                $(pageID + ' [data-role=panel]  #paging_page').remove();
    }
    if (user.role === 'regular' && user.screen === 'paging') {
        $(pageID + ' [data-role=panel]  #pairing_page').remove();
        $(pageID + ' [data-role=panel]  #unpairing_page').remove();
        $(pageID + ' [data-role=panel]  #pairs_report_page').remove();
    }
    if (user.role === 'regular' && user.screen === 'unpairing') {
        $(pageID + ' [data-role=panel]  #paging_page').remove();
        $(pageID + ' [data-role=panel]  #pairing_page').remove();
        $(pageID + ' [data-role=panel]  #pairs_report_page').remove();
    }
}

function showMessage(errorMessage, color){
    color = color || 'red';
    var currentPage = $.mobile.pageContainer.pagecontainer('getActivePage');
    var messageContainer = currentPage.find('#message_div');
    messageContainer.css('color', color);
    messageContainer.find('p').text(errorMessage);
    messageContainer.show();
}

function hideMessage(){
    var currentPage = $.mobile.pageContainer.pagecontainer('getActivePage');
    var messageContainer = currentPage.find('#message_div');
    messageContainer.hide();
}

function showPopup(popupMessage) {
    $('#popup_id p').text(popupMessage);
    $('#popup_id').popup('open');
    setTimeout(function(){$('#popup_id').popup('close');}, 2000);
}

function confirmDialog(text, callback) {
    console.log('inside confirmDialog');
    var popupDialogObj = $('#popupDialog');
    popupDialogObj.popup({
        afterclose: function (event, ui) {
            popupDialogObj.find(".optionConfirm").first().off('click');
            var isConfirmed = popupDialogObj.attr('data-confirmed') === 'yes' ? true : false;
            if (isConfirmed) {
                popupDialogObj.attr('data-confirmed', 'no');
                $(document).trigger( 'unpair:all');
            }
        }
    });
    popupDialogObj.popup('open');
    popupDialogObj.find(".optionConfirm").first().on('click', function () {
        popupDialogObj.attr('data-confirmed', 'yes');
    });
}

function userLoggedIn() {
    return user.username; //if the user is availabe user.username will be a truthy otherwise undefined (falsy).
}

//Checks whether the input_beeper is a valid beeper id 
//returns false if it is not a valid beeper id otherwise returns true
function valid_beeper(input_beeper) {
    if (input_beeper.search(/^\d{4}$/) === -1) return false; //beeper id can have only 4 digits
    if (input_beeper.search(/0000/) === 0) return false;//beeper id can not be 0000
    return true;
}
function showDefaultScreen(screen) {
    switch (screen) {
        case 'pairing'      :   $.mobile.pageContainer.pagecontainer("change", "pairing.html");
                                break;
        case 'paging'       :   $.mobile.pageContainer.pagecontainer("change", "paging.html");
                                break;
        case 'unpairing'    :   $.mobile.pageContainer.pagecontainer("change", "unpairing.html");
                                break;
        default             :   $.mobile.pageContainer.pagecontainer("change", "pairing.html");
                                break;
    }
}

//This function ensures that any click on the page (other than on INPUT AND BUTTON), 
//won't take away the focus from input fields and buttons.
function ensureInputGetFocus(page) {
    var inputElementLastFocused = '';
    $('input, button').focusout(function(event){
        inputElementLastFocused = event.target;
    });
    $('#' + page).click(function(event){
        if  (event.target.nodeName !== 'INPUT' && event.target.nodeName !== 'BUTTON') {
            $(inputElementLastFocused).focus();
        }
    });
}