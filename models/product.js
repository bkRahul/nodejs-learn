const products = [];

class Product {

    constructor(title) {
        console.log("this constructor=>>>", this)
        this.title = title;
    }

    saveProduct() {
        products.push(this);
    }

    static fetchAllProduct() {
        return products;
    }
}

module.exports = Product;