const express = require('express');
var cors = require('cors')
const connectDB= require('./db');
connectDB();

const app = express();
app.use(cors())
app.use(express.json());

app.use(express.json())
//Routes
app.use('/api/auth',require('./routes/auth'))
app.use('/api/notes',require('./routes/notes'))

app.get("/",(req, res)=>{
    res.send("hello sujit admin!");
});

const PORT =process.env.PORT || 5000;
app.listen(PORT,()=>console.log(`iNotebook backend running on port ${PORT}`));

