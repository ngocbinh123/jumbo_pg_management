const StringConst = require("../assets/StringConst");

module.exports = {
    parseFromResponse(response) {
        if (response.ok) return null;

        var body = response._bodyInit;
        var message = StringConst.msg_error_unexpected;
        if (!!body) {
            var contentJson = JSON.parse(body);
            if (contentJson.hasOwnProperty("error_message")) {
                message = contentJson.error_message;
            } else if (contentJson.hasOwnProperty("message")) {
                message = contentJson.message;
            } else if (contentJson.hasOwnProperty("Message")) {
                message = contentJson.Message;
            }
        } else {
            switch (message.status) {
                case 500:
                    message = StringConst.msg_500_error;
                    break;
                case 401:
                    message = StringConst.msg_401_error;
                    break;
                case 400:
                    message = StringConst.msg_400_error;
                    break;
            }
        }
        return Error(message);
    }
}