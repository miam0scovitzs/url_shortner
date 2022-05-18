
const mongoose = require ("mongoose")
const validUrl = require ("valid-url")
const shortid= require ("shortid")

const urlModel = require ("../model/urlModel")


const createUrl = async function (req, res) {

    const baseUrl = "http://localhost:3000"

    //checking the baseUrl if it is valid or not using "validUrl.isUri" method
    if(!validUrl.isUri(baseUrl)){
        return res.status(400).send ({ status: false, msg:"Invalid baseUrl"})
    }
     
    //checking the longUrl if it is valid or not using "validUrl.isUri" method
    const data = req.body
     data.urlCode = shortid.generate()
    if(validUrl.isUri(data.longUrl)){

       try{
            let url = await urlModel.findOne({longUrl:data.longUrl})
        
            if (url){
            res.send(url)
        }
        else{
             data.shortUrl = baseUrl + '/' +data.urlCode  // join the generated urlCode and the baseUrl
             
         let url = await urlModel.create(data)
            res.status(201).send({msg: url})
        }
    }
    catch(err){
        res.status(500).send({ status:false, msg:err.message});

    }

}else{
    res.status(400).send({status:false , msg:"Invalid longUrl"})
}
}

const getUrl = async(req,res)=>{
   try{
        let {urlCode} =req.params // destructuring 
    let fetchUrl =await urlModel.findOne({urlCode})
   // console.log(fetchUrl)
    if(!fetchUrl) {
        return res.status(404).send({msg:"urlCode isn't found"})
    }
    else return res.redirect(fetchUrl.longUrl)
}
catch(error){res.status(500).send({msg:error.message})}
}
module.exports={createUrl, getUrl}
