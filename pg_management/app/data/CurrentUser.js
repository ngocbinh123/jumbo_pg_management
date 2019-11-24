import Remember from "../share/Remember";

export default {
    getUserInfo() {
        return {
            id: Remember.getUserId(),
            code: Remember.getUserCode(),
            gId: Remember.getUserGID(),
            idCard: Remember.getUserIDCard(),
            name: Remember.getUserName(),
            gender: Remember.getUserGender(),
            birthday: Remember.getUserBirthday(),
            phone: Remember.getUserPhone(),
            address: Remember.getUserAddess(),
            email: Remember.getUserEmail(),
            client: Remember.getUserClientCode(),
            category: Remember.getUserCategory(),
            channel: Remember.getUserChanel(),
            manager: {
                name: Remember.getUserManagerName(),
                email: Remember.getUserManagerEmail(),
                phone: Remember.getUserManagerPhone()
            },

        };
    },
    methods: {
        updatePhone(newPhone) {
            Remember.setUserPhone(newPhone);
        },
        updateAddress(newAddress) {
            Remember.setUserAddress(newAddress);
        },
        updateBirthday(newBirthday) {
            Remember.setUserBirthday(newBirthday);
        },
        getBearId() {
            return Remember.getBearId();
        },
        getUserId() {
            return Remember.getUserId();
        },
        getUserName() {
            return Remember.getUserName();
        },
        logout() {
            Remember.clearAll();
        }
    }
};