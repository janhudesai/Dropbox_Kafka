var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/dropbox";
var CryptoJS = require("crypto-js");
var kafka = require('./kafka/client');

module.exports = function(passport) {
    passport.use('login', new LocalStrategy(function(username   , password, done) {
        try {
            mongo.connect(mongoURL, function(){
                console.log('Connected to mongo at: ' + mongoURL);
                var coll = mongo.collection('dropbox');
                console.log("inside the Login")
                console.log("Uname"+" "+username);
                console.log("password"+" "+password);
                console.log("Collection"+" "+coll);

                var bytes  = CryptoJS.AES.decrypt(password.toString(), '123');
                var plaintext = bytes.toString(CryptoJS.enc.Utf8);
                console.log("plaintext:"+plaintext);

                // coll.findOne({username: username, password:plaintext}, function(err, user){
                //     console.log("inside call back"+user)
                //     if (user) {
                //         done(null, {username: username, password: password});
                //
                //     } else {
                //         done(null, false);
                //     }
                // });

                kafka.make_request('dropbox_login_topic',
                                    {"username":username,
                                     "password":plaintext,"topic_c":"dropbox_login_topic_response"}, function(err,results){
                    console.log('in result');
                    console.log(results);
                    if(err){
                        done(null, false);
                    }
                    else
                    {

                        if(results.code == 200){
                            done(null, {username: username, password: password});
                        }
                        else {
                            done(null, false);
                        }
                    }
                });
            });
        }
        catch (e){
            done(e,{});
        }
    }));
};


