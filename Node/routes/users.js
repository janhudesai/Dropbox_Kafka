var express = require('express');
var router = express.Router();
var formidable = require('formidable');
const fs = require('fs');
var sql = require('./sql');
var user;
var parentfolderdelete;
var url;
var CryptoJS = require("crypto-js");

var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/dropbox";
var kafka = require('./kafka/client');
var passport = require('passport');
require("./passport")(passport);




/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});


router.post('/login', function (req, res, next) {


    console.log(req.body);
    var bytes  = CryptoJS.AES.decrypt(req.body.password.toString(), '123');
    var plaintext = bytes.toString(CryptoJS.enc.Utf8);
    console.log(bytes)
    console.log(plaintext)
    var query = "select * from users where userid='"+ req.body.username+"'and password='"+ plaintext+"'";
    console.log(query);

 // SQL CODE
 //    function display(error,display)
 //    {
 //        console.log(display);
 //        if (display.length > 0)
 //        {
 //            user = display[0].userid;
 //            // remember to reset the variable after signoff
 //            res.status(200).json({message: "Login successful"});
 //        }
 //
 // }
 //    sql.fetch(display,query);
 // SQL CODE ENDS

    // MONGO CODE
    // mongo.connect(mongoURL, function(){
    //     console.log('Connected to mongo at: ' + mongoURL);
    //     var coll = mongo.collection('dropbox');
    //     console.log("inside the Login")
    //     console.log("Uname"+" "+req.body.username);
    //     console.log("password"+" "+plaintext);
    //     console.log("Collection"+" "+coll);
    //
    //     coll.findOne({username: req.body.username, password:plaintext}, function(err, user1){
    //         console.log("inside call back"+user1)
    //         user= user1.username;
    //         if (user1) {
    //             res.status(200).json({message: "Login successful"});
    //
    //         } else {
    //             res.status(401).json({message: "Login unsuccessful"});
    //         }
    //     });
    // });

    // MONGO CODE ENDS

    // KAFKA CODE

    // KAFKA CODE
    // kafka.make_request('dropbox_login_topic',
    //                     {"username":req.body.username, "password":plaintext,"topic_c":"dropbox_login_topic_response"}, function(err,results){
    //     console.log('in result');
    //     console.log(results);
    //     if(err){
    //         res.status(401).json({message: "Login unsuccessful"});
    //     }
    //     else
    //     {
    //
    //         if(results.code == 200){
    //             user= req.body.username;
    //             res.status(200).json({message: "Login successful"});
    //         }
    //         else {
    //             res.status(401).json({message: "Login unsuccessful"});
    //         }
    //     }
    // });

    passport.authenticate('login', function(err, usersuccess) {
        if(err) {
            res.status(401).json({message: "Login unsuccessful"});
        }

        if(!usersuccess) {
            res.status(401).json({message: "Login unsuccessful"});
        }
        else{
            req.session.user = req.body.username;
            console.log(req.session.user);
            console.log("session initilized");
            user= req.body.username;
            res.status(200).json({message: "Login successful"});
        }
    })(req, res);

});

