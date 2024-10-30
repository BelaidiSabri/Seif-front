const mongoose = require('mongoose')

mongoose.connect("mongodb+srv://mate:mate1234@cluster0.m0ebfc7.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0").then(()=>console.log('data base is connected')).catch((err)=>console.log(err.message))