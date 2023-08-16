// handlebarsHelpers.js

module.exports = {
    inc: function (value, options) {
        return parseInt(value) + 1;
    },
    if_eq: function (a, b, opts) {
        if (a == b) {
            return opts.fn(this);
        } else {
            return opts.inverse(this);
        }
    },
    multiplicar: function (a, b) {
        return a * b;
    },
    ifAdminOrOwner: function (isAdminOrOwner, options) {
        if (isAdminOrOwner) {
            return options.fn(this);
        } else {
            return options.inverse(this);
        }
    },
    isAdmin: (user) => {
        return user && user.rol === 'admin';
    },
    isAdminOrPremium: (user) => {
        return user && (user.rol === 'admin' || user.rol === 'premium');
    },
    isAuthenticated: (user, options) => {
        if (user) {
            return true
        }
        return false
    },
    formatDate: (date) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
        return new Intl.DateTimeFormat('en-US', options).format(date);
    },
};