router.post('/signup', function (req, res, next) {


     console.log(req.body);
    var query = "insert into users values ('"+ req.body.username+ "','" + req.body.password+"','"+req.body.fname+"','"+req.body.lname+"','','','','','','');";
     console.log(query);


    // function display(error,display)
    // {
    //     console.log(display);
    //     console.log(error);
    //     if (error)
    //     {
    //         console.log("display");
    //         res.status(400).json({message: "Login successful"});
    //     }
    //     else
    //     {
    //         console.log("display");
    //         res.status(200).json({message: "Login successful"});
    //     }
    //
    // }
    // sql.fetch(display,query);

    // MONGO CODE
    // mongo.connect(mongoURL, function(){
    //     console.log('Connected to mongo at: ' + mongoURL);
    //     var coll = mongo.collection('dropbox');
    //     console.log("inside the Signup")
    //     console.log("Uname"+" "+req.body.username);
    //     console.log("password"+" "+req.body.password);
    //     console.log("Collection"+" "+coll);
    //
    //     coll.insert({username: req.body.username,
    //                     password:req.body.password,
    //                     firstname:req.body.fname,
    //                     lastname:req.body.lname,
    //                     files:[],
    //                     folders:[],
    //                     details:[]}, function(err, user){
    //         console.log("inside call back"+user)
    //         if (user) {
    //             res.status(200).json({message: "Login successful"});
    //         }
    //         else
    //             {
    //             res.status(401).json({message: "Login successful"});
    //         }
    //     });
    // });



    kafka.make_request('dropbox_signup_topic',
        {"username":req.body.username,
            "password":req.body.password,
            "fname":req.body.fname,
            "lname":req.body.lname,
            "topic_c":"dropbox_signup_topic_response"}, function(err,results){
            console.log('in Signup');
            console.log(results);
            if(err){
                res.status(401).json({message: "Login unsuccessful"});
            }
            else
            {

                if(results.code == 200){
                 
                    res.status(200).json({message: "Login successful"});
                }
                else {
                    res.status(401).json({message: "Login unsuccessful"});
                }
            }
        });
});


router.post("/fileupload", function(req, res)
{
    var file;
    var queryobject;
    console.log(user);
    console.log(req.body.id);

    if(!req.files)
    {

        res.send("File was not found");
        return;
    }

    file = req.files.file.name;

    var today = new Date();
    var dd = today.getDate();

    var mm = today.getMonth()+1;
    var yyyy = today.getFullYear();
    if(dd<10)
    {
        dd='0'+dd;
    }

    if(mm<10)
    {
        mm='0'+mm;
    }
    today = yyyy+'-'+mm+'-'+dd;

    console.log(today);


    var query = "insert into files values ('"+ file+ "','" + today+"','"+user+"','"+root+"','"+file+"',null);";
    var temp;


    if (req.body.id =='null' )
    {

        // var root= 1;
        // console.log("inside 1")
        // var query = "insert into files values ('"+ file+ "','" + today+"','"+user+"','"+root+"','"+file+"',null);";
        // query =query+"insert into useractivites values ('"+user+"','Uploaded File','"+file+"','"+today+"')";

        // MONGO CODE
        // mongo.connect(mongoURL, function() {
        //
        //     console.log('Connected to mongo at: ' + mongoURL);
        //     var coll = mongo.collection('dropbox');
        //     console.log("inside the Fileupload")
        //
        //     coll.update({username: user}, {
        //         $push: {
        //             files: {
        //                 name: file,
        //                 date: Date(),
        //                 parentfolder: 1,
        //                 fileid: file,
        //                 starred: null,
        //                 display:"file"
        //             }
        //         }
        //     }, function (err, user) {
        //         console.log("inside call back" + user)
        //         if (user) {
        //
        //             req.files.file.mv("F:/273-LAB2/temp/" + file, function (err) {
        //                 console.log(err);
        //             });
        //
        //             res.send("File Uploaded");
        //         }
        //         else {
        //             res.send("File not uploaded Uploaded");
        //         }
        //     });
        // });

        kafka.make_request('dropbox_fileupload_topic',
            {"username":user,
                "filename":file,
                "parentid":"null",
                "topic_c":"dropbox_fileupload_topic_response"}, function(err,results){
                console.log('in Signup');
                console.log(results);
                if(err){
                    res.send("File Not Uploaded");
                }
                else
                {

                    if(results.code == 200){

                        req.files.file.mv("F:/273-LAB2/temp/" + file, function (err) {
                            console.log(err);
                        });

                        res.send("File Uploaded");
                    }
                    else {
                        res.send("File Not Uploaded");
                    }
                }
            });

    }
    else
    {

        // MYSQL CODE
        // var root= req.body.id;
        // console.log("inside 2")
        // var query = "insert into files values ('"+ file+ "','" + today+"','"+user+"','"+root+"','"+file+"',null);";
        // query =query+"insert into useractivites values ('"+user+"','Uploaded File','"+file+"','"+today+"')";

        // MONGO CODE
        // mongo.connect(mongoURL, function() {
        //
        //     console.log('Connected to mongo at: ' + mongoURL);
        //     var coll = mongo.collection('dropbox');
        //     console.log("inside the Fileupload")
        //
        //     coll.update({username: user}, {
        //         $push: {
        //             files: {
        //                 name: file,
        //                 date: Date(),
        //                 parentfolder: req.body.id,
        //                 fileid: file,
        //                 starred: null,
        //                 display:"file"
        //
        //             }
        //         }
        //     }, function (err, user) {
        //         console.log("inside call back" + user)
        //         if (user) {
        //
        //             req.files.file.mv("F:/273-LAB2/temp/" + file, function (err) {
        //                 console.log(err);
        //             });
        //
        //             res.send("File Uploaded");
        //         }
        //         else {
        //             res.send("File not uploaded Uploaded");
        //         }
        //     });
        // });

        kafka.make_request('dropbox_fileupload_topic',
            {"username":user,
                "filename":file,
                "parentid":req.body.id,
                "topic_c":"dropbox_fileupload_topic_response"}, function(err,results){
                console.log('in Signup');
                console.log(results);
                if(err){
                    res.send("File Not Uploaded");
                }
                else
                {

                    if(results.code == 200){

                        req.files.file.mv("F:/273-LAB2/temp/" + file, function (err) {
                                             console.log(err);
                                         });

                        res.send("File Uploaded");
                    }
                    else {
                        res.send("File Not Uploaded");
                    }
                }
            });
    }


    // MYSQL CODE
    // function display(error,display)
    // {
    //     console.log(display);
    //     console.log(error);
    //     if (error)
    //     {
    //         console.log("display-error");
    //         res.status(400).json({message: "Login successful"});
    //     }
    //     else
    //     {
    //         req.files.file.mv("E:/273/users/"+file, function(err)
    //          {
    //              console.log(err);
    //          });
    //
    //         res.send("File Uploaded");
    //     }
    //
    // }
    // sql.fetch(display,query);


});

