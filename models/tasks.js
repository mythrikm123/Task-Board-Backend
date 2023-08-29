const mongoose=require('mongoose');
const Schema=mongoose.Schema;

//Tasks Schema
const taskSchema=new mongoose.Schema({
    Title:{
        type:String,
        required:true,
    },
    Description:{
        type: String,
        required:true
    },
    DueDate:{
        type: String,
        required:true
    },
    Priority:{
        type: String,
        required:true
    }
  
})

module.exports=mongoose.model('Task',taskSchema)