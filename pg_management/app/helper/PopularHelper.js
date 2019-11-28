module.exports = {
    getCurrentDateStr() {
        const now = new Date();
        const currentDate = now.getDate() + "/" + (now.getMonth() + 1) + "/" + now.getFullYear();
        return currentDate;
    },
    getCurrentTimeStr() {
        const now = new Date();
        var time = now.getHours() + ":";
        const min = now.getMinutes();
        if (min > 9) {
            time += min;
        } else {
            time += "0" + min;
        }
        return time;
    },
    getCurrentDateStrForRequest() {
        const now = new Date();
        const currentDate = now.getFullYear() + "-" + (now.getMonth() + 1) + "-" + now.getDate();
        return currentDate;
    },
    formatCurrencystr(currency) {
        return currency.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') + " VND";
    }
}