router.post('/createdirectory', function (req, res, next) {

    // console.log(req.body.folder);
    var today = new Date();
    var dd = today.getDate();

    var mm = today.getMonth()+1;
    var yyyy = today.getFullYear();
    if(dd<10)
    {
        dd='0'+dd;
    }

    if(mm<10)
    {
        mm='0'+mm;
    }
    today = yyyy+'-'+mm+'-'+dd;
    var prent =1;
    var child = null;
    console.log("parent id:" +req.body.id)

    // MONGODB CODE

    // if (req.body.id == null)
    // {
    //     // var query = "insert into folder values ('"+ req.body.folder+ "','" + today+"','"+user+"','"+req.body.folder+"',null,null,null);";
    //     // query= query+"insert into useractivites values ('"+user+"','Created Folder','"+req.body.folder+"','"+today+"')";
    //
    //     mongo.connect(mongoURL, function() {
    //
    //         console.log('Connected to mongo at: ' + mongoURL);
    //         var coll = mongo.collection('dropbox');
    //         console.log("inside the Create Directory")
    //         var username = user;
    //
    //         coll.update({username: user}, {
    //             $push: {
    //                 folders: {
    //                     name: req.body.folder,
    //                     date: Date(),
    //                     parentfolder: null,
    //                     folderid: req.body.folder,
    //                     starred: null,
    //                     display:"folder"
    //
    //                 }
    //             }
    //         }, function (err, user) {
    //             console.log("inside call back" + user)
    //             if (user) {
    //                 var directory = 'F:/273-LAB2/temp/'+username+ req.body.folder;
    //
    //                 fs.mkdir(directory,function (err) {
    //                     if (err) throw err;
    //                     res.status(201).json({message: "Login successful"});
    //                 })
    //             }
    //             else {
    //                 res.send("File not uploaded Uploaded");
    //             }
    //         });
    //     });
    // }
    // else
    // {
    //     // var query = "insert into folder values ('"+ req.body.folder+ "','" + today+"','"+user+"','"+req.body.folder+"','"+req.body.id+"',null,null);";
    //     // query= query+"insert into useractivites values ('"+user+"','Created Folder','"+req.body.folder+"','"+today+"')";
    //
    //     mongo.connect(mongoURL, function() {
    //
    //         console.log('Connected to mongo at: ' + mongoURL);
    //         var coll = mongo.collection('dropbox');
    //         console.log("inside the Create Directory")
    //         var username = user;
    //
    //         coll.update({username: user}, {
    //             $push: {
    //                 folders: {
    //                     name: req.body.folder,
    //                     date: Date(),
    //                     parentfolder: req.body.id,
    //                     folderid: req.body.folder,
    //                     starred: null,
    //                     display:"folder"
    //
    //                 }
    //             }
    //         }, function (err, user) {
    //             console.log("inside call back" + user)
    //             if (user) {
    //                 var directory = 'F:/273-LAB2/temp/'+username+ req.body.folder;
    //
    //                 fs.mkdir(directory,function (err) {
    //                     if (err) throw err;
    //                     res.status(201).json({message: "Login successful"});
    //                 })
    //             }
    //             else {
    //                 res.send("File not uploaded Uploaded");
    //             }
    //         });
    //     });
    // }

   // MYSQL CODE
    // console.log(query);
    // var directory = 'E:/273/users/'+user+ req.body.folder;
    //
    //
    //
    // function display(error,display)
    // {
    //     console.log(display);
    //     console.log(error);
    //     if (error)
    //     {
    //         console.log("display-error");
    //         res.status(400).json({message: "Login successful"});
    //     }
    //     else
    //     {
    //         fs.mkdir(directory,function (err) {
    //             if (err) throw err;
    //             res.status(201).json({message: "Login successful"});
    //         })
    //     }
    //
    // }
    // sql.fetch(display,query);

    // KAFKA CODE!

    kafka.make_request('dropbox_createdirectory_topic',
        {"username":user,
            "foldername":req.body.folder,
            "parentid":req.body.id,
            "topic_c":"dropbox_createdirectory_topic_response"}, function(err,results){

            console.log('in create Directory');
            console.log(results);
            if(err){
                res.status(400).json({message: "unsuccessful"});
            }
            else
            {

                if(results.code == 200){

                    res.status(201).json({message: "successful"});
                }
                else {
                    res.status(400).json({message: "unsuccessful"});
                }
            }
        });
});

