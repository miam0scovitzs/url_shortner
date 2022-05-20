
const mongoose = require ("mongoose")
const validUrl = require ("valid-url")
const shortid= require ("shortid")
const redis = require ("redis");
const { promisify } = require("util");

const urlModel = require ("../model/urlModel")

//................Connect to redis..........................................
const redisClient = redis.createClient(
  10575,
  "redis-10575.c301.ap-south-1-1.ec2.cloud.redislabs.com",
  { no_ready_check: true }
);
redisClient.auth("wSvnif4wEuzru1Vh9T213Dp3nMLDHhc3", function (err) {
  if (err) throw err;
});

redisClient.on("connect", async function () {
  console.log("Connected to Redis..");
});

const SET_ASYNC = promisify(redisClient.SET).bind(redisClient);
const GET_ASYNC = promisify(redisClient.GET).bind(redisClient);

// ...................................................................................................


const createUrl = async function (req, res) {

    const baseUrl = "http://localhost:3000"

    if(!validUrl.isUri(baseUrl)){
        return res.status(400).send ({ status: false, msg:"Invalid baseUrl"})
    }
    const data = req.body
    if(!Object.keys(data).length) return res.status(400).send({msg: "body cant be empty"})
     data.urlCode = shortid.generate()
    if(validUrl.isUri(data.longUrl)){
       try{
        let cache = await GET_ASYNC(`${data.longUrl}`) //we can write the same as GET_ASYNC(data.longUrl) --> No Difference
        if(cache)
            return res.status(200).send({status:true,message:"Data from Redis ->", redisdata:JSON.parse(cache)})

            let findUrl = await urlModel.findOne({longUrl:data.longUrl}).select({_id:0,createdAt:0,updatedAt:0,_v:0})
            if (findUrl){
              await SET_ASYNC(`${data.longUrl}`,JSON.stringify(findUrl));
              return res.status(200).send({status: true, message: "Data from DB ->", data: findUrl})
        }
        else{
             data.shortUrl = baseUrl + '/' +data.urlCode  // join the generated urlCode and the baseUrl
             
             let createUrl = await urlModel.create(data)
             let str = JSON.stringify({longUrl:createUrl.longUrl, shortUrl:createUrl.shortUrl, urlCode:createUrl.urlCode})
             await SET_ASYNC(`${data.longUrl}`, str);
             res.status(201).send({status: true, message: 'Data successfully created.', 
             data: {
                 longUrl: createUrl.longUrl,
                 shortUrl: createUrl.shortUrl,
                 urlCode: createUrl.urlCode
             }})
        }     
    }
    catch(err){
        res.status(500).send({ status:false, msg:err.message});
    }
}else{
    res.status(400).send({status:false , msg:"Invalid longUrl"})
}}


const getUrl = async(req,res)=>{
   try{
        let urlCode =req.params.urlCode // destructuring  n

        if(!validUrl.isUri(urlCode)){
          return res.status(400).send ({ status: false, msg:"Invalid UrlCode"}) 
             }   
               if(!Object.keys(urlCode).length) return res.status(400).send({msg:"urlCode required"})
        let findCatch = await GET_ASYNC(`${req.params.urlCode}`)
      //  console.log(findCatch)
        if(findCatch){
       return  res.redirect(JSON.parse(findCatch).longUrl)
       }
      else {
    let fetchUrl =await urlModel.findOne({urlCode:req.params.urlCode})
            if(!fetchUrl){ res.status(404).send(" urlCode not found")}
            else{ await SET_ASYNC(`${urlCode}`, JSON.stringify(fetchUrl))
            res.status(301).redirect(fetchUrl.longUrl)  }
        }
     //  else { res.redirect(JSON.parse(findCatch))}
   }
   // console.log(fetchUrl)

//     if(!fetchUrl) {
//         return res.status(404).send({msg:"urlCode isn't found"})
//     }
//     else return res.redirect(fetchUrl.longUrl)
// }
catch(error){res.status(500).send({msg:error.message})}
}
module.exports={createUrl, getUrl}
