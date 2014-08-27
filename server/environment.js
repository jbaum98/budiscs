Meteor.startup(function () {
    Accounts.config({
        'sendVerificationEmail': false,
        'forbidClientAccountCreation': true,
        'loginExpirationInDays': null
    });
    Kadira.connect('M32wqxD2wwfrHXAPf', '84c937de-9c73-45fe-a06c-06dff3381cef')
});