router.post('/list', function (req, res, next) {

var query1 = " select name,date_format(date, '%e-%b-%y') as date,starred, 'folder' as display from folder where parentfolder is null and userid='"+ user+"';"



    var arrayObj;
    var output ={};

    var temp ={name:'',date:''}
    var folder={};
    var name1;

//MYSQL CODE
//         function display(error,display)
//     {
//         console.log(display);
//         arrayObj= display;
//
//         console.log(arrayObj);
//         output.dis = arrayObj;
//         res.status(201).json({display});
//
// // name:{}
//     }
//     sql.fetch(display,query1);

    kafka.make_request('dropbox_list_topic',
        {"username":user,
            "topic_c":"dropbox_list_topic_response"}, function(err,results){

            console.log('in list Directory');
            console.log(results);
            if(err){
                res.status(400).json({message: "unsuccessful"});
            }
            else
            {
                res.status(201).json({results});
            }
        });

 });

router.post('/childlist', function (req, res, next) {

    var query1 = " select name,date_format(date, '%e-%b-%y') as date,starred, 'folder' as display from folder where parentfolder ='"+req.body.parentid+"' and userid='"+ user+"';"
    console.log(query1)
    var arrayObj;
    var output ={};

    var temp ={name:'',date:''}
    var folder={};
    var name1;
    parentfolderdelete = req.body.parentid;

//     function display(error,display)
//     {
//         console.log(display);
//         arrayObj= display;
//
//         console.log(arrayObj);
//         output.dis = arrayObj;
//         res.status(201).json({display});
//
// // name:{}
//     }
//     sql.fetch(display,query1);

    kafka.make_request('dropbox_childlist_topic',
        {"username":user,
            "parentid":req.body.parentid,
            "topic_c":"dropbox_childlist_topic_response"}, function(err,display){

            console.log('in list Directory');
            console.log(display);
            if(err){
                res.status(400).json({message: "unsuccessful"});
            }
            else
            {
                res.status(201).json({display});
            }
        });

});

