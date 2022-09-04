const express=require("express")
const app=express()
const body=require('body-parser')
const fs=require('fs')
const path=require('path')
const axios=require("axios")
var XMLHttpRequest = require('xhr2')
var FormData = require('form-data');
const mongoose=require('mongoose')
var json2xls = require('json2xls');
const Video=require('./video/Video')
const bcrypt = require('bcryptjs')
const fetch=require('node-fetch')
const jwt = require('jsonwebtoken')
const User=require("./user/User")
const fileMiddleware=require("./multer/file")
const {check, validationResult} = require('express-validator')



var EasyYandexS3 = require('easy-yandex-s3');
var s3 = new EasyYandexS3({
  auth: {
    accessKeyId: 'YCAJE9VavEEX6lxxxmn5Zf9gf',
    secretAccessKey: 'YCNN8SqgPoEf14LAsSfeVL8hJqC-G6YDL2cwSHrQ',
  },
  Bucket: 'viralbear', // например, "my-storage",
  debug: false, // Дебаг в консоли, потом можете удалить в релизе
});


let PORT=process.env.PORT || 5000
const filePath2=path.join(__dirname,"localstorage","localstorage.txt")
app.use(express.json({extended:true}))
app.set('view engine','ejs')
app.set("views", path.resolve(__dirname,"ejs"))
app.use(express.static(path.join(__dirname, 'build')));
app.use('/form', body.urlencoded({
    extended: true
}));
app.use('/excel', body.urlencoded({
    extended: true
}));

let allxls=[]



app.post('/getVideo', fileMiddleware.fields([{
  name: 'fileVideo', maxCount: 1
}, {
  name: 'filePhoto', maxCount: 1
}]), async(req,res)=>{
// console.log(req.body)
// console.log(req.files)
// console.log(req.files.fileVideo[0].path)

var upload = await s3.Upload(
  [ {
     path:req.files.fileVideo[0].path,
   },
   {
      path:req.files.filePhoto[0].path
     
     }],
   '/images/'
 );
 console.log(upload)



})


let changedPhoto
let changedVideo
app.post('/changePhoto',fileMiddleware.single('photo'),async(req,res)=>{
  var upload = await s3.Upload(
    {
       path:req.file.path,
     },
     
     '/images/'
   );
   changedPhoto=upload.Location
   console.log(upload)
   res.json(upload.Location)

})

app.post('/changeVideo',fileMiddleware.single('video'),async(req,res)=>{

 

  var upload = await s3.Upload(
    {
       path:req.file.path,
     },
     
     '/images/'
   );
   changedVideo=upload.Location
   console.log(upload)
   res.json(upload.Location)
})












