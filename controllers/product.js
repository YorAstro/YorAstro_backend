const Product = require('../models/product');

const productList = async (req, res) =>{
    try {
        let categoryId = req.query.categoryId;
        const ProductList = await Product.findAll({where : {category_id : categoryId}});
        res.status(200).send({data : ProductList});
    } catch (error) {
        console.log(err);
        return res.status(500).json({ error: 'Internal Server Error', details: err.message });
    }
}


module.exports = {productList};