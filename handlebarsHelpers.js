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
    ifIsAdminOrOwner: function (isAdminOrOwner, currentUserProducts, options) {
        if (isAdminOrOwner || currentUserProducts.includes(this._id)) {
            return options.fn(this);
        }
        return options.inverse(this);
    }
};
