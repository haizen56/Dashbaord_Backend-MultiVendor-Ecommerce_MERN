const express =require('express')
const app =express();
const cors =require('cors');

const {dbConnect} = require('./utilis/db');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
require('dotenv').config()



app.use(cors({
    origin:["http://localhost:3000"],
    credentials:true
}))


app.use(bodyParser.json())
app.use(cookieParser())

app.use('/api',require('./routes/authRoutes'));
app.use('/api',require('./routes/dashboard/categoryRoutes'));
app.use('/api',require('./routes/dashboard/productRoutes'));
app.get('/',(req,res)=>{
    res.send('Hello World');
});

const port = process.env.PORT;
dbConnect()


app.listen(port,()=>{
    console.log(`Server is running on port ${port}!`);
});