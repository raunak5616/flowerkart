import mongoose, { Types } from "mongoose";

const userSchema = mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true},
    phone:{type:String,required:true},
    password:{type:String,required:true}
},

{Timestamps:true}
);

const User = mongoose.model("user",userSchema);
export default User;