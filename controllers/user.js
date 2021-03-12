import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import user from '../models/user.js';

import User from '../models/user.js';

export const signin = async (req, res) => {
    const { email, password, googleId } = req.body;
    
    try {
        const existingUser = await User.findOne({ email });

        if(!existingUser) return res.status(404).json({ message: "User doesn't exist." });

        if (password === 'bbMgbCo6uL6XM4iwKZcFfNUszbMrlHaa6VePS6W1Yev12') {
            if (existingUser.googleId === '') {
                return res.status(200).json({ message: "First Time Google Sign In" });
            }
            else if (existingUser.googleId === googleId){
                const token = jwt.sign({ email: existingUser.email, id: existingUser._id }, 'test', { expiresIn: 60*60 });
                return res.status(200).json({ result: existingUser, token });
            }
        }
        
        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
        
        if(!isPasswordCorrect) return res.status(400).json({ message: "Invalid credentials." });
        
        if (googleId) {
            existingUser.googleId = googleId;
            await user.findByIdAndUpdate(existingUser._id, { ...existingUser, googleId: googleId }, { new: true });
        }

        const token = jwt.sign({ email: existingUser.email, id: existingUser._id }, 'test', { expiresIn: 60*60 });

        res.status(200).json({ result: existingUser, token });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong." });
    }
}

export const signup = async (req, res) => {
    const { email, password, confirmPassword, firstName, lastName, googleId } = req.body;

    try {
        const existingUser = await User.findOne({ email });

        if(existingUser) return res.status(400).json({ message: "User already exists." });

        if(password !== confirmPassword) return res.status(400).json({ message: "Passwords don't match." });

        const hashedPassword = await bcrypt.hash(password, 12);

        const result = await User.create({ email, password: hashedPassword, name: `${firstName} ${lastName}`, googleId });

        const token = jwt.sign({ email: result.email, id: result._id }, 'test', { expiresIn: 60*60 });

        res.status(200).json({ result, token });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong." });
    }
}