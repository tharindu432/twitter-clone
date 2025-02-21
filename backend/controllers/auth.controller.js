import User from "../models/user.model.js";
import { generateTokenAndSetCookie } from "../lib/utils/generateToken.js";

import bcrypt from "bcryptjs";

// @desc    Register a new user
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

    if(password.length < 6){
        return res.status(400).json({error: "Password must be at least 6 characters long"});
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

// @desc    Login a user
export const login = async (req, res) => {
    try{
    const {username, password} = req.body;
    const user = await User.findOne({username});
    const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");

    if(!user || !isPasswordCorrect){
        return res.status(400).json({error: "Incorrect username or password"});
    }

    generateTokenAndSetCookie(user._id, res);

    res.status(200).json({ 
        _id: user._id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        followers: user.followers,
        following: user.following,
        profileImg: user.profileImg,
        bio: user.bio,
        link: user.link,
    });
}catch(error){
    console.error(`Error: ${error.message}`);
    res.status(500).json({error: "Internal Server error"});
}
}

// @desc    Logout a user
export const logout = async (req, res) => {
   try{
    res.clearCookie("token");
    res.status(200).json({message: "Logged out successfully"});
   }catch(error){
       console.error(`Error: ${error.message}`);
       res.status(500).json({error: "Internal Server error"});
   }
}

