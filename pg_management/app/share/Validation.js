const StringConst = require("../assets/StringConst");
module.exports = {
    validPhoneNumber(phoneNumber) {
        if (!phoneNumber) {
            return StringConst.msg_phone_number_is_blank;
        }

        if (phoneNumber.length != 10 || !phoneNumber.startsWith("0")) {
            return StringConst.msg_phone_number_not_enough;
        }

        var re = /^\d{10}$/;
        if (!re.test(phoneNumber)) {
            return StringConst.msg_phone_no_math;
        }

        return "";
    },
    validateEmail() {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(this.user.email);
    },
    validBirhtday(birthday) {
        const now = new Date();
        if (now.getFullYear() - birthday.getFullYear() < 18) {
            return StringConst.msg_birthday_enough_year_old;
        }

        return "";
    }
}