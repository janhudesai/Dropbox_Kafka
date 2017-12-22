var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/dropbox";
const fs = require('fs');


function handle_request(msg, callback) {

    var res = {};
    if (msg.parentid == null) {
        // var query = "insert into folder values ('"+ req.body.folder+ "','" + today+"','"+user+"','"+req.body.folder+"',null,null,null);";
        // query= query+"insert into useractivites values ('"+user+"','Created Folder','"+req.body.folder+"','"+today+"')";

        mongo.connect(mongoURL, function () {

            console.log('Connected to mongo at: ' + mongoURL);
            var coll = mongo.collection('dropbox');
            console.log("inside the Create Directory")
            var username = msg.username;

            coll.update({username: username}, {
                $push: {
                    folders: {
                        name: msg.foldername,
                        date: Date(),
                        parentfolder: null,
                        folderid: msg.foldername,
                        starred: null,
                        display: "folder"

                    },
                    logs:{
                        userid:username,
                        activity:"Create Directory",
                        filename:msg.foldername,
                        date: Date()
                    }
                }
            }, function (err, user) {
                console.log("inside call back" + user)
                if (user) {
                    var directory = 'F:/273-LAB2/temp/' + username + msg.foldername;

                    fs.mkdir(directory, function (err) {
                        if (err) {};
                        res.code = "200";
                        res.value = "Success";
                        callback(null, res);
                    })
                }
                else {
                    res.code = "400";
                    res.value = "Failed";
                    callback(null, res);
                }
            });
        });
    }
    else {
        // var query = "insert into folder values ('"+ req.body.folder+ "','" + today+"','"+user+"','"+req.body.folder+"','"+req.body.id+"',null,null);";
        // query= query+"insert into useractivites values ('"+user+"','Created Folder','"+req.body.folder+"','"+today+"')";

        mongo.connect(mongoURL, function () {

            console.log('Connected to mongo at: ' + mongoURL);
            var coll = mongo.collection('dropbox');
            console.log("inside the Create Directory")
            var username = msg.username;

            coll.update({username: username}, {
                $push: {
                    folders: {
                        name: msg.foldername,
                        date: Date(),
                        parentfolder: msg.parentid,
                        folderid: msg.foldername,
                        starred: null,
                        display: "folder"

                    },
                    logs:{
                        userid:username,
                        activity:"Create Directory",
                        filename:msg.foldername,
                        date: Date()
                    }
                }
            }, function (err, user) {
                console.log("inside call back" + user)
                if (user) {
                    var directory = 'F:/273-LAB2/temp/' + username + msg.foldername;

                    fs.mkdir(directory, function (err) {
                        if (err) throw err;
                        res.code = "200";
                        res.value = "Success";
                        callback(null, res);
                    })
                }
                else {
                    res.code = "400";
                    res.value = "failed";
                    callback(null, res);
                }
            });
        });
    }
}

exports.handle_request = handle_request;