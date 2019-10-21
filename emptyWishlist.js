(function() {
    if (location.hostname !== 'store.steampowered.com') {
        alert('Run this code on the Steam Store!');
        return;
    } else if (typeof jQuery !== 'function') {
        ShowAlertDialog('Fail', 'This page has no jQuery, try homepage.');
        return;
    } else if (document.getElementById('header_notification_area') === null) {
        ShowAlertDialog('Fail', 'You have to be logged in.');
        return;
    }

    var loaded = 0,
        total = g_rgWishlistData.length,
        modal = ShowBlockingWaitDialog('Executing...', 'Please wait until all requests finish.');

    for (var i = 0; i < total; i++) {
        jQuery.post(
            g_strWishlistBaseURL + 'remove/', {
                sessionid: g_sessionID,
                appid: g_rgWishlistData[i]['appid']
            },
            function(data) {
                loaded++;

                modal.Dismiss();

                if (loaded === total) {
                    ShowAlertDialog('All done!', 'Enjoy.');
                } else {
                    modal = ShowBlockingWaitDialog('Executing...', 'Loaded ' + loaded + '/' + total);
                }
            }
        ).fail(function() {
            loaded++;

            modal.Dismiss();

            if (loaded === total) {
                ShowAlertDialog('All done!', 'Enjoy.');
            } else {
                modal = ShowBlockingWaitDialog('Executing...', 'Loaded ' + loaded + '/' + total);
            }
        });
    }
}());
