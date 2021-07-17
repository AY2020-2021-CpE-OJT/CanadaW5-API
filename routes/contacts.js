const express = require('express');
const router = express.Router();
const Contact = require('../models/contact');
const jwt = require('jsonwebtoken');

//CRUD
//Get all
router.get('/', async (req, res) => {
    const contacts = await Contact.find();
    res.json(contacts);
});
//Get specific
router.get('/find/:id', async (req, res) => {
    const c = await Contact.findById({_id: req.params.id});
    res.json(c);
});
//POST a Contact
router.post('/', async (req, res) => {
    const newContact = new Contact({
        last_name: req.body.last_name,
        first_name: req.body.first_name,
        phone_numbers: req.body.phone_numbers
    })
    try{
        const savedContact = await newContact.save();
        res.json(savedContact);
    }catch(err){
        res.json({message: err});
    }
});
//Delete a Contact
router.delete('/delete/:id', async (req, res) =>{
   const deleteContact = await Contact.findByIdAndDelete({_id: req.params.id});
   res.json(deleteContact); 
});
//Update a Contact
router.patch('/update/:id', async (req, res) => {
    const patchContact = await Contact.updateOne({_id: req.params.id}, {$set: req.body});
    res.json(patchContact);
});

// Authentication and Authorization
// FORMAT OF TOKEN
// AUTHORIZATION: Bearer <access_token>

//Verify Token
function verifyToken(req, res, next) {
    // Get auth header value
    const bearerHeader = req.headers['authorization'];
    // Check if bearer is undefined
    if(typeof bearerHeader !== 'undefined'){
        // Split at the space
        const bearer = bearerHeader.split(' ');
        // Get token from array
        const bearerToken = bearer[1];
        // Set the token
        req.token = bearerToken;
        // Call next middleware
        next();
    }else {
        //Forbidden
        res.sendStatus(403);
    }
}

module.exports = router;
