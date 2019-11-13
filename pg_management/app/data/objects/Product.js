const TYPES = ["TYPE-1", "TYPE-2"];
module.exports = {
    getProductNameList() {
        const result = ["Chọn Sản Phẩm"];
        const ls = this.getProductList();
        ls.forEach(item => {
            result.push(item.name);
        });
        return result;
    },
    getProductList() {
        const ls = [];
        for (let index = 101; index < 121; index++) {
            const newProduct = this.createProduct(index);
            ls.push(newProduct);
        }
        return ls;
    },
    createProduct(index) {
        return {
            id: index * 10,
            model: "MOD-2019-" + index,
            type: TYPES[index % 2],
            name: "Sản Phẩm " + index,
            total: 100,
            price: 140000
        };
    }
}