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