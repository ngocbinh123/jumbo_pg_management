module.exports = {
    CHECK_IN_STATE: {
        UNCHECK: -1,
        READY: 0,
        CHECKED: 1
    },
    GENDER: {
        Male: {
            text: "Nam",
            value: 1
        },
        Female: {
            text: "Nữ",
            value: 2
        }
    },
    CHECK_IN_TIME_BY_MIN: 15,
    CHECK_IN_TIME: 15 * 60 * 1000, // 15m
    TIME_CACHE_PROVINCES: 1 * 24 * 60 * 1000,
    KEY_PAGE_VIEW: "KEY_PAGE_VIEW",
    KEY_PAGE_ID: "KEY_PAGE_ID",
}