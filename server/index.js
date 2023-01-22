const express= require("express")
const cors = require("cors")
const bodypParser = require("body-parser")
const dotenv=require("dotenv")
const mongoose=require("mongoose")

dotenv.config()


const {Schema}=mongoose
const userSchema= new Schema(
    {
        fullName:{type:String, required:true},
        userName:{type:String, required:true},
        age:{type:Number, required:true},
        imgUrl:{type:String,required:true}
    },
    {timestamps:true}
)


const Users = mongoose.model("users", userSchema)


const app= express()



app.use(cors())
app.use(bodypParser.json())

app.get("/",(req, res)=>{
    res.send("<h1>admin panel</h1>")
})
// get all send 
app.get("/users",(req,res)=>{
    Users.find({},(err,docs)=>{
        if(!err){
            res.send(docs)
        }
        else{
            res.status(404).json({message:err})
        }
    })
})

// get user by id

app.get("/users/:id",(req,res)=>{
    const {id}=req.params
    Users.findById(id,(err, doc)=>{
        if(!err){
            if(doc){
                res.send(doc)
            }
            else{
                res.status(404).json({message:"node found"})
            }
        }
        else{
            res.status(500).json({message:err})
        }
    })
})


//delete user

app.delete('/users/:id', (req,res)=>{
    const {id}=req.params
    Users.findByIdAndDelete(id, (err)=>{
        if(!err){
            res.send("delete")
        }
        else{
            res.status(404).json({message:err})
        }
    })
} )

//add user

app.post("/users",(req,res)=>{
    const user = new Users({
        fullName:req.body.fullName,
        userName:req.body.userName,
        age:req.body.age,
        imgUrl:req.body.imgUrl
    })
    user.save()
    res.send({message:"user created"})
})

// update user

app.put('/users/:id', (req,res)=>{
    const {id} = req.params
    Users.findByIdAndUpdate(id,req.body,(err,doc)=>{
        if(!err){
            res.status(200)
        }
        else{
            res.status(404).json({message:err})
        }
    })
    res.send({message:"updete olundu"})
})



const PORT = process.env.PORT
const url = process.env.CONNECTION_URL.replace("<password>", process.env.PASSWORD)
mongoose.set('strictQuery', true)
mongoose.connect(url,(err)=>{
    if(!err){
        console.log("DB connet");
        app.listen(PORT,()=>{
            console.log("server start");
        })
    }
})