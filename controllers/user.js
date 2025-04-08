const User = require('../models/users');
const address = require('../models/address');
const { v4: uuidv4 } = require('uuid');

const astrologerList = async (req, res) =>{
    try {
        const astrologerList = await User.findAll({where:{role : "astrologer"},attributes: ['name', 'email', 'phone', 'gender', 'role','dateofbirth','id'] });
        res.status(200).send({data : astrologerList});
    } catch (error) {
        console.log(err);
        return res.status(500).json({ error: 'Internal Server Error', details: err.message });
    }
}

const addressSave = async (req, res) =>{
    try {
        let userId = req.user.id;
        let datatosave = req.body;
        console.log(req.body);
        datatosave.userId = userId;
        datatosave.id = uuidv4();
        const addressToSave = await address.create(datatosave);
        res.status(200).send({message : "Address Save Success",addressId : datatosave.id});
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal Server Error', details: err.message });
    }
}

const addressList = async (req, res) =>{
    try {
        let userId = req.user.id;
        const addressToSave = await address.findAll({where:{userId : userId}});
        res.status(200).send({data : addressToSave});
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal Server Error', details: err.message });
    }
}


module.exports = {astrologerList,addressSave,addressList};