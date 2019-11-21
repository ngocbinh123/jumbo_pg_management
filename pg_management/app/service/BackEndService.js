const StringConst = require("../assets/StringConst");
const ErrorParser = require("./ErrorParser");

const fetchModule = require("tns-core-modules/fetch");
const config = require("./Config");
module.exports = {
    methods: {
        resetPass(userEmail) {
            return fetchModule
                .fetch(config.resetPassUrl, {
                    method: "POST",
                    headers: config.headers,
                    body: JSON.stringify({
                        email: userEmail
                    }),
                })
                .then(this.checkResponse);
        },
        login(email, pass) {
            return fetchModule
                .fetch(config.loginUrl, {
                    method: "POST",
                    headers: config.headers,
                    body: JSON.stringify({
                        Email: email,
                        Password: pass
                    }),
                })
                .then(this.checkResponse);
        },
        changepassword(oldPass, newPass, bearer) {
            var headers = config.authHeaders(bearer);
            return fetchModule
                .fetch(config.changePass, {
                    method: "POST",
                    headers: headers,
                    body: JSON.stringify({
                        old_password: oldPass,
                        new_password: newPass
                    }),
                })
                .then(this.checkResponse);
        },
        getUserInfo(bearer) {
            var headers = config.authHeaders(bearer);
            return fetchModule
                .fetch(config.userInfoUrl, {
                    method: "POST",
                    headers: headers
                })
                .then(this.checkResponse);
        },
        updateUserPhoneNumber(phoneNumber, bearer) {
            const updatedBody = {
                abiz_mobilephone: phoneNumber
            };
            const headers = config.authHeaders(bearer);
            return fetchModule
                .fetch(config.updateUserInfo, {
                    method: "POST",
                    headers: headers,
                    body: JSON.stringify(updatedBody)
                })
                .then(this.checkResponse);
        },
        updateUserBirthday(birthday, bearer) { // birthday: YYYY-MM-dd
            const updatedBody = {
                abiz_birthday: birthday
            };
            const headers = config.authHeaders(bearer);
            return fetchModule
                .fetch(config.updateUserInfo, {
                    method: "POST",
                    headers: headers,
                    body: JSON.stringify(updatedBody)
                })
                .then(this.checkResponse);
        },
        updateAddress(address, bearer) {
            const updatedBody = {
                abiz_provinceid: address.provinceId,
                abiz_districtid: address.districtId,
                abiz_ward: address.ward,
                abiz_street: address.street
            };
            const headers = config.authHeaders(bearer);
            return fetchModule
                .fetch(config.updateUserInfo, {
                    method: "POST",
                    headers: headers,
                    body: JSON.stringify(updatedBody)
                })
                .then(this.checkResponse);
        },
        getProvinces(bearer) {
            const proBody = {
                "entity_name": "abiz_location",
                "conditions": [{
                        "attribute_name": "statecode",
                        "operator": 0,
                        "value": "Active"
                    },
                    {
                        "attribute_name": "abiz_locationtypecode",
                        "operator": 0,
                        "value": "100000100"
                    }
                ]
            };
            var headers = config.authHeaders(bearer);
            return fetchModule
                .fetch(config.getProvincesUrl, {
                    method: "POST",
                    headers: headers,
                    body: JSON.stringify(proBody)
                })
                .then(this.checkResponse);
        },
        getDistricts(provinceId, bearer) {
            var districtBody = {
                "entity_name": "abiz_location",
                "conditions": [{
                        "attribute_name": "statecode",
                        "operator": 0,
                        "value": "Active"
                    },
                    {
                        "attribute_name": "abiz_locationtypecode",
                        "operator": 0,
                        "value": "100000200"
                    },
                    {
                        "attribute_name": "abiz_parentlocationid",
                        "operator": 0,
                        "value": provinceId
                    }
                ]
            };
            var headers = config.authHeaders(bearer);
            return fetchModule
                .fetch(config.getProvincesUrl, {
                    method: "POST",
                    headers: headers,
                    body: JSON.stringify(districtBody)
                })
                .then(this.checkResponse);
        },

        checkResponse(response) {
            var body = response._bodyInit;

            if (response.ok) {
                if (!body) {
                    return {
                        message: StringConst.msg_request_success
                    };
                }

                var contentJson = JSON.parse(body);
                return contentJson;
            }

            var error = ErrorParser.parseFromResponse(response);
            throw error;
        }
    }
};