app.post('/changeData',(req,res)=>{
    console.log(req.body)
    const date=new Date()

    
    Video.updateOne({_id:req.body.id}, {data:{
      title:req.body.changeTitle,
     description:req.body.changeDescription,
      tags:req.body.changeTags,
      city:req.body.changeCity,
      country:req.body.changeCountry,
      category:req.body.changeCategory,
      date:req.body.changeDate,
      videoId:req.body.changeVideoId,
      videoLink:req.body.changeVideoLink,
      downloadPhoto:req.body.changeDownloadPhoto,
      downloadVideo:req.body.changeDownloadVideo,
      lastModif:date.toGMTString(),
      brandSafe:req.body.brandSafe,
      videoCreateDate:req.body.videoCreateDate
      
      
    }},()=>{
      console.log("Изменено")
    })

    if (req.body.brandSafe){
 
      Video.updateOne({_id:req.body.id},{mRSS:`        <item>\n          <media:title>${req.body.changeTitle}</media:title>\n          <media:description>${req.body.changeDescription}</media:description>\n          <media:keywords>${req.body.changeTags}</media:keywords>\n          <media:city>${req.body.changeCity}</media:city>\n          <media:country>${req.body.changeCountry}</media:country>\n          <media:category>${req.body.changeCategory}</media:category>\n          <media:filmingDate>${req.body.changeDate}</media:filmingDate>\n          <guid>${req.body.changeVideoId} </guid>\n          <media:youtubeLink>${req.body.changeVideoLink}</media:youtubeLink>\n          <pubDate>${req.body.videoCreateDate}</pubDate>\n          <media:thumbnail url="${req.body.changeDownloadPhoto}" />\n          <media:content url="${req.body.changeDownloadVideo}" />\n          <dfpvideo:lastModifiedDate>${date.toGMTString()}</dfpvideo:lastModifiedDate>\n          <dfpvideo:lastMediaModifiedDate>${date.toGMTString()}</dfpvideo:lastMediaModifiedDate>\n        </item>`},()=>{
        console.log("Изменено MRSS")
      })
      Video.updateOne({_id:req.body.id},{mRSS2:`        <item>\n          <media:title>${req.body.changeTitle}</media:title>\n          <media:description>${req.body.changeDescription}</media:description>\n          <media:keywords>${req.body.changeTags}</media:keywords>\n          <media:city>${req.body.changeCity}</media:city>\n          <media:country>${req.body.changeCountry}</media:country>\n          <media:category>${req.body.changeCategory}</media:category>\n          <media:filmingDate>${req.body.changeDate}</media:filmingDate>\n          <guid>${req.body.changeVideoId} </guid>\n          <media:youtubeLink>${req.body.changeVideoLink}</media:youtubeLink>\n          <pubDate>${req.body.videoCreateDate}</pubDate>\n          <media:thumbnail url="${req.body.changeDownloadPhoto}" />\n          <media:content url="${req.body.changeDownloadVideo}" />\n          <dfpvideo:lastModifiedDate>${date.toGMTString()}</dfpvideo:lastModifiedDate>\n          <dfpvideo:lastMediaModifiedDate>${date.toGMTString()}</dfpvideo:lastMediaModifiedDate>\n        </item>`},()=>{
        console.log("Изменено MRSS2")
      })


    }
    else{
      Video.updateOne({_id:req.body.id},{mRSS:`        <item>\n          <media:title>${req.body.changeTitle}</media:title>\n          <media:description>${req.body.changeDescription}</media:description>\n          <media:keywords>${req.body.changeTags}</media:keywords>\n          <media:city>${req.body.changeCity}</media:city>\n          <media:country>${req.body.changeCountry}</media:country>\n          <media:category>${req.body.changeCategory}</media:category>\n          <media:filmingDate>${req.body.changeDate}</media:filmingDate>\n          <guid>${req.body.changeVideoId} </guid>\n          <media:youtubeLink>${req.body.changeVideoLink}</media:youtubeLink>\n          <pubDate>${req.body.videoCreateDate}</pubDate>\n          <media:thumbnail url="${req.body.changeDownloadPhoto}" />\n          <media:content url="${req.body.changeDownloadVideo}" />\n          <dfpvideo:lastModifiedDate>${date.toGMTString()}</dfpvideo:lastModifiedDate>\n          <dfpvideo:lastMediaModifiedDate>${date.toGMTString()}</dfpvideo:lastMediaModifiedDate>\n        </item>`},()=>{
        console.log("Изменено MRSS")
      })

    }
    res.json(req.body)
  })





app.get('/yandex',async(req,res)=>{

  var upload = await s3.Upload(
    {
      path: path.resolve(__dirname, './spectators.mp4'),
    },
    '/images/'
  );
  console.log(upload);


  
// Инициализация


})


  
app.post('/excel', async function(req, res, next) {
  console.log("Подключено к эксель")
    const videos=await Video.find({})
    console.log(videos[videos.length-1].data.videoId)
    const {videoId,title,videoLink,description,date,city,country,tags}= videos[videos.length-1].data
    console.log(req.body)
    const filePathExcel=path.join(__dirname,"excel","data.xlsx")
    // Объект req.body содержит данные из переданной формы
    var json2xls = require('json2xls');
    let objectData={
        Id:videoId,
        TITLE:title,
        VideoLink:videoLink,
        STORY:description,
        DATE:date,
        CITY:city,
        COUNTRY:country,
        KEYWORDS:tags
    }
    allxls.push(objectData)
    
var xls = json2xls(allxls);


fs.writeFileSync(filePathExcel, xls, 'binary');
allxls=[]

//     fs.readFile(filePath2,"utf-8",(err,content)=>{
//     if(err){
//         throw err
//     }
//     console.log(content)
//     filePath4=path.join(__dirname,"alldata",'alldata'+".xml" )
//      fs.writeFile(filePath4, content ,async (err)=>{
//         if(err){
//             throw err
//         }
//         else{
//             console.log("XML файл создан")
            
    setTimeout(()=>{
        fs.writeFile(filePath2, ``,(err)=>{ 
            if(err){
                throw err
            }
            else{
                console.log("Удалено")
                
            
            }
    })
    },2000)    
            
        
    
res.json("Успех")
    
// })
    
})

