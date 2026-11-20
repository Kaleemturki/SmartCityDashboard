const User=require("../models/User");
const bcrypt=require("bcryptjs");

const registerUser=async(req,res)=>{
    try{
        const {
            name,
            email,
            mobile,
            password
        }=req.body;


        if(!name || !email || !mobile || !password){
            return res.status(400).json({
                message:"All Fields Are required"
            });
        }

        const exitingUser= await User.findOne({
            email:email.toLowerCase()
        });

        if(exitingUser){
            return res.status(400).json({
                message:"Email Already registered"
            });
        }

        // Hash password

        const hashedPassword = await bcrypt.hash(
            password,
            10
        );

          // Create user

        const user = await User.create({

            name: name,

            email: email.toLowerCase(),

            mobile: mobile,

            password: hashedPassword

        });


        // Send response

        res.status(201).json({

            message: "User registered successfully",

            user: {

                id: user._id,

                name: user.name,

                email: user.email,

                mobile: user.mobile

            }

        });
    }
    catch(error){
        console.error("Register Error:",error.message)

        res.status(500).json({
            message:"Server Error"
        });

    }

};

module.exports={registerUser};