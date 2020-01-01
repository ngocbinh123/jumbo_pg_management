const appSettings = require("application-settings");

const KEY_USER_ID = "KEY_USER_ID";
const KEY_USER_CODE = "KEY_USER_CODE";
const KEY_USER_NAME = "KEY_USER_NAME";
const KEY_USER_EMAIL = "KEY_USER_EMAIL";
const KEY_USER_BIRTHDAY = "KEY_USER_BIRTHDAY";

const KEY_USER_ADDRESS = "KEY_USER_ADDRESS";
const KEY_USER_GENDER = "KEY_USER_GENDER";
const KEY_USER_PHONE = "KEY_USER_PHONE";
const KEY_USER_ID_CARD = "KEY_USER_ID_CARD";
const KEY_USER_CLIENT_CODE = "KEY_USER_CLIENT_CODE";
const KEY_USER_CATEGORY = "KEY_USER_CATEGORY";

const KEY_USER_GID = "KEY_USER_GID";
const KEY_USER_CHANNEL = "KEY_USER_CHANNEL";

const KEY_USER_MANAGER_NAME = "KEY_USER_MANAGER_NAME";
const KEY_USER_MANAGER_PHONE = "KEY_USER_MANAGER_PHONE";
const KEY_USER_MANAGER_EMAIL = "KEY_USER_MANAGER_EMAIL";


const KEY_FORCE_CHANGE_PASS = "KEY_FORCE_CHANGE_PASS";
const KEY_BEAR_ID = "KEY_BEAR_ID";

const KEY_LAST_TIME_OF_UPDATED_PROVINCE = "KEY_LAST_TIME_OF_UPDATED_PROVINCE";

const KEY_LAST_DATE_GET_REMOTE_CUSTOMERS = "KEY_LAST_DATE_GET_REMOTE_CUSTOMERS";

const KEY_LAST_DATE_GET_REMOTE_ORDER = "KEY_LAST_DATE_GET_REMOTE_ORDER";

const KEY_REMOTE_ORDER_LIST = "KEY_REMOTE_ORDER_LIST";

const KEY_REMOTE_CUSTOMER_LIST = "KEY_REMOTE_CUSTOMER_LIST";

const KEY_IS_ANDROID_DEVICE = "KEY_IS_ANDROID_DEVICE";



