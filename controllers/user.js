const User = require('../models/users');

const astrologerList = async (req, res) =>{
    try {
        const astrologerList = await User.findAll({where:{role : "astrologer"},attributes: ['name', 'email', 'phone', 'gender', 'role','dateofbirth','id'] });
        res.status(200).send({data : astrologerList});
    } catch (error) {
        console.log(err);
        return res.status(500).json({ error: 'Internal Server Error', details: err.message });
    }
}


module.exports = {astrologerList};