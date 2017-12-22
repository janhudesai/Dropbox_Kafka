var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/dropbox";

function handle_request(msg, callback) {

    var resvariable;
    mongo.connect(mongoURL, function () {
        console.log('Connected to mongo at: ' + mongoURL);
        var coll = mongo.collection('dropbox');
        console.log("inside the User Activites");
        console.log(msg.username);

        coll.aggregate([
            {$match: {username: msg.username}},
            {
                $project:
                    {
                        details: {
                            $filter:
                                {
                                    input: '$details',
                                    as: 'details'
                                    ,
                                    cond: {$eq: ['$$details.userid',  msg.username]}
                                }
                        }
                    }
            }
        ], function (err, user) {
            console.log("inside call back"+user)
            if (!err) {
                console.log(user[0].details);
                resvariable = user[0].details;
                console.log("output:"+resvariable);
                callback(null, resvariable);
            }
            else {
                callback(null, resvariable);
            }
        });
    });
}

exports.handle_request = handle_request;