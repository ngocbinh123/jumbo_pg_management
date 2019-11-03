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
        changepassword(oldPass, newPass) {
            return fetchModule
                .fetch(config.changePass, {
                    method: "POST",
                    headers: config.authHeaders,
                    body: JSON.stringify({
                        old_password: oldPass,
                        new_password: newPass
                    }),
                })
                .then(this.checkResponse);
        },
        checkResponse(response) {
            if (response.status == 401) {
                return Error("Đã có sự cố ngoài ý muốn.")
            }
            var contentJson = JSON.parse(response._bodyInit);
            if (!response.ok) {
                var errMsg = contentJson.error_message;
                throw Error(errMsg)
            }
            return contentJson;
        }
    }
};