app.post('/exceldownload',async(req,res)=>{
 
  const videos=await Video.find({})
  console.log(videos[videos.length-1].data.videoId)
  const {videoId,title,videoLink,description,date,city,country,tags}= videos[videos.length-1].data
  console.log(req.body)
  const filePathExcel=path.join(__dirname,"excel","data.xlsx")
  // Объект req.body содержит данные из переданной формы
  var json2xls = require('json2xls');
  let objectData={
      Id:videoId,
      TITLE:title,
      VideoLink:videoLink,
      STORY:description,
      DATE:date,
      CITY:city,
      COUNTRY:country,
      KEYWORDS:tags
  }
  allxls.push(objectData)
  
var xls = json2xls(allxls);


fs.writeFileSync(filePathExcel, xls, 'binary');
allxls=[]

//     fs.readFile(filePath2,"utf-8",(err,content)=>{
//     if(err){
//         throw err
//     }
//     console.log(content)
//     filePath4=path.join(__dirname,"alldata",'alldata'+".xml" )
//      fs.writeFile(filePath4, content ,async (err)=>{
//         if(err){
//             throw err
//         }
//         else{
//             console.log("XML файл создан")
          
  setTimeout(()=>{
      fs.writeFile(filePath2, ``,(err)=>{ 
          if(err){
              throw err
          }
          else{
              console.log("Удалено")
              
          
          }
  })
  },2000)   
        // const formData = new FormData();
        // formData.append('file', fs.createReadStream('excel/data.xlsx'));
        
        // formData.append('user', "hubot");
 







  res.download(path.resolve(__dirname,"excel","data.xlsx"))

})




app.post('/delete', (req,res)=>{
    console.log("Файл удален")
    console.log(req.body)
    Video.findOneAndDelete({_id:req.body.id},()=>{
      console.log("Всё удалилось")
    })
    res.json(req.body)
  })







 app.post(
    '/login',
    [
      check('email', 'Введите корректный email').normalizeEmail().isEmail(),
      check('password', 'Введите пароль').exists()
    ],
    async (req, res) => {
    try {
      const errors = validationResult(req)
  
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: 'Некорректный данные при входе в систему'
        })
      }
  
      const {email, password} = req.body
  
      const user = await User.findOne({ email })
  
      if (!user) {
        return res.status(400).json({ message: 'Пользователь не найден' })
      }
  
      const isMatch = await bcrypt.compare(password, user.password)
  
      if (!isMatch) {
        return res.status(400).json({ message: 'Неверный пароль, попробуйте снова' })
      }
  
      const token = jwt.sign(
        { userId: user.id },
        "admin video application",
        { expiresIn: '1h' }
      )
  
      res.json({ token, userId: user.id })
  
    } catch (e) {
      res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
    }
  })




 app.post(
    '/register',
    [
      check('email', 'Некорректный email').isEmail(),
      check('password', 'Минимальная длина пароля 6 символов')
        .isLength({ min: 6 })
    ],
    async (req, res) => {
    try {
      const errors = validationResult(req)
  
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: 'Некорректный данные при регистрации'
        })
      }
  
      const {email, password} = req.body
  
      const candidate = await User.findOne({ email })
  
      if (candidate) {
        return res.status(400).json({ message: 'Такой пользователь уже существует' })
      }
  
      const hashedPassword = await bcrypt.hash(password, 12)
      const user = new User({ email, password: hashedPassword })
  
      await user.save()
  
      res.status(201).json({ message: 'Пользователь создан' })
  
    } catch (e) {
      res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
    }
  })
  










































































