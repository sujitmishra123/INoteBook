const express= require('express');
const User = require('../models/User');
const router = express.Router();
const bcrypt =require('bcryptjs');
const { body, validationResult } = require('express-validator');
var jwt =require('jsonwebtoken');
var fetchuser =require('../middleware/fetchuser');

const JWT_SECRET ="sujitisagoodb$oy";

//ROUTE1: Create a user using: POST "api/auth/createuser". No login required
router.post('/createuser',[
    body('name','Enter a valid name').isLength({ min: 3 }),
    body('email','Enter a valid email').isEmail(),
    body('password','password must be atleast 5 characters').isLength({ min: 5 }),
], async (req,res)=>{
  let success=false;
  //if there are errors,return bad request and errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({success, errors: errors.array() });
    }

    //check whether the user wiyth this email exists already
    try{

    let user =await User.findOne({email:req.body.email});
    if(user){
      return res.status(400).json({success,error: "Sorry a user with this email already exists"})
    }
    const salt =await bcrypt.genSalt(10);
    const secPass=await bcrypt.hash(req.body.password,salt);

    //create a new user
     user= await User.create({
        name: req.body.name,
        password:secPass,
        email: req.body.email,
      });
      const data={
        user:{
          id:user.id
        }
      }
      const authtoken = jwt.sign(data,JWT_SECRET);
      
    //res.json(user)
    success=true;  
    res.json({success,authtoken})
    
  }catch (error){
      console.error(error.message);
      res.status(500).send("some error occured");
  }
    

})

//ROUTE2:authenticate a user using: POST "/api/auth/login" . No login required"
router.post('/login',[
  body('email','Enter a valid email').isEmail(),
  body('password','password can not be blank').exists()
], async (req,res)=>{
  let success=false;

  //if there are errors,return bad request and errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const {email,password} =req.body;
  try{
      let user= await User.findOne({email});
      if(!user){
        success=false
        return res.status(400).json({error: "pls try to login with correct credentials"});
      }

      const passwordCompare =await bcrypt.compare(password,user.password);
      if(!passwordCompare){
        success=false
        return res.status(400).json({ success,error: "pls try to login with correct credentials"});
      }
      const data={
        user:{
          id:user.id
        }
      }
      const authtoken = jwt.sign(data,JWT_SECRET); 
      success=true; 
    res.json({success,authtoken})


  }catch (error){
    console.error(error.message);
    res.status(500).send("Internal server Error");
}


  


})
//ROUTE3:Get loggedin User details: POST "/api/auth/getuser" . login required"
router.post('/getuser',fetchuser,async (req,res)=>{
try {
  userId=req.user.id;
  const user = await User.findById(userId).select("-password")
  res.send(user)
  
} catch (error) {
  console.error(error.message);
    res.status(500).send("Internal server Error");
  
}
})
module.exports= router