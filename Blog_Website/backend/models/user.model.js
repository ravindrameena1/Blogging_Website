import mongoose , {Schema} from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const userSchema = new Schema({
    username : {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email :{
        type: String,
        required: true,
        unique: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email address"]
    },
    password : {
        type: String,
        required: [true, 'Password is required'],
        minlength: 8
    },
    // role : {
    //     type: String,
    //     enum: ['user', 'admin'],
    //     default: 'user'
    // },
    refreshToken: {
        type: String,
    }
},{timestamps:true});


// Hash the password before saving the user 
userSchema.pre('save', async function(next) { 
    // pre is a middleware function that runs before the save operation

    if(!this.isModified('password')) {
        return next(); // If the password is not modified, skip hashing
    }

    // hash the password
    this.password = await bcrypt.hash(this.password, 10,)
    next();
})

// Let's create a method to compare the password
userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password , this.password);
}

// generateAccessToken and Referesh Token 
userSchema.methods.generateAccessToken = async function(){
    return jwt.sign(
        {
            _id: this._id,
            email : this.email,
            username : this.username,
            role : this.role
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn : process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken = async function(){
    return jwt.sign(
        {
            _id: this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: `${7 * 24 * 60 * 60}s` // 7 days
        }
    )
}

export const User = mongoose.model('User', userSchema);