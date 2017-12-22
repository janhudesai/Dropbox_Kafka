var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/dropbox";
const fs = require('fs');


function handle_request(msg, callback) {
    var res = {};

        mongo.connect(mongoURL, function() {

            console.log('Connected to mongo at: ' + mongoURL);
            var coll = mongo.collection('dropbox');
            console.log("inside the File share");
            console.log(msg.ids);

            coll.find({username:{$in:msg.ids}}).forEach( function(myDoc) {
                coll.update({username: myDoc.username},{$push:{files: {
                    name:msg.name,
                    date: Date(),
                    parentfolder: 1,
                    fileid: msg.name,
                    starred: null,
                    display:"file"
                },
                    logs:{
                        userid:myDoc.username,
                        activity:"Share File",
                        filename:msg.name,
                        date: Date()
                    }}}); } ,
                function (err, user) {
                console.log("inside call back" + user)
                if (!err) {
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

exports.handle_request = handle_request;