app.post("/alldata",async(req,res)=>{
    console.log("Подключено к бэкэнду")
    const videos=await Video.find({})
    res.json(videos)
    
    
})





app.post('/data',fileMiddleware.fields([{
  name: 'fileVideo', maxCount: 1
}, {
  name: 'filePhoto', maxCount: 1
}]),async(req,res)=>{
    try{
      
      var upload = await s3.Upload(
       [ {
          path:req.files.fileVideo[0].path,
        },
        {
           path:req.files.filePhoto[0].path
          
          }],
        '/images/'
      );
      console.log(upload)
     
      
        console.log(req.body)
        const {title,description,tags,city,country,videoCreateDate,category,date,videoLink,videoId,lastModif,brandSafe}=req.body
        
        const hasId = await Video.findOne({videoId})
        
        console.log(hasId)
            if (hasId) {
              return res.status(409).json({ message: 'Видео с таким id уже существует в базе данных' })
            }
            
        if (brandSafe){
          
          
          const video = new Video({
            videoId:videoId,
             mRSS2:`        <item>\n          <media:title>${title}</media:title>\n          <media:description>${description}</media:description>\n          <media:keywords>${tags}</media:keywords>\n          <media:city>${city}</media:city>\n          <media:country>${country}</media:country>\n          <media:category>${category}</media:category>\n          <media:filmingDate>${date}</media:filmingDate>\n          <guid>${videoId} </guid>\n          <media:youtubeLink>${videoLink}</media:youtubeLink>\n          <pubDate>${videoCreateDate}</pubDate>\n          <media:thumbnail url="${upload[1].Location}" />\n          <media:content url="${upload[0].Location}" />\n          <dfpvideo:lastModifiedDate>${lastModif}</dfpvideo:lastModifiedDate>\n          <dfpvideo:lastMediaModifiedDate>${lastModif}</dfpvideo:lastMediaModifiedDate>\n        </item>`,
             mRSS:`        <item>\n          <media:title>${title}</media:title>\n          <media:description>${description}</media:description>\n          <media:keywords>${tags}</media:keywords>\n          <media:city>${city}</media:city>\n          <media:country>${country}</media:country>\n          <media:category>${category}</media:category>\n          <media:filmingDate>${date}</media:filmingDate>\n          <guid>${videoId} </guid>\n          <media:youtubeLink>${videoLink}</media:youtubeLink>\n          <pubDate>${videoCreateDate}</pubDate>\n          <media:thumbnail url="${upload[1].Location}" />\n          <media:content url="${upload[0].Location}" />\n          <dfpvideo:lastModifiedDate>${lastModif}</dfpvideo:lastModifiedDate>\n          <dfpvideo:lastMediaModifiedDate>${lastModif}</dfpvideo:lastMediaModifiedDate>\n        </item>`,
            data:{
                title,description,tags,brandSafe,city,videoCreateDate,country,category,date,videoId,videoLink,downloadVideo:upload[0].Location,downloadPhoto:upload[1].Location,lastModif,
               
            }
        })
        await video.save()
        }
        else{
          const video = new Video({
            videoId:videoId,
            mRSS:`        <item>\n          <media:title>${title}</media:title>\n          <media:description>${description}</media:description>\n          <media:keywords>${tags}</media:keywords>\n          <media:city>${city}</media:city>\n          <media:country>${country}</media:country>\n          <media:category>${category}</media:category>\n          <media:filmingDate>${date}</media:filmingDate>\n          <guid>${videoId} </guid>\n          <media:youtubeLink>${videoLink}</media:youtubeLink>\n          <pubDate>${videoCreateDate}</pubDate>\n          <media:thumbnail url="${upload[1].Location}" />\n          <media:content url="${upload[0].Location}" />\n          <dfpvideo:lastModifiedDate>${lastModif}</dfpvideo:lastModifiedDate>\n          <dfpvideo:lastMediaModifiedDate>${lastModif}</dfpvideo:lastMediaModifiedDate>\n        </item>`,
            data:{
                title,description,brandSafe,tags,videoCreateDate,city,country,category,date,videoId,videoLink,downloadVideo:upload[0].Location,downloadPhoto:upload[1].Location,lastModif,
                
                
            }
        })
        await video.save()
        }
        
        console.log("Данные записаны")
        res.json()
    }catch(e){console.log(e.message)}
 
})






