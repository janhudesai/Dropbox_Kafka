var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/dropbox";
const fs = require('fs');


function handle_request(msg, callback) {
    var res = {};
    if (msg.parentid == "null")
    {
         mongo.connect(mongoURL, function() {

            console.log('Connected to mongo at: ' + mongoURL);
            var coll = mongo.collection('dropbox');
            console.log("inside the Fileupload")

            coll.update({username: msg.username}, {
                $push: {
                    files: {
                        name: msg.filename,
                        date: Date(),
                        parentfolder: 1,
                        fileid: msg.filename,
                        starred: null,
                        display:"file"
                    },
                    logs:{
                        userid:msg.username,
                        activity:"Upload File",
                        filename:msg.filename,
                        date: Date()
                    }
                }
            }, function (err, user) {
                console.log("inside call back" + user)
                if (user) {
                    res.code = "200";
                    callback(null, res);

                }
                else {
                    res.code = "400";
                    callback(null, res);
                }
            });
        });

    }
    else
    {

        mongo.connect(mongoURL, function() {

            console.log('Connected to mongo at: ' + mongoURL);
            var coll = mongo.collection('dropbox');
            console.log("inside the Fileupload")

            coll.update({username: msg.username}, {
                $push: {
                    files: {
                        name: msg.filename,
                        date: Date(),
                        parentfolder: msg.parentid,
                        fileid: msg.filename,
                        starred: null,
                        display:"file"
                    },
                    logs:{
                        userid:msg.username,
                        activity:"Upload File",
                        filename:msg.filename,
                        date: Date()
                    }
                }
            }, function (err, user) {
                console.log("inside call back" + user)
                if (user) {
                    res.code = "200";
                    callback(null, res);

                }
                else {
                    res.code = "400";
                    callback(null, res);
                }
            });
        });
    }
}

exports.handle_request = handle_request;