// db.dropbox.aggregate([
// {$match: {username:"janhudesai@gmail.com"}},
// {$project:
// {files:{$filter:
// {
//     input:'$files',
//         as:'files',
//     cond:{$eq:['$$files.parentfolder',1]}
// }}
// }}
// ]).pretty();


router.post('/listfiles', function (req, res, next) {


// MYSQL CODE!
    //     var query2 = "select filename as name, date_format(date, '%e-%b-%y') as date, starred,'file' as display from files where parentfolder =1 and userid='"+ user+"';"
//
//     console.log(query2);
//     var arrayObj;
//     var output ={};
//
//     var temp ={name:'',date:''}
//     var folder={};
//     var name1;
//
//     function display(error,display)
//     {
//         console.log(display);
//         arrayObj= display;
//
//         console.log(arrayObj);
//         output.dis = arrayObj;
//         res.status(201).json({display});
//
// // name:{}
//     }
//     sql.fetch(display,query2);




    //MONGO DB CODE
    // var resvariable;
    // mongo.connect(mongoURL, function(){
    //     console.log('Connected to mongo at: ' + mongoURL);
    //     var coll = mongo.collection('dropbox');
    //     console.log("inside the listfiles")
    //
    //     coll.aggregate([
    //         {$match: {username:"harry@gmail.com"}},
    //         {$project:
    //             {files:{$filter:
    //                 {
    //                     input:'$files',
    //                     as:'files',
    //                     cond:{$eq:['$$files.parentfolder',1]}
    //                 }}
    //             }}
    //     ], function(err, user){
    //         //console.log("inside call back"+user)
    //         if (user) {
    //             console.log(user[0].files)
    //             resvariable = user[0].files
    //             res.status(200).json({resvariable});
    //         }
    //         else
    //         {
    //             res.status(401).json({user});
    //         }
    //     });
    // });

    kafka.make_request('dropbox_listfiles_topic',
        {  "username":user,

            "topic_c":"dropbox_listfiles_topic_response"}, function(err,resvariable){

            console.log('in list Files');
            console.log(resvariable);
            if(err){
                res.status(400).json({message: "unsuccessful"});
            }
            else
            {
                res.status(201).json({resvariable});
            }
        });


});

router.post('/childfiles', function (req, res, next) {

    var query2 = "select filename as name, date_format(date, '%e-%b-%y') as date, starred,'file' as display from files where parentfolder = '"+req.body.parentid+"' and userid='"+ user+"';"


    // MYSQL CODE
//
//     var arrayObj;
//     var output ={};
//
//     var temp ={name:'',date:''}
//     var folder={};
//     var name1;
//
//     function display(error,display)
//     {
//         console.log(display);
//         arrayObj= display;
//
//         console.log(arrayObj);
//         output.dis = arrayObj;
//         res.status(201).json({display});
//
// // name:{}
//     }
//     sql.fetch(display,query2);

    kafka.make_request('dropbox_childfiles_topic',
        {"username":user,
            "parentid":req.body.parentid,
            "topic_c":"dropbox_childfiles_topic_response"}, function(err,display){

            console.log('in list Directory');
            console.log(display);
            if(err){
                res.status(400).json({message: "unsuccessful"});
            }
            else
            {
                res.status(201).json({display});
            }
        });

});

