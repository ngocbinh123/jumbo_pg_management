const appSettings = require("application-settings");

const KEY_USER_ID = "KEY_USER_ID";
const KEY_USER_NAME = "KEY_USER_NAME";
const KEY_USER_EMAIL = "KEY_USER_EMAIL";
const KEY_FORCE_CHANGE_PASS = "KEY_FORCE_CHANGE_PASS";
const KEY_BEAR_ID = "KEY_BEAR_ID";

module.exports = {
    getUserId() {
        return appSettings.getString(KEY_USER_ID, "");
    },
    setUserId(userId) {
        appSettings.setString(KEY_USER_ID, userId);
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
    clearAll() {
        appSettings.clear();
    }
}