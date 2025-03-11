const Product = require('../models/product');

const productList = async (req, res) =>{
    try {
        const ProductList = await Product.findAll();
        res.status(200).send({data : ProductList});
    } catch (error) {
        console.log(err);
        return res.status(500).json({ error: 'Internal Server Error', details: err.message });
    }
}


module.exports = {productList};