router.post('/star', function (req, res, next) {

    var query2 = "select filename as name, date from files where starred is not null and userid='"+ user+"';"



    var arrayObj;
    var output ={};

    var temp ={name:'',date:''}
    var folder={};
    var name1;

    function display(error,display)
    {
        console.log(display);
        arrayObj= display;

        console.log(arrayObj);
        output.dis = arrayObj;
        res.status(201).json({display});

// name:{}
    }
    sql.fetch(display,query2);

});

router.post('/createdirectoryshare', function (req, res, next) {

    // console.log(req.body.folder);
    var today = new Date();
    var dd = today.getDate();

    var mm = today.getMonth()+1;
    var yyyy = today.getFullYear();
    var iscorrect = false;

    if(dd<10)
    {
        dd='0'+dd;
    }

    if(mm<10)
    {
        mm='0'+mm;
    }
    today = yyyy+'-'+mm+'-'+dd;

    var prent =1;
    var child = null;

    var ids =[];
    var split=req.body.members;

    ids = split.split(',');
    console.log("ids:"+ids);


    if (req.body.flag === 'new' ){
    // var query = "insert into folder values ('"+ req.body.folder+ "','" + today+"','"+user+"','"+req.body.folder+"',null,null,null);";
    //
    // for (var i in ids)
    // {
    //     var query = query+ "insert into folder values ('"+ req.body.folder+ "','" + today+"','"+ids[i]+"','"+req.body.folder+ids[i]+"',null,null,null);";
    // }
        ids[ids.length]=user;
    }
    else
    {
        // var query ='';
        // for (var i in ids)
        // {
        //     var query = query+ "insert into folder values ('"+ req.body.folder+ "','" + today+"','"+ids[i]+"','"+req.body.folder+ids[i]+"',null,null,null);";
        // }
    }

    //query = query+"insert into useractivites values ('"+user+"','Shared Folder','"+req.body.folder+"','"+today+"')";
   // console.log(query);

    console.log("ids:"+ids);
    var directory = 'E:/'+user+ req.body.folder;

    // MYSQL CODE
    // function display(error,display)
    // {
    //     console.log(display);
    //     console.log(error);
    //     if (error)
    //     {
    //         console.log("display-error");
    //         res.status(400).json({message: "Not successful"});
    //     }
    //     else
    //     {
    //         fs.mkdir(directory,function (err) {
    //             if (err) throw err;
    //             res.status(201).json({message: "successful"});
    //         })
    //     }
    //
    // }
    // sql.fetch(display,query);

    kafka.make_request('dropbox_createdirectoryshare_topic',
        {"ids":ids,
            "name":req.body.folder,
            "topic_c":"dropbox_createdirectoryshare_topic_response"}, function(err,display){

            console.log('in Share Directory');
            console.log(display);
            if(err){
                res.status(400).json({message: "Not successful"});
            }
            else
            {
                res.status(201).json({message: "successful"});
            }
        });



});

