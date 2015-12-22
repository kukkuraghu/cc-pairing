
$( document ).ready(function() {
    $.mobile.pageContainer.pagecontainer("change", "login.html");
});
function registerLoginPageFunctions() {
    console.log('inside registerLoginPageFunctions');
    $('#login_button').click(function(event) {
        event.preventDefault();
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
                    $.mobile.pageContainer.pagecontainer("change", "pairing.html");
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
//hide error message when any of the form fields is modified
    $('#login_form').on('input', function() {
        $('#message_div').hide();
    });
}
$( document ).delegate("#login", "pageinit", function() {
  registerLoginPageFunctions();
});

$( document ).delegate("#pairing", "pageinit", function() {
  registerPairingPageFunctions();
});

$( document ).delegate("#paging", "pageinit", function() {
  registerPagingPageFunctions();
});

$( document ).delegate("#unpairing", "pageinit", function() {
  registerUnpairingPageFunctions();
});

function registerPairingPageFunctions() {
    loadLeftPanel('pairing');
    
    $('#pair_button').click(function(event) {
        event.preventDefault();
        console.log('crank case :' + $('#pairing_crank_case').val());
        console.log('beeper :' + $('#pairing_beeper').val());
        if (!($('#pairing_crank_case').val())) {
            showMessage('A valid crankcase entry required');
            $('#pairing_crank_case').focus();
            return false;
        }
        if (!($('#pairing_beeper').val())) {
            showMessage('A valid beeper ID required');
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
            data : {crankCase : $('#pairing_crank_case').val(), beeper : $('#pairing_beeper').val()},
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
        $('#message_div').hide();
        $('#pairing_crank_case').val('');
        $('#pairing_crank_case').focus();
        $('#pairing_beeper').val('');
    });

    //hide error message when any of the form fields is modified
    $('#pairing_form').on('input', function() {
        $('#message_div').hide();
    });
}

function registerPagingPageFunctions(){ 
    console.log('in registerPagingPageFunctions');
    //hide the pager form fields and the other related buttons (page and unpair) initially
    $('#paging_pager_div').hide();
    $('#custom_fieldset_buttons').hide();
    loadLeftPanel('paging');
    $('#page_button').click(function(event) {
        event.preventDefault();
        var urlDetails = $.mobile.path.parseUrl($.mobile.path.getDocumentBase());
        console.log(urlDetails.domain);
        var loginUrl = urlDetails.domain + '/page/' + $('#paging_crank_case').val();
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
                console.log('paging successful');
                console.log(result);
                if (!result.status) {
                    console.log('record not found');
                } 
                else {
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
        var urlDetails = $.mobile.path.parseUrl($.mobile.path.getDocumentBase());
        console.log(urlDetails.domain);
        var loginUrl = urlDetails.domain + '/page/' + $('#paging_crank_case').val();
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
                
                if (result.beeper) {
                    $('#paging_pager_div').show();
                    $('#custom_fieldset_buttons').show();
                    $('#paging_pager').val(result.beeper);
                }
                if (!result.status) {
                    $("#paging_crank_case").focus(function () { this.setSelectionRange(0, 9999); return false; } ).mouseup( function () { return false; });
                    showMessage(result.message);
                } 
                else {
                    showMessage(result.message, 'green');
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
    $('#unpair_button').click(function(event) {
        event.preventDefault();
        $('#message_div').hide();
        var urlDetails = $.mobile.path.parseUrl($.mobile.path.getDocumentBase());
        var loginUrl = urlDetails.domain + '/unpair/' + $('#paging_crank_case').val() + '/' + $('#paging_pager').val();
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
        $('#message_div').hide();
    });

    $('#page_cancel_button').click(function(event) {
        event.preventDefault();
        $('#message_div').hide();
        $('#paging_pager_div').hide();
        $('#custom_fieldset_buttons').hide();
        $('#paging_crank_case').val('');
        $('#paging_crank_case').focus();
    });
    
}

function registerUnpairingPageFunctions(){ 
    console.log('in registerUnpairingPageFunctions');
    //hide the unpair button initially
    $('#unpair_button').hide();
    loadLeftPanel('paging');
    $('#get_crankcase').click(function(event) {
        event.preventDefault();
        $('#unpairing_crank_case').val('');//clear the pager data, if it is already there
        hideMessage();//hide the message, if it is there.
        $('#unpair_button').hide();
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
                    $('#unpair_button').show();
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
    $('#get_buzzer').click(function(event) {
        event.preventDefault();
        $('#unpairing_pager').val('');//clear the pager data, if it is already there
        hideMessage();//hide the message, if it is there.
        $('#unpair_button').hide();
        var urlDetails = $.mobile.path.parseUrl($.mobile.path.getDocumentBase());
        console.log(urlDetails.domain);
        var loginUrl = urlDetails.domain + '/get_pager/' + $('#unpairing_crank_case').val();
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
                    $('#unpair_button').show();
                    $('#unpairing_pager').val(result.data.beeper);
                }
                if (!result.status) {
                    $("#unpairing_crank_case").focus(function () { this.setSelectionRange(0, 9999); return false; } ).mouseup( function () { return false; });
                    showMessage(result.message);
                } 
                else {
                    showMessage(result.message, 'green');
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
    $('#unpair_button').click(function(event) {
        event.preventDefault();
        $('#message_div').hide();
        var urlDetails = $.mobile.path.parseUrl($.mobile.path.getDocumentBase());
        var loginUrl = urlDetails.domain + '/unpair/' + $('#unpairing_crank_case').val() + '/' + $('#unpairing_pager').val();
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
                $('#unpairing_pager').focus();
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
        $('#message_div').hide();
        //TO DO - Add a confirmation dialog
        //$.mobile.changePage('unpairall_dialog.html', {transition: 'pop', role: 'dialog'});  
        //$.mobile.pageContainer.pagecontainer("change", "login.html"); 
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
                    console.log('Unpairing was not successful');
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
        $('#message_div').hide();
    });

    $('#page_cancel_button').click(function(event) {
        event.preventDefault();
        $('#message_div').hide();
        $('#paging_pager_div').hide();
        $('#custom_fieldset_buttons').hide();
        $('#paging_crank_case').val('');
        $('#paging_crank_case').focus();
    });
    
}


function loadLeftPanel(containerID) {
    $.get('left-panel.html', function(data) { 
            console.log('loading left-panel.html');
            //$('#pairing').append(data);
            $('#' + containerID).append(data);
            //$.mobile.pageContainer.prepend(data);
            $("[data-role=panel]").panel().enhanceWithin(); 
        }, 'html');
}

function showMessage(errorMessage, color){
    color = color || 'red';
    $('#message_div').css('color', color);
    $('#message_div p').text(errorMessage);
    $('#message_div').show();
}

function hideMessage(){
    $('#message_div').hide();
}

function showPopup(popupMessage) {
    $('#popup_id p').text(popupMessage);
    $('#popup_id').popup('open');
    setTimeout(function(){$('#popup_id').popup('close');}, 2000);
}