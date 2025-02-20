import User from "../models/user.model.js";
import { generateTokenAndSetCookie } from "../lib/utils/generateToken.js";

import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
   try{
    const {fullName, username, email, password} = req.body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailRegex.test(email)){
        return res.status(400).json({error: "Invalid email format"});
    }

    const existingUser = await User.findOne({username});
    if(existingUser){
        return res.status(400).json({error: "Username already exists"});
    }

    const existingEmail = await User.findOne({email});
    if(existingEmail){
        return res.status(400).json({error: "Email already exists"});
    }

    //hash password
    // 12345 ---> 12345 + salt ---> 12345asdasd
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
        fullName,
        username,
        email,
        password: passwordHash,
    });

    if(newUser){
        generateTokenAndSetCookie(newUser._id, res);
        await newUser.save();
        
        res.status(201).json({
            _id: newUser._id,
            username: newUser.username,
            email: newUser.email,
            fullName: newUser.fullName,
            followers: newUser.followers,
            following: newUser.following,
            profileImg: newUser.profileImg,
            bio: newUser.bio,
            link: newUser.link,
        });  
    }
    else{
        res.status(400).json({error: "Invalid user data"});
    }

   }catch(error){
       console.error(`Error: ${error.message}`);
   }
}

export const login = async (req, res) => {
    res.json({
        data: "You hit the login endpoint"
    })
}

export const logout = async (req, res) => {
    res.json({
        data: "You hit the logout endpoint"
    })
}

