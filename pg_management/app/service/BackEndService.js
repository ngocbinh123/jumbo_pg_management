const StringConst = require("../assets/StringConst");
const ErrorParser = require("./ErrorParser");

const fetchModule = require("tns-core-modules/fetch");
const config = require("./Config");
module.exports = {
    methods: {
        upLoadImage(bearer, file) {
            var bearer = "Bearer " + bearId;

            var name = file.substr(file.lastIndexOf("/") + 1);
            var bghttp = require("nativescript-background-http");
            var session = bghttp.session("image-upload");
            var request = {
                url: config.uploadImageUrl,
                method: "POST",
                headers: {
                    "Content-Type": "application/octet-stream",
                    "Authorization": bearer
                },
                description: "Uploading " + name
            };

            var task = session.uploadFile(file, request);
            return task;
        },
        getProducts(dateStr, timeStr, bearer) {
            const requestBody = {
                "abiz_sessiondate": dateStr,
                "abiz_sessiontime": timeStr
            };
            const headers = config.authHeaders(bearer);
            return fetchModule
                .fetch(config.getProductsUrl, {
                    method: "POST",
                    headers: headers,
                    body: JSON.stringify(requestBody)
                })
                .then(this.checkResponse);
        },
        submitOrder(order, bearer) {
            var products = [];

            order.products.forEach(item => {
                const productJson = {
                    "abiz_productid": item.id,
                    "abiz_quantity": item.number
                };
                products.push(productJson);
            });

            const requestBody = {
                "abiz_sessiondate": order.requestDate,
                "abiz_sessiontime": order.time,
                "abiz_contactid": order.customer.contactId,
                "abiz_products": products
            };

            const headers = config.authHeaders(bearer);
            return fetchModule
                .fetch(config.submitOrdersUrl, {
                    method: "POST",
                    headers: headers,
                    body: JSON.stringify(requestBody)
                })
                .then(this.checkResponse);
        },
        createNewCustomer(customer, bearer) {
            const requestBody = {
                "abiz_fullname": customer.name,
                "abiz_gender": customer.sex == "Nam" ? "False" : "True",
                "abiz_mobilephone": customer.phone,
                "abiz_provinceid": customer.provinceId
            };

            const headers = config.authHeaders(bearer);
            return fetchModule
                .fetch(config.createCustomerUrl, {
                    method: "POST",
                    headers: headers,
                    body: JSON.stringify(requestBody)
                })
                .then(this.checkResponse);
        },
        getCustomers(dateStr, bearer) {
            const requestBody = {
                abiz_sessiondate: dateStr
            };
            const headers = config.authHeaders(bearer);
            return fetchModule
                .fetch(config.getCustomersUrl, {
                    method: "POST",
                    headers: headers,
                    body: JSON.stringify(requestBody)
                })
                .then(this.checkResponse);
        },
        getOrders(dateStr, bearer) {
            const requestBody = {
                abiz_sessiondate: dateStr
            };
            const headers = config.authHeaders(bearer);
            return fetchModule
                .fetch(config.getOrdersUrl, {
                    method: "POST",
                    headers: headers,
                    body: JSON.stringify(requestBody)
                })
                .then(this.checkResponse);
        },
        getSessions(dateStr, bearer) {
            const requestBody = {
                abiz_sessiondate: dateStr
            };
            const headers = config.authHeaders(bearer);
            return fetchModule
                .fetch(config.getSessionsUrl, {
                    method: "POST",
                    headers: headers,
                    body: JSON.stringify(requestBody)
                })
                .then(this.checkResponse);
        },
        checkInOut(data, bearer) {
            const requestBody = {
                "abiz_sessiondate": data.date,
                "abiz_sessiontime": data.time,
                "abiz_latitude": data.latitude,
                "abiz_longitude": data.longitude
            };
            const headers = config.authHeaders(bearer);
            return fetchModule
                .fetch(config.checkInOutUrl, {
                    method: "POST",
                    headers: headers,
                    body: JSON.stringify(requestBody)
                })
                .then(this.checkResponse);
        },
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