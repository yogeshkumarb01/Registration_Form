const express = require("express")
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");

const app = express();
dotenv.config();
  
const port = process.env.PORT || 3005;

const uname = process.env.MONGODB_USERNAME;
const pass = process.env.MONGODB_PASSWORD;
mongoose.connect(`mongodb+srv://${uname}:${pass}@cluster0.fxhxzan.mongodb.net/RegistrationDB`,{
useNewUrlParser : true,
useUnifiedTopology : true,

});

// create schema(registration)
const registrationSchema =  new mongoose.Schema({
  name : String,
  email : String,
  password : String,
})

// model
const Registration = mongoose.model("register", registrationSchema);

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

app.get("/",(req,res)=>{
  res.sendFile(__dirname + "/pages/index.html");
})
// AWAIT-ASYNC
app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    console.log("Checking for existing user...");
    const existingUser = await Registration.findOne({ email: email });

    if (!existingUser) {
      console.log("User not found. Registering...");
      const registerData = new Registration({
        name,
        email,
        password,
      });

      await registerData.save();
      console.log("Registration successful. Redirecting to /success");
      res.redirect("/success");
    } else {
      console.log("User exists. Redirecting to /Error");
      
      res.redirect("/Error");
    }
  } catch (error) {
    console.log("Error:", error);
    
    res.redirect("/Error");
  }
});


// HANDLE GET REQUEST
app.get("/success",(req,res)=> {
  res.sendFile(__dirname + "/pages/success.html")
})

app.get("/Error",(req,res)=> {
  res.sendFile(__dirname + "/pages/Error.html")
})
app.listen(port, ()=>{
  console.log(`server running ${port}`);
})

