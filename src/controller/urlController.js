
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

    const urlCode = shortid.generate()

   
    //checking the longUrl if it is valid or not using "validUrl.isUri" method
    const {longUrl} = req.body
  
    if(validUrl.isUri(longUrl)){

       try{
            let url = await urlModel.findOne({longUrl})
        
            if (url){
            res.send(url)
        }
        else{
             const shortUrl = baseUrl + '/' + urlCode  // join the generated urlCode and the baseUrl
             
             url = new urlModel ({

                longUrl,
                shortUrl,
                urlCode,

            })
            await url.save()
            res.send(url)
        }
    }

    catch(err){
        res.status(500).send({ status:false, msg:"err.message"});

    }

}else{
    res.status(400).send({status:false , msg:"Invalid longUrl"})
}
}

const getUrl = async(req,res)=>{
   try{
        let {urlCode} =req.params
    let fetchUrl =await urlModel.findOne({urlCode})
    console.log(fetchUrl)
    if(!fetchUrl) {
        return res.status(404).send({msg:"urlCode isn't found"})
    }
    else return res.redirect(fetchUrl.longUrl)
}
catch(error){res.status(500).send({msg:error.message})}
}
module.exports={createUrl, getUrl}
