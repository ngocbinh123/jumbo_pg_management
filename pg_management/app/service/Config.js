const API_PREFIX = "https://ntgroupipamwebapi.azurewebsites.net/api/"

module.exports = {
    loginUrl: API_PREFIX + "login",
    resetPassUrl: API_PREFIX + "login/resetpassword",
    changePass: API_PREFIX + "ntgroupuser/changepassword",
    userInfoUrl: API_PREFIX + "ntgroupuser/current",
    updateUserInfo: API_PREFIX + "ntgroupuser/update",
    getProvincesUrl: API_PREFIX + "masterdata/lookup",
    getProvincesUrl: API_PREFIX + "masterdata/lookup",
    getDistrictsUrl: API_PREFIX + "masterdata/lookup",
    uploadImageUrl: API_PREFIX + "masterdata/lookup",
    getSessionsUrl: API_PREFIX + "session/date",
    checkInOutUrl: API_PREFIX + "session/timeentry",
    createCustomerUrl: API_PREFIX + "order/contact",
    getCustomersUrl: API_PREFIX + "order/listcontact",
    getOrdersUrl: API_PREFIX + "order/date",
    getProductsUrl: API_PREFIX + "masterdata/product",
    submitOrdersUrl: API_PREFIX + "order/submit",


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