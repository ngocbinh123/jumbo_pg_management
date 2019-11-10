const API_PREFIX = "https://ntgroupipamwebapi.azurewebsites.net/api/"

module.exports = {
    loginUrl: API_PREFIX + "login",
    resetPassUrl: API_PREFIX + "login/resetpassword",
    changePass: API_PREFIX + "ntgroupuser/changepassword",
    headers: {
        "Content-Type": "application/json"
    },
    authHeaders(bearId) {
        var bearer = "Bearer " + bearId
        return {
            "Content-Type": "application/json",
            "Authorization": bearer
        }
    }
};