// app.post('/form', function(req, res, next) {
//     // Объект req.body содержит данные из переданной формы
    
//     console.dir(req.body)
    
//     filePath=path.join(__dirname, req.body.paths,req.body.video_id+".xml" )
//     fs.writeFile(filePath, `<?xml version="1.0" encoding="UTF-8"?><item><title>${req.body.title}</title><description>${req.body.description}</description><guid>${req.body.video_id}</guid><category>${req.body.category}</category><pubDate>${new Date()}</pubDate> <media:keywords>${req.body.tags}</media:_media_keywords></item>\n`,(err)=>{
//         if(err){
//             throw err
//         }
//         else{
//             console.log("XML файл создан")
            
//             let objectData={
//                 Id:req.body.video_id,
//                 TITLE:req.body.title,
//                 VideoLink:req.body.video_link,
//                 STORY:req.body.description,
//                 DATE:req.body.date,
//                 CITY:req.body.city,
//                 COUNTRY:req.body.country,
//                 KEYWORDS:req.body.tags
//             }
//             allxls.push(objectData)
//             console.log(allxls)
//             fs.appendFile(filePath2,`<?xml version="1.0" encoding="UTF-8"?><item><title>${req.body.title}</title><description>${req.body.description}</description><guid>${req.body.video_id}</guid><category>${req.body.category}</category><pubDate>${new Date()}</pubDate> <media:keywords>${req.body.tags}</media:_media_keywords></item>\n`,(err)=>{
//     if(err){
//         throw err
//     }
//     console.log('File writed')})
//         }
// })
// })

const start=async()=>{
    try{
        await mongoose.connect('mongodb+srv://admin:k9logpHTmwIWtR17@cluster0.tdvhizy.mongodb.net/?retryWrites=true&w=majority',{})
        app.listen(PORT,()=>{
            console.log("Server has been launched on PORT", PORT)
        })
    }catch(e){console.log(e.message)}
    
}
start()

app.get('/mrss',async(req,res)=>{
    
    
    

      

    res.render('index',{
        array:await Video.find({}),
        start:'<?xml version="1.0" encoding="UTF-8"?>\n<rss xmlns:atom="http://www.w3.org/2005/Atom"\n  xmlns:media="http://search.yahoo.com/mrss/"\n  xmlns:openSearch="http://a9.com/-/spec/opensearchrss/1.0/"\n  xmlns:dfpvideo="http://api.google.com/dfpvideo"\n  xmlns:tms="http://data.tmsapi.com/v1.1"\n  version="2.0">\n    <channel>\n      <title>ViralBear videos</title>\n      <dfpvideo:version>2</dfpvideo:version>',
        end:'      </channel>\n</rss>'
    })
})
app.get('/mrss2',async(req,res)=>{
    
    
    

      

  res.render('index2',{
      array:await Video.find({}),
      start:'<?xml version="1.0" encoding="UTF-8"?>\n<rss xmlns:atom="http://www.w3.org/2005/Atom"\n  xmlns:media="http://search.yahoo.com/mrss/"\n  xmlns:openSearch="http://a9.com/-/spec/opensearchrss/1.0/"\n  xmlns:dfpvideo="http://api.google.com/dfpvideo"\n  xmlns:tms="http://data.tmsapi.com/v1.1"\n  version="2.0">\n    <channel>\n      <title>ViralBear videos</title>\n      <dfpvideo:version>2</dfpvideo:version>',
        end:'      </channel>\n</rss>'
  })
})