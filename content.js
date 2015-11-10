// Copyright (c) 2015 by Bryan Giglio. All rights reserved.

// Inform the background page that 
// this tab should have a page-action
chrome.runtime.sendMessage({
    from:    'content',
    subject: 'showPageAction'
});

// Listen for messages from the popup
chrome.runtime.onMessage.addListener(function (msg, sender, response) {
    // First, validate the message's structure
    if ((msg.from === 'popup') && (msg.subject === 'DOMInfo')) {
        // Collect the necessary data 
        // (For your specific requirements `document.querySelectorAll(...)`
        //  should be equivalent to jquery's `$(...)`)
        

        var url = window.location.href;
        var results = 'N/A';
        var patentlinks = '';

        // Check for first version of Google Patents
        if ((/patents.google.com\/\?q/).test(url)) {
            
            // Find elements containing patent data
            patentlinks = document.querySelectorAll('h4.metadata span:nth-child(2)');

            if (patentlinks.length > 1) {
                results = '';
            }

            // Remove HTML and build list of patent numbers
            for (var index = 0 ; index < patentlinks.length ; index++) {
                results = results + String(patentlinks[index].textContent) + '<br>';

            }
        }

        // Check for second version of Google Patents     
        else if ((/tbm=pts/).test(url)) {
            // Find elements containing patent data
            patentlinks = document.querySelectorAll('._Rm');

            if (patentlinks.length > 1) {
                results = '';
            }

            // Check for advertisement in first element and skip it
            if (!((/google.com/).test(patentlinks[0].textContent))) {
                var start = 1;
            } else {var start = 0};

            // Remove HTML and junk and build list of patent numbers
            for (var index = start ; index < patentlinks.length ; index++) {
                var patenturl = String(patentlinks[index].textContent);

                results = results + patenturl.replace('www.google.com/patents/', '').replace('?cl=en', '') + '<br>';
            }
        };

        var domInfo = {
            contents: results,
            //total:   document.querySelectorAll('*').length,
            //url: url
        };
    
        // Directly respond to the sender (popup), 
        // through the specified callback */
        response(domInfo);
    }
});