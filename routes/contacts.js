const express = require('express');
const router = express.Router();
const Contact = require('../models/contact');
const jwt = require('jsonwebtoken');

//CRUD
//Get all
router.get('/', verifyToken, async (req, res) => {
    const contacts = await Contact.find();
    jwt.verify(req.token, 'SecretGuestKey', (err, authData) => {
        if(err){
            res.sendStatus(403);
        }else {
            res.json(contacts);
        }
    });
});
//Get specific
router.get('/find/:id', verifyToken ,async (req, res) => {
    const c = await Contact.findById({_id: req.params.id});
    jwt.verify(req.token, 'SecretGuestKey', (err, authData) => {
        if(err){
            res.sendStatus(403);
        }else {
            res.json(c);
        }
    });
});
//POST a Contact
router.post('/', verifyToken, async (req, res) => {
    const newContact = new Contact({
        last_name: req.body.last_name,
        first_name: req.body.first_name,
        phone_numbers: req.body.phone_numbers
    })
    const savedContact = await newContact.save();
    jwt.verify(req.token, 'SecretGuestKey', (err, authData) => {
        if(err){
            res.sendStatus(403);
        }else {
            try{
                res.json(savedContact);
            }catch(err){
                res.json({message: err});
            }
        }
    });
});
//Delete a Contact
router.delete('/delete/:id', verifyToken, async (req, res) =>{
   const deleteContact = await Contact.findByIdAndDelete({_id: req.params.id});
   jwt.verify(req.token, 'SecretGuestKey', (err, authData) => {
        if(err){
           res.sendStatus(403);
         }else {
           res.json(deleteContact); 
    }
    });
});
//Update a Contact
router.patch('/update/:id', verifyToken, async (req, res) => {
    const patchContact = await Contact.updateOne({_id: req.params.id}, {$set: req.body});
    jwt.verify(req.token, 'SecretGuestKey', (err, authData) => {
        if(err){
            res.sendStatus(403);
        }else {
            //res.json({message: 'Authorized to enter', authData});
            res.json(patchContact);
        }
    });
});

// new
router.get('/Week05test', verifyToken,(req,res) => {
    jwt.verify(req.token, 'SecretGuestKey', (err, authData) => {
        if(err){
            res.sendStatus(403);
        }else {
            res.json({message: 'Authorized to enter', authData});
        }
    });
})

router.post('/api/guest', (req, res) => {
    //Guest Exclusive Guest User
    const guestUser = {
        id: 1,
        username : 'guest',
        email: 'guest@gmail.com'
    }
   jwt.sign({user: guestUser}, 'SecretGuestKey', (err, token) =>{
        res.json({
            token: token
        });
    });
});

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