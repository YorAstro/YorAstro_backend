const Product = require('../models/product');

const productList = async (req, res) =>{
    try {
        let categoryId = req.query.categoryId;
        if(!categoryId){
            return res.status(500).json({ error: 'CategoryId is required in query' });            
        }
        const ProductList = await Product.findAll({where : {category_id : categoryId}});
        res.status(200).send({data : ProductList});
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
}


module.exports = {productList};