//
// Tests the extra attendance API.
// 
// Copyright (c) The Dojo Foundation 2011. All Rights Reserved.
//
/*global define module test raises deepEqual ok equal strictEqual*/
define([
    'coweb/ext/attendance',
    'org/OpenAjax',
    'coweb/topics'
], function(attendance, OpenAjax, topics) {
    module('attendance', {
        setup: function() {
            // make sure we start reset since this is a singleton
            attendance.users = {};
            attendance.count = 0;
            attendance.unsubscribeAll();

            this._subs = [];
            this.initialRoster = {
                1 : 'john.doe',
                2 : 'jane.smith',
                3 : 'bob.watts'
            };
            this.targetRoster = [
                {site : 1, username : 'john.doe', local : false},
                {site : 2, username : 'jane.smith', local : false},
                {site : 3, username : 'bob.watts', local : false}
            ];
        },
        teardown: function() {
            attendance.unsubscribeAll();
            for(var i=0, l=this._subs.length; i<l; i++) {
                OpenAjax.hub.unsubscribe(this._subs[i]);
            }
        }
    });
    
    test('initial roster', 20, function() {
        var self = this,
            events = 0,
            local = {
                site : 4,
                username : 'bill.smith',
                local : true
            },
            cb = function(args) {
                equal(args.type, 'join');
                if(events < 3) {
                    equal(args.count, 3);
                    deepEqual(args.users, self.targetRoster);
                } else {
                    equal(args.count, 4);
                    deepEqual(args.users[0], local);
                }
                events++;
            },
            obj = {
                sentinel : 'sentinel',
                cb : function(args) {
                    ok(this.sentinel, 'sentinel');
                    cb(args);
                }
            };

        attendance.subscribeChange(cb);
        attendance.subscribeChange(obj, cb);
        attendance.subscribeChange(obj, 'cb');
        
        OpenAjax.hub.publish(topics.READY, {
            roster : this.initialRoster,
            site : local.site,
            username : local.username
        });
    });
    
    test('remote join', 10, function() {
        var self = this,
            target = {
                site : 4,
                username : 'bill.smith',
                local : false
            },
            cb = function(args) {
                equal(args.type, 'join');
                equal(args.count, 4);
                deepEqual(args.users[0], target);
            },
            obj = {
                sentinel : 'sentinel',
                cb : function(args) {
                    ok(this.sentinel, 'sentinel');
                    cb(args);
                }
            };

        // prep initial roster
        for(var i=0, l=this.targetRoster.length; i<l; i++) {
            var user = this.targetRoster[i];
            attendance._addUser(user.site, user.username, user.local);
        }
        
        attendance.subscribeChange(cb);
        attendance.subscribeChange(obj, cb);
        attendance.subscribeChange(obj, 'cb');
        
        OpenAjax.hub.publish(topics.SITE_JOIN, {
            site : target.site,
            username : target.username
        });
    });
    
    test('remote leave', 10, function() {
        var self = this,
            target = this.targetRoster[0],
            cb = function(args) {
                equal(args.type, 'leave');
                equal(args.count, 2);
                deepEqual(args.users[0], target);
            },
            obj = {
                sentinel : 'sentinel',
                cb : function(args) {
                    ok(this.sentinel, 'sentinel');
                    cb(args);
                }
            };

        // prep initial roster
        for(var i=0, l=this.targetRoster.length; i<l; i++) {
            var user = this.targetRoster[i];
            attendance._addUser(user.site, user.username, user.local);
        }
        
        attendance.subscribeChange(cb);
        attendance.subscribeChange(obj, cb);
        attendance.subscribeChange(obj, 'cb');
        
        OpenAjax.hub.publish(topics.SITE_LEAVE, {
            site : target.site,
            username : target.username
        });
    });
});