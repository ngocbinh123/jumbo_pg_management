const fetchModule = require("tns-core-modules/fetch");
const config = require("./Config");
module.exports = {
    methods: {
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
        checkResponse(response) {
            var contentJson = JSON.parse(response._bodyInit);
            if (!response.ok) {
                var errMsg = contentJson.error_message;
                throw Error(errMsg)
            }
            return contentJson;
        }
    }
};