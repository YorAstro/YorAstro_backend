const Category = require('../models/category');

const CategoryList = async (req, res) =>{
    try {
        const CategoryList = await Category.findAll({ attributes: ['name', 'image','id','description','slug']});
        res.status(200).send({data : CategoryList});
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal Server Error', details: err.message });
    }
}


module.exports = {CategoryList};