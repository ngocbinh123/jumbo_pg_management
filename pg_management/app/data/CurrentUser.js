import Remember from "../share/Remember";

export default {
    methods: {
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