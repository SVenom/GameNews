// const news = []
require('../utils/database');
const req = require('express/lib/request');
const res = require('express/lib/response');
const category = require("../model/category");
const customerservice = require('../model/contact');
const latestnews = require("../model/exp_news");
const User = require("../model/login");
const localstroage = require('local-storage');
const console = require('console');


// category
exports.getNews= async (req,res,next)=> {
    try {
        let isAdmin = false
        if(localstroage.get('token')==='Adminlogin')
            isAdmin=true
      
        const limitNumber =5;
        const categories = await category.find({}).limit(limitNumber);
        const latest = await latestnews.find({}).sort({_id: -1}).limit(limitNumber);
        const coc = await latestnews.find({"category": 'Clash-Of-Clans'}).limit(limitNumber);
        const news = {latest,coc};
        // console.log(latest);
        // console.log( "MONGO ID:", news[0]._id);
        res.render('news.ejs',{categories,news,isAdmin});
        console.log("In news js");
    } catch (error) {
        res.status(500).send({message: Error.message || "Error Occured"});
    }

}
// View All
exports.getviewAll= async (req,res,next)=> {
    try {
      let isAdmin = false
        if(localstroage.get('token')==='Adminlogin')
            isAdmin=true

        const limitNumber =20;
        const categories = await category.find({}).limit(limitNumber);
        // console.log(categories);
        res.render('viewall.ejs',{title: 'View All',categories,isAdmin});
        console.log("In viewall js");
    } catch (error) {
        res.status(500).send({message: Error.message || "Error Occured"});
    }

}
// Viewall 
exports.getviewAllById= async (req,res,next)=> {
    try {
      let isAdmin = false
        if(localstroage.get('token')==='Adminlogin')
            isAdmin=true

        let viewallId = req.params.id;
        // console.log("feaching:" ,viewallId);
        const limitNumber =20;
        const viewById = await latestnews.find({'category': viewallId}).limit(limitNumber);
        // console.log(viewById);
        res.render('viewall.ejs',{title: 'View All', viewById,isAdmin});
        // console.log("In viewall js");
    } catch (error) {
        res.status(500).send({message: Error.message || "Error Occured"});
    }

}
//search
exports.searchnews = async(req, res,next) => {
    try {
      let isAdmin = false
        if(localstroage.get('token')==='Adminlogin')
            isAdmin=true

      let searchTerm = req.body.searchTerm;
      // let searchTerm= req.params.searchTerm;
      let search =  await category.find({name: searchTerm});
      // console.log(search);
      // console.log(searchTerm);
      // let search = searchTerm;
      res.render('search.ejs', { title: 'Search',search,isAdmin } );
    } catch (error) {
      res.status(500).send({message: error.message || "Error Occured" });
    }
    
  }
// Categories
exports.getspecificNews = async (req,res,next)=> {
    try {
      let isAdmin = false
        if(localstroage.get('token')==='Adminlogin')
            isAdmin=true

       let newsid = req.params.id;
       const news = await latestnews.findById(newsid);
        res.render('latest_news.ejs',{news,isAdmin});
        console.log("In latestnews js");
    } catch (error) {
        res.status(500).send({message: Error.message || "Error Occured"});
    }

}
// explorelatest
exports.explorelatest = async (req,res,next)=> {
    try {
      let isAdmin = false
        if(localstroage.get('token')==='Adminlogin')
            isAdmin=true


        const limitNumber = 20;
        const latest = await latestnews.find({}).sort({_id: -1}).limit(limitNumber);
        res.render('explore-latest.ejs',{title: 'Explore Latest',latest,isAdmin});
        console.log("In explore-latest js");
    } catch (error) {
        res.status(500).send({message: Error.message || "Error Occured"});
    }

}
// exploreramdom
exports.exploreRandom = async(req, res) => {
    try {
      let isAdmin = false
        if(localstroage.get('token')==='Adminlogin')
            isAdmin=true

        
      let count = await latestnews.find().countDocuments();
      let random = Math.floor(Math.random() * count);
      let showrandom = await latestnews.findOne().skip(random).exec();
      res.render('explore-random.ejs', {title: 'Explore Random',showrandom,isAdmin } );
    } catch (error) {
      res.status(500).send({message: error.message || "Error Occured" });
    }
  }
  /**
 * GET /submit-news
 * Submit News
*/
exports.submitnews = async(req, res,next) => {
  let isAdmin = false
        if(localstroage.get('token')==='Adminlogin')
            isAdmin=true
        if(isAdmin === false )
        {
          res.json({'msg':'invalid user'})
        }

    const infoErrorsObj = req.flash('infoErrors');
    const infoSubmitObj = req.flash('infoSubmit');
    res.render('submit_news.ejs', {title: 'Submit',infoErrorsObj, infoSubmitObj ,isAdmin } );
  }
  /**
   * POST /submit-news
   * Submit News
  */
  exports.submitnewsonpost = async(req, res,next) => {

    const specialkey = req.body.specialkey;
    if(specialkey !== "Chotion@2341"){
      return res.send('You are not admin');
    }


    try {
      let isAdmin = false
        if(localstroage.get('token')==='Adminlogin')
            isAdmin=true


      let imageUploadFile;
      let uploadPath;
      let newImageName;
  
      if(!req.files || Object.keys(req.files).length === 0){
        console.log('No Files where uploaded.');
      } else {
  
        imageUploadFile = req.files.image;
        newImageName = Date.now() + imageUploadFile.name;
  
        uploadPath = require('path').resolve('./') + '/public/img/' + newImageName;
  
        imageUploadFile.mv(uploadPath, function(err){
          if(err) return res.satus(500).send(err);
        })
  
      }
     
  
      const newNews = new latestnews({
        name: req.body.name,
        description: req.body.description,
        email: req.body.email,
        news: req.body.news,
        category: req.body.category,
        image: newImageName
      });

      
      
      await newNews.save();
  
      req.flash('infoSubmit', 'News has been added.')
      res.redirect('/submit-news');
    } catch (error) {
      req.flash('infoErrors', error);
      res.redirect('/submit-news');
    }
  }


