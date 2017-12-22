var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/dropbox";

function handle_request(msg, callback) {

    var resvariable;
    mongo.connect(mongoURL, function () {
        console.log('Connected to mongo at: ' + mongoURL);
        var coll = mongo.collection('dropbox');
        console.log("inside the listfiles")

        coll.aggregate([
            {$match: {username: msg.username}},
            {
                $project:
                    {
                        files: {
                            $filter:
                                {
                                    input: '$files',
                                    as: 'files',
                                    cond: {$eq: ['$$files.parentfolder', msg.parentid]}
                                }
                        }
                    }
            }
        ], function (err, user) {
            //console.log("inside call back"+user)
            if (user) {
                console.log(user[0].files);
                resvariable = user[0].files;
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