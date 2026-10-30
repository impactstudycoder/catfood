sap.ui.define([], function () {
    "use strict";

    return {
        formatPrice: function (sPrice) {
            if (sPrice === undefined || sPrice === null) {
                return "";
            }
            return parseFloat(sPrice).toFixed(2);
        },

        formatStockState: function (iStock) {
            return iStock > 0 ? "Success" : "Error";
        }
    };
});
