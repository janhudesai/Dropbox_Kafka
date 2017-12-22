var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/dropbox";

function handle_request(msg, callback){

    var res = {};
    // console.log("In sign up handle request:"+ JSON.stringify(msg));
    //
    //
    //     res.code = "200";
    //     res.value = "Success Login";
    //
    //
    //
    // callback(null, res);

    mongo.connect(mongoURL, function(){
        console.log('Connected to mongo at: ' + mongoURL);
        var coll = mongo.collection('dropbox');
        console.log("inside the Signup");
        console.log("Collection"+" "+coll);

        coll.insert({username: msg.username,
                        password:msg.password,
                        firstname:msg.fname,
                        lastname:msg.lname,
                        files:[],
                        folders:[],
                        details:[{"userid":msg.username}],
            logs:[]}, function(err, user){
            console.log("inside signup call back"+user)
            if (user) {
                res.code = "200";
                res.value = "Success signup";
                callback(null, res);
            }
            else
                {
                    res.code = "400";
                    res.value = "Failed signup";
                    callback(null, res);
            }
        });
    });


}

exports.handle_request = handle_request;