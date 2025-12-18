require('dotenv').config()
const mongoose=require('mongoose')
mongoose.connect(process.env.MONGODB_URI)
.then(()=>{
    console.log("Connected to MongoDB")
})
.catch((err)=>{
    console.log("Error connecting to MongoDB:",err)
})
const schema=new mongoose.Schema({
    name:{
        type:String,
        required:true

        },
    password:{
        type:String,
        required:true
    },
    token:{
        type:String,
        required:true
    }
})
const collection=new mongoose.model("AuthCollection",schema)
module.exports=collection
