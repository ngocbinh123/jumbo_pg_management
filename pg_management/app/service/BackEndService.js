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
            if (body == "") {
                if (!response.ok) {
                    throw Error("Đã có sự cố ngoài ý muốn.");
                }
                return {
                    message: "Thành công."
                };
            }

            var contentJson = JSON.parse(body);
            if (!response.ok) {
                var errMsg = contentJson.error_message;
                throw Error(errMsg);
            }
            return contentJson;
        }
    }
};