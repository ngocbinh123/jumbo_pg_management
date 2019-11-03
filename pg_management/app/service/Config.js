const API_PREFIX = "https://ntgroupipamwebapi.azurewebsites.net/api/"
const remember = require("../share/Remember");

module.exports = {
    loginUrl: API_PREFIX + "login",
    resetPassUrl: API_PREFIX + "login/resetpassword",
    changePass: API_PREFIX + "ntgroupuser/changepassword",
    headers: {
        "Content-Type": "application/json"
    },
    authHeaders: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + remember.getBearId()
    }
};