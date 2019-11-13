const productList = require("../objects/Product");
const productNameList = productList.getProductNameList();

module.exports = {
    isReadOnly: false,
    commitMode: "Immediate",
    validationMode: "Immediate",
    propertyAnnotations: [{
            name: "name",
            displayName: "Sản Phẩm",
            index: 0,
            editor: "Picker",
            valuesProvider: productNameList
        },
        {
            name: "number",
            displayName: "Số Lượng",
            index: 1,
            editor: "Number"
        }
    ]
}