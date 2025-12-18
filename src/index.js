const express=require("express")
const Collection=require("./mongo")
const app=express()
const path=require("path")
const jwt=require("jsonwebtoken")
const cookieParser=require("cookie-parser")
const bcryptjs=require("bcryptjs")
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({extended:false}))

const templatePath=path.join(__dirname,"..","tempelates")
const publicPath=path.join(__dirname,"..","public")

app.set('view engine','hbs')
app.set("views",templatePath)
app.use(express.static(publicPath))

async function hashPass(password)
{
    const hashedPassword = await bcryptjs.hash(password, 10);
    return hashedPassword
}

async function compare(userPass,hashPass)
{
    const res = await bcryptjs.compare(userPass, hashPass);
    return res
}
    app.get("/",(req,res)=>{
res.render("login")
})

app.get("/signup",(req,res)=>{
res.render("signup")
})
app.post("/signup",async(req,res)=>{
    try{
        const check=await Collection.findOne({name:req.body.name})
        if(check){
            return res.status(400).send("User already exists")
        }
        else{
            const token=jwt.sign({name:req.body.name}, "your-secret-key")

            const data={
                name:req.body.name,
                password:await hashPass(req.body.password),
                token:token
            }
            await Collection.create(data)
            res.render("login")
        }
    }
    catch(err){
        console.log("Error in signup:", err)
        res.send("Error in signup")
    }
})

app.post("/login", async (req, res) => {
    try {
        const user = await Collection.findOne({ name: req.body.name });
        if (!user) {
            return res.status(400).send("User not found");
        }
        const isPasswordValid = await bcryptjs.compare(req.body.password, user.password);
        if (!isPasswordValid) {
            return res.status(400).send("Invalid password");
        }
        res.cookie("token", user.token, { httpOnly: true });
        res.render("home", { name: user.name });
    } catch {
        res.send("Error in login");
    }
});

const PORT = process.env.PORT || 3000
app.listen(PORT,()=>{
    console.log(`Server listening on port ${PORT}`)
})