router.post('/fileshare', function (req, res, next) {

    // console.log(req.body.folder);
    var today = new Date();
    var dd = today.getDate();

    var mm = today.getMonth()+1;
    var yyyy = today.getFullYear();
    var iscorrect = false;

    if(dd<10)
    {
        dd='0'+dd;
    }

    if(mm<10)
    {
        mm='0'+mm;
    }
    today = yyyy+'-'+mm+'-'+dd;

    var prent =1;
    var child = null;

    var ids =[];
    var split=req.body.members;

    ids = split.split(',');



        var query ='';
        for (var i in ids)
        {
            var root= 1;
            var query = query+"insert into files values ('"+ req.body.folder+ "','" + today+"','"+ids[i]+"','"+root+"','"+ids[i]+req.body.folder+"',null);";
        }
    query = query+"insert into useractivites values ('"+user+"','Shared File','"+req.body.folder+"','"+today+"')";

    console.log(query);


    // MYSQL CODE
    // function display(error,display)
    // {
    //     console.log(display);
    //     console.log(error);
    //     if (error)
    //     {
    //         console.log("display-error");
    //         res.status(400).json({message: "Not successful"});
    //     }
    //     else
    //     {
    //
    //             res.status(201).json({message: "successful"});
    //
    //     }
    //
    // }
    // sql.fetch(display,query);

    kafka.make_request('dropbox_fileshare_topic',
        {"ids":ids,
            "name":req.body.folder,
            "topic_c":"dropbox_fileshare_topic_response"}, function(err,display){

            console.log('in list Directory');
            console.log(display);
            if(err){
                res.status(400).json({message: "Not successful"});
            }
            else
            {
                res.status(201).json({message: "successful"});
            }
        });


});

router.post('/updatestar', function (req, res, next) {

    // MYSQL CODE!
    // console.log("inside Update Star");
    // console.log(req.body.value);
    // console.log(req.body.name);
    // if (req.body.value =='yes'){
    // var query = "update folder set starred = '"+req.body.value+"' where userid='"+user+"' and name='"+req.body.name+"';";
    // }
    // else
    // {
    //     var query = "update folder set starred = '"+req.body.value+"' where userid='"+user+"' and name='"+req.body.name+"';";
    // }
    // console.log(query);
    //
    //
    // function display(error,display)
    // {
    //     console.log(display);
    //     console.log(error);
    //     if (error)
    //     {
    //         console.log("display");
    //         res.status(400).json({message: "Login successful"});
    //     }
    //     else
    //     {
    //         console.log("display");
    //         res.status(200).json({message: "Login successful"});
    //     }
    //
    // }
    // sql.fetch(display,query);

    kafka.make_request('dropbox_updatestar_topic',
        {"username":user,
            "foldername":req.body.name,
            "value":req.body.value,
            "topic_c":"dropbox_updatestar_topic_response"}, function(err,display){

            console.log('in list Directory');
            console.log(display);
            if(err){
                res.status(400).json({message: "unsuccessful"});
            }
            else
            {
                res.status(200).json({message: "Successful"});
            }
        });
});



router.post('/useractivity', function (req, res, next) {

//     var query1 = " select * from users where userid='"+ user+"';"
//
//
//     function display(error,display)
//     {
//         console.log(display);
//         arrayObj= display;
//
//
//         res.status(201).json({display});
//
// // name:{}
//     }
//     sql.fetch(display,query1);

    kafka.make_request('dropbox_useractivity_topic',
        {"username":user,
            "topic_c":"dropbox_useractivity_topic_response"}, function(err,display){

            console.log('in User Activity');
            console.log(display);
            if(err){
                res.status(400).json({message: "unsuccessful"});
            }
            else
            {
                res.status(201).json({display});
            }
        });

});

router.post('/updateuseractivity', function (req, res, next) {

//     var query1 = " update users set sports = '"+req.body.Sports+"', fname= '"+req.body.fname+"' ,lname= '"+req.body.lname+"',work='"+req.body.work+"',education= '"+req.body.education+"',contact= '"+req.body.contact+"',Music= '"+req.body.Music+"',shows= '"+req.body.Show+"'where userid='"+ user+"';"
//
//
//     function display(error,display)
//     {
//         console.log(display);
//         arrayObj= display;
//
//
//         res.status(201).json({display});
//
// // name:{}
//     }
//     sql.fetch(display,query1);

    kafka.make_request('dropbox_updateuseractivity_topic',
        {"userid":user,
            "password":"",
            "fname":req.body.fname,
            "lname":req.body.lname,
            "work":req.body.work,
            "education":req.body.education,
            "contact":req.body.contact,
            "Music":req.body.Music,
            "shows":req.body.Show,
            "sports":req.body.Sports,
            "topic_c":"dropbox_updateuseractivity_topic_response"}, function(err,display){

            console.log('in User Activity');
            console.log(display);
            if(err){
                res.status(400).json({message: "unsuccessful"});
            }
            else
            {
                res.status(200).json({display});
            }
        });

});

