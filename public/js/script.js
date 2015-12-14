
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
                console.log('login successful');
                console.log(result);
                if (!result.status) {
                    console.log('record not found');
                } 
                else {
                    $.mobile.pageContainer.pagecontainer("change", "pairing.html");
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(textStatus);
                console.log(errorThrown);
                console.log('Network error has occurred please try again!');
            }
        });         
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

function registerPairingPageFunctions() {
    loadLeftPanel('pairing');
    
    $('#pair_button').click(function(event) {
        event.preventDefault();
        var urlDetails = $.mobile.path.parseUrl($.mobile.path.getDocumentBase());
        console.log(urlDetails.domain);
        var loginUrl = urlDetails.domain + '/pair';
        console.log('crank case :' + $('#pairing_crank_case').val());
        console.log('beeper :' + $('#pairing_beeper').val());
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
                console.log('pairing successful');
                console.log(result);
                if (!result.status) {
                    console.log('record not found');
                } 
                else {
                    //$.mobile.pageContainer.pagecontainer("change", "#pairing");
                }
                console.log('result.message :' + result.message);
                $('#popupPairing p').text(result.message);
                $('#popupPairing').popup('open');
                setTimeout(function(){$('#popupPairing').popup('close');}, 5000);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(textStatus);
                console.log(errorThrown);
                console.log('Network error has occurred please try again!');
            }
        });         
    });
}

function registerPagingPageFunctions(){ 
    console.log('in registerPagingPageFunctions');
    //hide the pager form fields and the other related buttons (page, unpair, skip) initially
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
        var loginUrl = urlDetails.domain + '/get_pager/' + $('#paging_crank_case').val();
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
                console.log('Received pager');
                console.log(result);
                if (!result.status) {
                    console.log('record not found');
                    console.log(result);
                } 
                else {
                    //console.log(result);
                    $('#paging_pager_div').show();
                    $('#custom_fieldset_buttons').show();
                    $('#paging_pager').val(result.data.beeper);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(textStatus);
                console.log(errorThrown);
                console.log('Network error has occurred please try again!');
            }
        });         
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