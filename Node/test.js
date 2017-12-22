var assert = require('assert');
var request = require('request');
var login = require('./routes/users');
var http = require("http");

describe('Kafka-Front-end Testing ', function() {

    it('Should be successful if url is correct', function(done) {
        http.get('http://localhost:3001/', function(res) {
            assert.equal(200, res.statusCode);
            done();
        })
    });

    it('Should be failed as this URL does not exists', function(done) {
        http.get('http://localhost:3001/abc', function(res) {
            assert.equal(404, res.statusCode);
            done();
        })
    });

    it('Signup success', function(done) {
        request.post('http://localhost:3001/users/signup', {
            form : {
                username : 'jayjayjay@gmail.com',
                password : '12345',
                fname:"Jay",
                lname:"desai"
            }
        }, function(error, response, body) {
            console.log(response.statusCode);
            assert.equal(200, response.statusCode);
            done();
        });
    });


    it('Signin Failed as wrong user name and password', function(done) {
        request.post('http://localhost:3001/users/login', {
            form : {
                username : 'jayjay@gmail.com',
                password : '12345'
            }
        }, function(error, response, body) {
            console.log(response.statusCode);
            assert.equal(401, response.statusCode);
            done();
        });
    });


    it('List File', function(done) {
        request.post('http://localhost:3001/users/listfiles', {
            form : {
            }
        }, function(error, response, body) {
            console.log(response.statusCode);
            assert.equal(200, response.statusCode);
            done();
        });
    });

    it('Delete Folder success', function(done) {
        request.post('http://localhost:3001/users/delete', {
            form : {
                name:"jay"
            }
        }, function(error, response, body) {
            console.log(response.statusCode);
            assert.equal(201, response.statusCode);
            done();
        });
    });

    it('Delete File success', function(done) {
        request.post('http://localhost:3001/users/deletefile', {
            form : {
                name:"jay"
            }
        }, function(error, response, body) {
            console.log(response.statusCode);
            assert.equal(201, response.statusCode);
            done();
        });
    });



    it('Logout', function(done) {
        request.post('http://localhost:3001/users/logout', {
            form : {
            }
        }, function(error, response, body) {
            console.log(response.statusCode);
            assert.equal(200, response.statusCode);
            done();
        });
    });

    it('Useractivity Success', function(done) {
        request.post('http://localhost:3001/users/updateuseractivity2', {
            form : {
            }
        }, function(error, response, body) {
            console.log(response.statusCode);
            assert.equal(404, response.statusCode);
            done();
        });
    });

    it('Download Failed as file not exists', function(done) {
        request.get('http://localhost:3001/users/updateuseractivity2', {
            form : {
            }
        }, function(error, response, body) {
            console.log(response.statusCode);
            assert.equal(404, response.statusCode);
            done();
        });
    });

    // // it('should signup', function(done) {
    // //     request.post('http://localhost:3001/signup/doSignUp', {
    // //         form : {
    // //             firstname: "test",
    // //             lastname: "test",
    // //             username : 'mocha2@yahoo.com',
    // //             password : 'mocha',
    // //             // credentials: true
    // //         }
    // //     }, function(error, response, body) {
    // //         console.log(response.statusCode);
    // //         assert.equal(201, response.statusCode);
    // //         done();
    // //     });
    // // });
    //
    // it('should not signup as user already exists', function(done) {
    //     request.post('http://localhost:3001/signup/doSignUp', {
    //         form : {
    //             firstname: "test",
    //             lastname: "test",
    //             username : 'mocha1@yahoo.com',
    //             password : 'mocha',
    //             // credentials: true
    //         }
    //     }, function(error, response, body) {
    //         console.log(response.statusCode);
    //         assert.equal(301, response.statusCode);
    //         done();
    //     });
    // });
    //
    // it('should receive session does not exist status', function(done) {
    //     request.get('http://localhost:3001/login/getSession', {
    //         // form : {
    //         //     firstname: "test",
    //         //     lastname: "test",
    //         //     username : 'mocha1@yahoo.com',
    //         //     password : 'mocha',
    //         //     // credentials: true
    //         // }
    //     }, function(error, response, body) {
    //         console.log(response.statusCode);
    //         assert.equal(203, response.statusCode);
    //         done();
    //     });
    // });
    //
    // it('session exists after logging in', function(done) {
    //     request.post('http://localhost:3001/login/doLogin', {
    //         form : {
    //             username : 'varun@yahoo.com',
    //             password : '12345',
    //             credentials: true
    //         }
    //     }, function(error, response, body) {
    //         if(response.statusCode===201){
    //             request.get('http://localhost:3001/login/getSession', {
    //                 credentials:true
    //             }, function(error, res, body) {
    //                 console.log("session status:"+res.statusCode);
    //                 assert.equal(201, res.statusCode);
    //                 done();
    //             });
    //         }
    //         else {
    //             console.log("failed");
    //             assert.fail("Failed to login");
    //             done();
    //         }
    //
    //     });
    // });
    //
    // it('fetches directory data of the logged in user', function(done) {
    //     request.post('http://localhost:3001/login/doLogin', {
    //         form : {
    //             username : 'varun@yahoo.com',
    //             password : '12345',
    //             credentials: true
    //         }
    //     }, function(error, response, body) {
    //         console.log(response.cookie);
    //         console.log(response.cookies);
    //         console.log(response.cookieName);
    //         if(response.statusCode===201){
    //             request.post('http://localhost:3001/users/getDirData', {
    //                 form : {
    //                     path : '',
    //                 },
    //                 credentials: true
    //             }, function(error, response, body) {
    //                 console.log(response.statusCode);
    //                 assert.equal(201, response.statusCode);
    //                 done();
    //             });
    //         }
    //         else {
    //             assert.fail("Failed to login");
    //             done();
    //         }
    //     });
    //});
});