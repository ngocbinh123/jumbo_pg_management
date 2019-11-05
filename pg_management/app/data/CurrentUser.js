import Remember from "../share/Remember";

export default {
    methods: {
        getBearId() {
            return Remember.getBearId();
        },
        logout() {
            Remember.clearAll();
        }
    }
};