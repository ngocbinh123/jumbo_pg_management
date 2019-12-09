const fecha = require('fecha');
module.exports = {
    getCurrentDateStr() {
        const currentDate = fecha.default.format(new Date(), 'DD/MM/YYYY');
        return currentDate;
    },
    getCurrentTimeStr() {
        const currentDate = fecha.default.format(new Date(), 'HH:mm');
        return currentDate;
    },
    convertLocalDateToRequestDate(localDate) {
        const arr = localDate.split("/");
        return arr[2] + "-" + arr[1] + "-" + arr[0];
    },
    convertRequestDateToLocalDate(requestDate) {
        const arr = requestDate.split("-");
        return arr[2] + "/" + arr[1] + "/" + arr[0];
    },
    getCurrentDateStrForRequest() {
        const currentDate = fecha.default.format(new Date(), 'YYYY-MM-DD');
        return currentDate;
    },
    formatCurrencystr(currency, priceUnit = "VND") {
        var result = currency.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') + " " + priceUnit;
        return result.trim();
    },
}