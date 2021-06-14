const express = require("express");
const path = require("path")
const app = express();
const hbs = require("hbs")

require('./db/conn');
const Register = require("./models/register")


const port = process.env.PORT || 3000;

const static_path = path.join(__dirname, '../public');
const template_path = path.join(__dirname, '../templates/views');
const partials_path = path.join(__dirname, '../templates/partials');

app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.use(express.static(static_path));
app.set("view engine", "hbs");
app.set("views", template_path);
hbs.registerPartials(partials_path);

app.get('/', (req , res)=>{
    res.render("index")
})

app.get('/register', (req, res) =>{
    res.render("register")
})


app.get('/login', (req, res) =>{
    res.render("login")
})

// create a new user in database
app.post('/register', async(req, res) =>{
    try{
        const password = req.body.password 
        const cpassword = req.body.cnpassword

        if(password === cpassword){
            const registerEmployee = new Register({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                gender: req.body.gender,
                phone: req.body.phone,
                age: req.body.age,
                password: password,
                cnpassword: cpassword
            })

            const registered = await registerEmployee.save();
            res.status(201).render('index')
        }else{
            res.send("information not matching")
        }
    }catch(e){
        res.status(400).send(e);
    }
})


// login check

app.post('/login', async(req, res) =>{
    try{

        const email = req.body.email;
        const password = req.body.password;
        
        const userEmail = await Register.findOne({email: email});

        if(userEmail.password === password){
            res.status(200).render('index')
        }else{
            res.send('Email or Password not matching please go back and try again')
        }

    }catch(e){
        res.status(400).send('invalid email')
    }
})



app.listen(port, () => {
    console.log(`server is running at port on ${port}`)
})