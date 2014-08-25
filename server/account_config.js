Meteor.startup(function () {
    'use strict';
    if (Meteor.users.find().count() === 0) {
        Accounts.createUser({
            'username': 'admin',
            'password': 'beusbeyou'
        });

        Accounts.config({
            'sendVerificationEmail': false,
            'forbidClientAccountCreation': true,
            'loginExpirationInDays': null
        });
    }
});