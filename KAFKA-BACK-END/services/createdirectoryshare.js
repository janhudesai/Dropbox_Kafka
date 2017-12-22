var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/dropbox";
const fs = require('fs');


function handle_request(msg, callback) {
    var res = {};
    var directory;

    mongo.connect(mongoURL, function() {

        console.log('Connected to mongo at: ' + mongoURL);
        var coll = mongo.collection('dropbox');
        console.log("inside the Folder share");
        console.log(msg.ids);

        coll.find({username:{$in:msg.ids}}).forEach( function(myDoc) {
                coll.update({username: myDoc.username},{$push:{folders: {
                    name:msg.name,
                    date: Date(),
                    parentfolder: null,
                    fileid: msg.name,
                    starred: null,
                    display:"folder"
                },
                    logs:{
                        userid:myDoc.username,
                        activity:"Share Directory",
                        filename:msg.name,
                        date: Date()
                    }}}); } ,
            function (err, user) {
                console.log("inside call back" + user)
                if (!err) {
                    res.code = "200";
                    for (var i in msg.ids)
                         {
                             console.log("inside Create share directory");
                             directory  = 'F:/273-LAB2/temp/'+msg.ids[i]+ msg.name;
                             console.log(directory);
                             fs.mkdir(directory,function (err) {
                                          if (err) throw err;
                                 console.log("inside FS- Create share directory");
                                      })
                         }

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