const fetchModule = require("tns-core-modules/fetch")
const API_PREFIX = "https://ntgroupipamwebapi.azurewebsites.net/api/"
const API_LOGIN = API_PREFIX + "login"

module.exports = {
    loginUrl: API_PREFIX + "login",
    headers: {
        "Content-Type": "application/json"
    }
};