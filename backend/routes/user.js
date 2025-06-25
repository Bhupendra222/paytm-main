const express = require('express');
const { string } = require('zod');
const JWT_SECRET = require('../config');
const jwt = require("jwtwebtoken")
const zod = express('zod')
const router = express.router();

const signupSchema = zod.object({
      username:zod.string(),
      password:zod.string(),
      firstname:zod.string(),
      lastname:zod.string()

})
 
router.post("signup",async(res,req)=>{
      const body = req.body;

      const {success} = signupSchema.safeParse(req.body);

      if(!success){
        return res.json({
            message:"Email already taken / Incorrect inputs"
        })
      }

      const user = User.findOne({
        username: body.username
      })

      if(user._id){
        return res.json({
            message:"Email already taken / Incorrect inputs"
        })
      }

      const dbUser = await user.create(body)


      const token = jwt.sign({
        userId: dbUser._id
      },JWT_SECRET)
      res.json({
        message: "user created succesfully",
        token: token
      })
})


router.post("/signin", async (req, res) => {
    const body = req.body;

    const { success } = signinSchema.safeParse(body);
    if (!success) {
        return res.status(400).json({ message: "Invalid username or password format" });
    }


    const user = await User.findOne({ username: body.username });
    if (!user) {
        return res.status(401).json({ message: "User not found" });
    }

    
    const isPasswordCorrect = await bcrypt.compare(body.password, user.password);
    if (!isPasswordCorrect) {
        return res.status(401).json({ message: "Incorrect password" });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET);

    res.json({
        message: "Sign in successful",
        token: token
    });
});

module.exports = router;


module.export = router