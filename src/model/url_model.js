const mongoose = required('mongoose')


const urlSchema = mongoose.Schema({

    urlCode: {
        type:String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    longUrl:
        { type:String,
        required: true, },
    shortUrl:
    {
        type:String,
        required: true,
        unique: true,
    }
}, { timestamp: true })


module.export=mongoose.module("url",urlSchema)