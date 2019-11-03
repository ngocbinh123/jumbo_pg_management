const appSettings = require("application-settings");

const KEY_FORCE_CHANGE_PASS = "KEY_FORCE_CHANGE_PASS";
const KEY_BEAR_ID = "KEY_BEAR_ID";

module.exports = {
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
    }
}