var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/dropbox";

function handle_request(msg, callback) {

    var resvariable;
    mongo.connect(mongoURL, function () {
        console.log('Connected to mongo at: ' + mongoURL);
        var coll = mongo.collection('dropbox');
        console.log("inside the Update User Activites");

        coll.update({username:msg.userid},
            {$set:{"details.0":{
                    userid:msg.userid,
                    password:msg.password,
                    fname:msg.fname,
                    lname:msg.lname,
                    work:msg.work,
                    education:msg.education,
                    contact:msg.contact,
                    Music:msg.Music,
                    shows:msg.shows,
                    sports:msg.sports
        }}}, function (err, user) {
            console.log("inside call back"+user)
            if (!err) {
                callback(null, user);
            }
            else {
                callback(null, user);
            }
        });
    });
}

exports.handle_request = handle_request;