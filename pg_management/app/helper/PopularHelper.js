const fecha = require('fecha');
const LOCAL_DATE_FORMAT = "DD/MM/YYYY";
const REMOTE_DATE_FORMAT = "YYYY-MM-DD";

module.exports = {
    getCurrentDateStr() {
        const currentDate = fecha.default.format(new Date(), LOCAL_DATE_FORMAT);
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
        const currentDate = fecha.default.format(new Date(), REMOTE_DATE_FORMAT);
        return currentDate;
    },
    formatToLocalDate(date) {
        return fecha.default.format(date, LOCAL_DATE_FORMAT);
    },
    formatCurrencystr(currency, priceUnit = "VND") {
        var result = currency.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') + " " + priceUnit;
        return result.trim();
    },
    isToday(dateStr) {
        const todayStr = this.getCurrentDateStr();
        return dateStr == todayStr;
    },
    equalsIgnoreCase(firstText, secondText) {
        if (firstText == undefined || secondText == undefined) {
            return false;
        }
        return firstText.toLowerCase() == secondText.toLowerCase();
    },
    getFullCustomerAddress(customer) {
        var addressArr = [];
        if (!!customer.abiz_street) {
            addressArr.push(customer.abiz_street);
        }

        if (!!customer.abiz_ward) {
            addressArr.push(customer.abiz_ward);
        }

        if (!!customer.abiz_districtid.text) {
            addressArr.push(customer.abiz_districtid.text);
        }

        if (!!customer.abiz_provinceid.text) {
            addressArr.push(customer.abiz_provinceid.text);
        }

        return this.joinString(addressArr);
    },
    joinString(strArr) {
        var result = "";
        for (let index = 0; index < strArr.length; index++) {
            const el = strArr[index];
            result += el;
            if (index + 1 < strArr.length) {
                result += ", "
            }
        }

        return result.trim();
    }
}