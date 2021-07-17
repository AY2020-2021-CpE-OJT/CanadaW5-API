const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const mongoConfig = require('./mongoConfig');
const jwt = require('jsonwebtoken');
const verifyToken = require('./routes/contacts');

//body-parser and cors
app.use(bodyParser.json());

//import routes
const contactsRoutes = require('./routes/contacts');
app.use('/contacts', contactsRoutes);

//home
app.get('/', (req,res) => {
    res.send('Welcome');
})
app.get('/Week04', (req,res) => {
    res.send('This is to prompt that I have integrated my API to Heroku and that my application is able to execute the requirements! Thanks for viewing this page :)');
})
app.get('/Week05', verifyToken,(req,res) => {
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if(err){
            res.sendStatus(403);
        }else {
            res.json({message: 'Authorized to enter', authData});
        }
    });
})

//connect to mongoDB
mongoose.connect(mongoConfig.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }).then(() => console.log(`MongoDB Connected`)).catch(err => console.log(err));

//listen to port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running at port ${PORT}`));
