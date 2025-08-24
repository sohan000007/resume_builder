const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;
const mongoose = require('mongoose');
const allowCrossDomain = (req, res, next) => {
    res.header(`Access-Control-Allow-Origin`, `*`);
    res.header(`Access-Control-Allow-Methods`, `GET,PUT,POST,DELETE`);
    res.header(`Access-Control-Allow-Headers`, `Content-Type`);
    next();
  };
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(allowCrossDomain);

  app.use(express.static(path.join(__dirname, './public')));
  app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, './public/register.html'));
});
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, './public/login.html'));
});

; (() => {

    const connect = mongoose.connect("mongodb+srv://sohanmahata1:sohan2003@cluster0.v5aalov.mongodb.net/", { useNewUrlParser: true, useUnifiedTopology: true });

    connect.then(() => {
        console.log("Database Connected Successfully");
    })
        .catch(() => {
            console.log("Database cannot be Connected");
        })

})()



const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

const User = new mongoose.model("users", UserSchema);



app.get('/',async(req,res)=>{
    res.redirect('http://127.0.0.1:5500/resume_frontend/');

})

app.use(express.static('public'));



app.post('/api/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log(username);
       
            const newUser = new User({ username, password });
            await newUser.save();
            res.send('User created')

        
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/api/login', async (req, res) => {
    
    try {
        const { username, password } = req.body;
        const existingUser = await User.findOne({ username });

        if (existingUser) {
            if (existingUser.password === password) {

                res.json({
                    success:true,
                    existingUser,
                    message:"Login done"
                })
            } else {
                res.json({
                    success:false,
                    message:"wrong password"
                })

            }
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
});


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});