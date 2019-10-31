const API_PREFIX = "https://ntgroupipamwebapi.azurewebsites.net/api/"
module.exports = {
    loginUrl: API_PREFIX + "login",
    headers: {
        "Content-Type": "application/json"
    }
};