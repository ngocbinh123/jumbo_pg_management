module.exports = {
    isReadOnly: false,
    commitMode: "Immediate",
    validationMode: "Immediate",
    propertyAnnotations: [{
            name: "id",
            displayName: "Mã Khách Hàng",
            index: 0,
            editor: "Number",
            readOnly: true
        },
        {
            name: "name",
            displayName: "Họ Tên",
            index: 1
        },
        {
            name: "sex",
            displayName: "Giới Tính",
            index: 2,
            editor: "Picker",
            valuesProvider: ["Nam", "Nữ"]
        },
        {
            name: "phone",
            displayName: "Số Điện THoại",
            index: 3,
            editor: "Phone"
        },
        {
            name: "address",
            displayName: "Địa Chỉ",
            index: 4,
            editor: "Picker",
            valuesProvider: [
                "Hồ Chí Minh",
                "Hà Nội",
                "Bà Rịa - Vũng Tàu",
                "Đồng Nai",
                "Biên Hoà",
                "Long An",
                "Cần Thơ",
                "Tây Ninh",
                "Bình Dương",
                "Bình Phước",
                "Tiền Giang",
                "Mỹ Tho",
                "Bến Tre",
                "Khánh Hoà",
                "Đắk Lắk",
                "Khánh Hòa",
                "An Giang",
                "Kiên Giang",
                "Vĩnh Long",
                "Châu Đốc",
                "Đồng Tháp",
                "Sóc Trăng",
                "Hậu Giang",
                "Cà Mau",
                "Lâm Đồng",
                "Nha Trang",
                "Đà Nẵng",
                "Thừa Thiên Huế",
                "Ninh Thuận",
                "Bình Thuận",
                "Thái Nguyên",
                "Bình Định",
                "Thanh Hoá",
                "Quảng Ninh",
                "Nơi khác"
            ]
        }
    ]
}