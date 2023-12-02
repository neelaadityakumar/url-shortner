const express =require("express")
const urlRoute =require("./routes/url")
const { connectToMongoDB } = require("./connect")
const URL = require("./models/url")
const app = express()
const port= 8001
connectToMongoDB("mongodb://localhost:27017/short-url").then(
  ()=>  {
    console.log("connected to mongodb")
}
)

app.use(express.json())
app.use("/url",urlRoute)

app.get('/:shortId', async (req,res) => {
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate({                //this part wouldn't be present for sure
        shortId
    }, 
        {
        $push:  {
                visitHistory:{ timestamp: Date.now(),},
                },
        }
    );
    res.redirect(entry.redirectURL);
});


app.listen(port,()=>{
    console.log(`Server is listening on ${port}`)
})