router.post('/updateuseractivity2', function (req, res, next) {

    url = 'E:/273/users/'+req.body.id;
        res.download(url);


});

router.get('/updateuseractivity2', function (req, res, next) {


    res.download(url);


});

router.post('/activity', function (req, res, next) {

//     var query2 = "select userid,activity,filename, date_format(date, '%e-%b-%y') as date from useractivites where userid='"+ user+"' order by date limit 5;"
//
//
//
//     var arrayObj;
//     var output ={};
//
//     var temp ={name:'',date:''}
//     var folder={};
//     var name1;
//
//     function display(error,display)
//     {
//         console.log(display);
//         arrayObj= display;
//
//         console.log(arrayObj);
//         output.dis = arrayObj;
//         res.status(201).json({display});
//
// // name:{}
//     }
//     sql.fetch(display,query2);

    kafka.make_request('dropbox_activity_topic',
        {"username":user,
            "topic_c":"dropbox_activity_topic_response"}, function(err,display){

            console.log('in List Activities');
            console.log(display);
            if(err){
                res.status(400).json({message: "unsuccessful"});
            }
            else
            {
                res.status(201).json({display});
            }
        });

});

router.post('/logout', function (req, res, next) {

    console.log(req.session.user);
    req.session.destroy();
    console.log('Session Destroyed');
    res.status(200).send();

});

router.post('/delete', function (req, res, next) {

    console.log("On DELETE!");
    console.log("parentfolderdelete:"+parentfolderdelete);
    console.log("req objct:"+req.body.name);

    //
    // mongo.connect(mongoURL, function(){
    //     console.log('Connected to mongo at: ' + mongoURL);
    //     var coll = mongo.collection('dropbox');
    //     console.log("inside the Delete");
    //     console.log("Collection"+" "+coll);
    //
    //     coll.update({username: user},{$pull:{folders:{name:req.body.name}}},
    //         function(err, user1){
    //         console.log("inside call back"+user1);
    //
    //         if (user1) {
    //             res.status(201).json({message: "successful"});
    //
    //         } else {
    //             res.status(401).json({message: "unsuccessful"});
    //         }
    //     });
    // });

    kafka.make_request('dropbox_delete_topic',
        {"user":user,
            "name":req.body.name,
            "topic_c":"dropbox_delete_topic_response"}, function(err,display){

            console.log('in Delete');
            console.log(display);
            if(err){
                res.status(400).json({message: "unsuccessful"});
            }
            else
            {
                res.status(201).json({message: "successful"});
            }
        });

});

router.post('/deletefile', function (req, res, next) {

    console.log("On DELETE FILE!");
    console.log("req objct:"+req.body.name);


    // mongo.connect(mongoURL, function(){
    //     console.log('Connected to mongo at: ' + mongoURL);
    //     var coll = mongo.collection('dropbox');
    //     console.log("inside the Delete");
    //     console.log("Collection"+" "+coll);
    //
    //     coll.update({username: user},{$pull:{folders:{name:req.body.name}}},
    //         function(err, user1){
    //         console.log("inside call back"+user1);
    //
    //         if (user1) {
    //             res.status(201).json({message: "successful"});
    //
    //         } else {
    //             res.status(401).json({message: "unsuccessful"});
    //         }
    //     });
    // });

    kafka.make_request('dropbox_deletefile_topic',
        {"user":user,
            "name":req.body.name,
            "topic_c":"dropbox_deletefile_topic_response"}, function(err,display){

            console.log('in Delete File');
            console.log(display);
            if(err){
                res.status(400).json({message: "unsuccessful"});
            }
            else
            {
                res.status(201).json({message: "successful"});
            }
        });



});
module.exports = router;
