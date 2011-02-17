//
// Service bot test page.
//
// Copyright (c) The Dojo Foundation 2011. All Rights Reserved.
// Copyright (c) IBM Corporation 2008, 2011. All Rights Reserved.
//
require({baseUrl : '../../libs'}, [
    'coweb/main'
], function(coweb) {

    /* Logs info about a response to a bot request. */
    var _onBotResponse = function(serviceName, id, value, error) {
        console.log(serviceName, 'responded to collab.id:', id, 'value:', 
            value, 'error:', error);
    }

    /* Logs info about a message published to all users by a bot. */
    var _onBotPublish = function(serviceName, id, value, error) {
        console.log(serviceName, 'published to collab.id:', id, 'value:', 
            value, 'error:', error);
    } 

    /* Builds a function that invokes the echo bot using the given collab API
     * instance. 
     */
    var _makeEchoFunc = function(collab) {
        return function(text) {
            collab.postService('echo', {message : text}, 
                dojo.partial(_onBotResponse, 'echo', collab.id));
        };
    }

    /* Builds a function that invokes the utctime bot using the given collab API
     * instance. 
     */
    var _makeTimeFunc = function(collab) {
        return function() {
            collab.postService('utctime', {}, 
                dojo.partial(_onBotResponse, 'utctime', collab.id));
        };
    }

    /* Subscribes the collab instances to the echo and utctime services. */
    var _onCollabReady = function(collab) {
        // listen on both interfaces to echo service
        collab.subscribeService('echo', 
            dojo.partial(_onBotPublish, 'echo', collab.id));
        collab.subscribeService('utctime', 
            dojo.partial(_onBotPublish, 'utctime', collab.id));    
    }

    require.ready(function() {
        // build a couple collab interfaces
        // collab1 = coweb.initCollab({id : 'collab1'});
        // collab1.subscribeConferenceReady(dojo.partial(_onCollabReady, collab1));
        // collab2 = coweb.initCollab({id : 'collab2'});
        // collab2.subscribeConferenceReady(dojo.partial(_onCollabReady, collab2));
        // 
        // // build funcs for use at the console
        // echo1 = _makeEchoFunc(collab1);
        // echo2 = _makeEchoFunc(collab2);
        // getTime1 = _makeTimeFunc(collab1);
        // getTime2 = _makeTimeFunc(collab2);
        // 
        // // initialize a session
        var sess = coweb.initSession();
        console.log(sess);
        // var prep = {collab: false, autoJoin : true, autoUpdate: true};
        // sess.prepareConference(prep);
        // coweb.initCollab();
    });

});