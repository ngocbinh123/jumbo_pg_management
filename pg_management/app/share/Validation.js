const StringConst = require("../assets/StringConst");
module.exports = {
    validPhoneNumber(phoneNumber) {
        if (!phoneNumber) {
            return StringConst.msg_phone_number_is_blank;
        }

        if (phoneNumber.length != 10 || !phoneNumber.startsWith("0")) {
            return StringConst.msg_phone_number_not_enough;
        }

        return "";
    },
    validBirhtday(birthday) {
        const now = new Date();
        if (now.getFullYear() - birthday.getFullYear() < 18) {
            return StringConst.msg_birthday_enough_year_old;
        }

        return "";
    }
}