// Contact US
// GET

exports.contactus = async(req,res,next)=>{
  let isAdmin = false
        if(localstroage.get('token')==='Adminlogin')
            isAdmin=true
  res.render('contact.ejs',{title: 'Contact',isAdmin});
}


// POST
exports.contactusonpost = async(req,res,next) =>{
  // console.log(req.body);
  
  try {
    let isAdmin = false
        if(localstroage.get('token')==='Adminlogin')
            isAdmin=true

    // console.log(req.body);
    
    const contact = new  customerservice({
        email: req.body.email,
        user: req.body.user,
        topic: req.body.topic,
        details: req.body.details
  })
  await contact.save();
  res.redirect('/');
}catch (error){
  res.status(500).send({message: error.message || "Error Occured" });
}
}


//Login

exports.login = async(req,res,next) => {
  let isAdmin = false
        if(localstroage.get('token')==='Adminlogin')
            isAdmin=true
  res.render("login.ejs",{title: 'Login',isAdmin});
}
exports.loginonpost = async(req,res,next) =>{

  try {
    let isAdmin = false
        if(localstroage.get('token')==='Adminlogin')
            isAdmin=true


    const email = req.body.email;
    const password = req.body.password;

    const adminemail = await User.findOne({email});
    if(adminemail === null){
      return res.json({"msg":"you are no admin"})
    }
    if(adminemail.password == password ){
      localstroage.set('token','Adminlogin')
      // console.log(localstroage.get('token'))
      res.redirect('/');
    }else{
      res.send('invaild user');
    }
  // res.redirect('/submit-news');
}catch (error){
  res.status(500).send({message: error.message || "Error Occured" });
}
  
}

// About
exports.about = async (req,res,next)=>{
  let isAdmin = false
        if(localstroage.get('token')==='Adminlogin')
            isAdmin=true
  res.render("about.ejs",{title: 'About',isAdmin});

}

// Update


exports.updatedId = async (req,res,next) => {
  
  let isAdmin = false
  if(localstroage.get('token')==='Adminlogin')
      isAdmin=true

    const updateid = req.params.id
    const infoErrorsObj = req.flash('infoErrors');
    const infoSubmitObj = req.flash('infoSubmit');
    const news = await latestnews.findById(updateid)
    res.render('update.ejs',{isAdmin,news,infoErrorsObj,infoSubmitObj})
     
    }

exports.update = async (req,res,next) => {
  let isAdmin = false
        if(localstroage.get('token')==='Adminlogin')
            isAdmin=true

            let imageUploadFile;
            let uploadPath;
            let newImageName;
        
            if(!req.files || Object.keys(req.files).length === 0){
              console.log('No Files where uploaded.');
            } else {
        
              imageUploadFile = req.files.image;
              newImageName = Date.now() + imageUploadFile.name;
        
              uploadPath = require('path').resolve('./') + '/public/img/' + newImageName;
        
              imageUploadFile.mv(uploadPath, function(err){
                if(err) return res.satus(500).send(err);
              })
            await latestnews.findByIdAndUpdate(req.body.newsId,{
            
              name: req.body.name,
              description: req.body.description,
              email: req.body.email,
              news: req.body.news,
              category: req.body.category,
              image: newImageName
            
           })
    console.log("news updated")
    res.redirect("/explore-latest")
 
}}

// Delete
exports.delete = async (req,res,next) =>{
  const deleteid = req.params.id
  await latestnews.findByIdAndDelete(deleteid)
  console.log("DELETED" , deleteid)
  res.redirect('/')
}