module.exports = {
    isAndroidDevice() {
        return appSettings.getBoolean(KEY_IS_ANDROID_DEVICE, true);
    },
    setIsAndroidDevice(isAndroid) {
        return appSettings.setBoolean(KEY_IS_ANDROID_DEVICE, isAndroid);
    },
    getUserId() {
        return appSettings.getString(KEY_USER_ID, "");
    },
    setUserId(userId) {
        appSettings.setString(KEY_USER_ID, userId);
    },
    getUserCode() {
        return appSettings.getString(KEY_USER_CODE, "");
    },
    setUserCode(code) {
        appSettings.setString(KEY_USER_CODE, code);
    },
    getUserName() {
        return appSettings.getString(KEY_USER_NAME, "");
    },
    setUserName(name) {
        appSettings.setString(KEY_USER_NAME, name);
    },
    getUserEmail() {
        return appSettings.getString(KEY_USER_EMAIL, "");
    },
    setUserEmail(email) {
        appSettings.setString(KEY_USER_EMAIL, email);
    },

    getUserBirthday() {
        return appSettings.getString(KEY_USER_BIRTHDAY, "");
    },
    setUserBirthday(birthday) {
        appSettings.setString(KEY_USER_BIRTHDAY, birthday);
    },

    getUserGender() {
        return appSettings.getString(KEY_USER_GENDER, "");
    },
    setUserGender(gender) {
        appSettings.setString(KEY_USER_GENDER, gender);
    },

    getUserAddess() {
        return appSettings.getString(KEY_USER_ADDRESS, "");
    },
    setUserAddress(address) {
        appSettings.setString(KEY_USER_ADDRESS, address);
    },

    getUserPhone() {
        return appSettings.getString(KEY_USER_PHONE, "");
    },
    setUserPhone(phone) {
        appSettings.setString(KEY_USER_PHONE, phone);
    },

    getUserIDCard() {
        return appSettings.getString(KEY_USER_ID_CARD, "");
    },
    setUserIDCard(idCard) {
        appSettings.setString(KEY_USER_ID_CARD, idCard);
    },

    getUserGID() {
        return appSettings.getString(KEY_USER_GID, "");
    },
    setUserGID(gid) {
        appSettings.setString(KEY_USER_GID, gid);
    },

    getUserCategory() {
        return appSettings.getString(KEY_USER_CATEGORY, "");
    },
    setUserCateogry(category) {
        appSettings.setString(KEY_USER_CATEGORY, category);
    },

    getUserChanel() {
        return appSettings.getString(KEY_USER_CHANNEL, "");
    },
    setUserChanel(chanel) {
        appSettings.setString(KEY_USER_CHANNEL, chanel);
    },

    getUserClientCode() {
        return appSettings.getString(KEY_USER_CLIENT_CODE, "");
    },
    setUserClientCode(code) {
        appSettings.setString(KEY_USER_CLIENT_CODE, code);
    },

    getUserManagerName() {
        return appSettings.getString(KEY_USER_MANAGER_NAME, "");
    },
    setUserManagerName(name) {
        appSettings.setString(KEY_USER_MANAGER_NAME, name);
    },

    getUserManagerEmail() {
        return appSettings.getString(KEY_USER_MANAGER_EMAIL, "");
    },
    setUserManagerEmail(email) {
        appSettings.setString(KEY_USER_MANAGER_EMAIL, email);
    },
    getUserManagerPhone() {
        return appSettings.getString(KEY_USER_MANAGER_PHONE, "");
    },
    setUserManagerPhone(phone) {
        appSettings.setString(KEY_USER_MANAGER_PHONE, phone);
    },


    getBearId() {
        return appSettings.getString(KEY_BEAR_ID, "");
    },
    setBearId(bearId) {
        appSettings.setString(KEY_BEAR_ID, bearId);
    },
    getFroceChangePass() {
        return appSettings.getBoolean(KEY_FORCE_CHANGE_PASS, false);
    },
    setFroceChangePass(isForce) {
        appSettings.setBoolean(KEY_FORCE_CHANGE_PASS, isForce);
    },
    getLastTimeUpadteProvinces() {
        return appSettings.getNumber(KEY_LAST_TIME_OF_UPDATED_PROVINCE, "");
    },
    setLastTimeUpadteProvinces(time) {
        appSettings.setNumber(KEY_LAST_TIME_OF_UPDATED_, time);
    },
    getLastDateGetRemoteCustomers() {
        return appSettings.getString(KEY_LAST_DATE_GET_REMOTE_CUSTOMERS, "");
    },

    setLastDateGetRemoteCustomers(time) {
        appSettings.setString(KEY_LAST_DATE_GET_REMOTE_CUSTOMERS, time);
    },
    getLastDateGetRemoteOrders() {
        return appSettings.getString(KEY_LAST_DATE_GET_REMOTE_ORDER, "");
    },

    setLastDateGetRemoteOrders(time) {
        appSettings.setString(KEY_LAST_DATE_GET_REMOTE_ORDER, time);
    },

    getRemoteOrders() {
        const jsonStr = appSettings.getString(KEY_REMOTE_ORDER_LIST, "");
        if (!jsonStr) {
            return {
                records: []
            };
        }

        return JSON.parse(jsonStr);
    },

    setRemoteOrders(json) {
        const jsonStr = JSON.stringify(json);
        appSettings.setString(KEY_REMOTE_ORDER_LIST, jsonStr);
    },
    getRemoteCustomers() {
        const jsonStr = appSettings.getString(KEY_REMOTE_CUSTOMER_LIST, "");
        if (!jsonStr) {
            return {
                records: []
            };
        }

        return JSON.parse(jsonStr);
    },

    setRemoteCustomers(json) {
        const jsonStr = JSON.stringify(json);
        appSettings.setString(KEY_REMOTE_CUSTOMER_LIST, jsonStr);
    },
    clearAll() {
        appSettings.clear();
    }
}