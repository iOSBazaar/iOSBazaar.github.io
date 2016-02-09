// Initialize your app
var myApp = new Framework7({
    animateNavBackIcon:true,
    modalTitle: ("iOSBazaar")
});

// Export selectors engine
var $$ = Dom7;

// Add main View
var mainView = myApp.addView('.view-main', {
    // Enable dynamic Navbar
    dynamicNavbar: true,
    // Enable Dom Cache so we can use all inline pages
    domCache: true
});

var featureds = ['TimeApps', 'RubyChat'];
var descriptions = ['Featured App'];
 
// Pull to refresh content
var ptrContent = $$('.pull-to-refresh-content');
 
// Add 'refresh' listener on it
ptrContent.on('refresh', function (e) {
    // Emulate 2s loading
    setTimeout(function () {
        // Random image
        var picURL = 'http://hhhhold.com/88/d/jpg?' + Math.round(Math.random() * 100);
        // Random song
        var featured = featureds[Math.floor(Math.random() * featureds.length)];
        // Random author
        var description = descriptions[Math.floor(Math.random() * descriptions.length)];
        // List item html
        var itemHTML = '<li style="background-color:#FFF999;">' + '<a href="#" class="item-link item-content">' +
                          '<div class="item-media"><img src="' + picURL + '" width="44"/></div>' +
                          '<div class="item-inner">' +
                            '<div class="item-title-row">' +
                              '<div class="item-title">' + featured + '</div>' +
                            '</div>' +
                            '<div class="item-subtitle">' + description + '</div>' +
                          '</div>' + '</a>' +
                        '</li>';
        // Prepend new list element
        ptrContent.find('ul').prepend(itemHTML);
        // When loading done, we need to reset it
        myApp.pullToRefreshDone();
    }, 2000);
});