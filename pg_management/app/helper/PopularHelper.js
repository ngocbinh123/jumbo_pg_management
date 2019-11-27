module.exports = {
    getCurrentDateStr() {
        const now = new Date();
        const currentDate = now.getDate() + "/" + (now.getMonth() + 1) + "/" + now.getFullYear();
        return currentDate;
    },
    formatCurrencystr(currency) {
        return currency.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') + " VND";
    }
}