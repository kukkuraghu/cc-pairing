$( document ).bind( 'pagebeforeload', function( event, data ){
    console.log('Before loading page');
});
$( document ).bind( 'pagebeforeshow', function( event, data ){
    console.log('Before showing page');
});
$( document ).bind( 'mobileinit', function( event, data ){
    console.log('mobileinit  fired');
});
$('#login_button').click(function(event) {
    event.preventDefault();
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
        },
        success: function (result) {
            console.log('login successful');
            console.log(result);
            if (!result.status) {
                console.log('record not found');
            } 
            else {
                $.mobile.pageContainer.pagecontainer("change", "#pairing");
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
            console.log(errorThrown);
            console.log('Network error has occurred please try again!');
        }
    });         
});

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
            console.log('login successful');
            console.log(result);
            if (!result.status) {
                console.log('record not found');
            } 
            else {
                $.mobile.pageContainer.pagecontainer("change", "#pairing");
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
            console.log(errorThrown);
            console.log('Network error has occurred please try again!');
        }
    });         
});

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
            console.log('login successful');
            console.log(result);
            if (!result.status) {
                console.log('record not found');
            } 
            else {
                $.mobile.pageContainer.pagecontainer("change", "#pairing");
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
            console.log(errorThrown);
            console.log('Network error has occurred please try again!');
        }
    });         
});