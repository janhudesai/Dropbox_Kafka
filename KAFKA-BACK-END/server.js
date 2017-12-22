var connection =  new require('./kafka/Connection');
var login = require('./services/login');
var signup = require('./services/signup');
var createdirectory = require('./services/createdirectory');
var listdirectory = require('./services/list');
var listfiles = require('./services/listfiles');
var uploadfiles = require('./services/fileupload');
var childlist = require('./services/childlist');
var childfiles = require('./services/childfiles');
var updatestar = require('./services/updatestar');
var fileshare = require('./services/fileshare');
var directoryshare = require('./services/createdirectoryshare');
var useractivity = require('./services/useractivity');
var updateuseractivity = require('./services/updateuseractivity');
var activity = require('./services/activity');
var ondelete = require('./services/delete');
var ondeletefile = require('./services/deletefile');

// changes started for JMETER
var mongo = require("./services/mongo");
var mongoURL = "mongodb://localhost:27017/dropbox";
var coll;

mongo.connect(mongoURL, function () {
    console.log('Connected to mongo at: ' + mongoURL);
    coll = mongo.collection('dropbox');
});

// changes ends for JMETER

var topic_name = 'dropbox_login_topic';
var consumer = connection.getConsumer(topic_name);

// Adding Signup topic
consumer.addTopics(['dropbox_signup_topic'], function (error, done) {
    console.log(error, done);
});

// Adding createdirectory topic
consumer.addTopics(['dropbox_createdirectory_topic'], function (error, done) {
    console.log(error, done);
});

// Adding list directory topic
consumer.addTopics(['dropbox_list_topic'], function (error, done) {
    console.log(error, done);
});

// Adding list Files topic
consumer.addTopics(['dropbox_listfiles_topic'], function (error, done) {
    console.log(error, done);
});

// Adding Child list Files topic
consumer.addTopics(['dropbox_childlist_topic'], function (error, done) {
    console.log(error, done);
});

// Adding upload Files topic
consumer.addTopics(['dropbox_fileupload_topic'], function (error, done) {
    console.log(error, done);
});

// Adding Child Files topic
consumer.addTopics(['dropbox_childfiles_topic'], function (error, done) {
    console.log(error, done);
});

// Adding Child Files topic
consumer.addTopics(['dropbox_updatestar_topic'], function (error, done) {
    console.log(error, done);
});

// Adding File share topic
consumer.addTopics(['dropbox_fileshare_topic'], function (error, done) {
    console.log(error, done);
});

consumer.addTopics(['dropbox_createdirectoryshare_topic'], function (error, done) {
    console.log(error, done);
});

consumer.addTopics(['dropbox_useractivity_topic'], function (error, done) {
    console.log(error, done);
});

consumer.addTopics(['dropbox_updateuseractivity_topic'], function (error, done) {
    console.log(error, done);
});

consumer.addTopics(['dropbox_activity_topic'], function (error, done) {
    console.log(error, done);
});

consumer.addTopics(['dropbox_delete_topic'], function (error, done) {
    console.log(error, done);
});

consumer.addTopics(['dropbox_deletefile_topic'], function (error, done) {
    console.log(error, done);
});

var producer = connection.getProducer();

console.log('server is running');
consumer.on('message', function (message) {
    console.log('message received');
    console.log(JSON.stringify(message.value));

    console.log(JSON.stringify(message.replyTo));
    var data = JSON.parse(message.value);
    console.log(data.data.topic_c);
    if (data.data.topic_c == "dropbox_login_topic_response") {
        login.handle_request(data.data, function (err, res) {
            console.log('after handle' + res);
            var payloads = [
                {
                    topic: data.replyTo,
                    messages: JSON.stringify({
                        correlationId: data.correlationId,
                        data: res
                    }),
                    partition: 0
                }
            ];
            producer.send(payloads, function (err, data) {
                console.log(data);
            });
            return;
        });
    }
    if (data.data.topic_c == "dropbox_signup_topic_response") {
        signup.handle_request(data.data, function (err, res) {
            console.log('after sign up handle' + res);
            var payloads = [
                {
                    topic: data.replyTo,
                    messages: JSON.stringify({
                        correlationId: data.correlationId,
                        data: res
                    }),
                    partition: 0
                }
            ];
            producer.send(payloads, function (err, data) {
                console.log(data);
            });
            return;
        });
    }

    if (data.data.topic_c == "dropbox_createdirectory_topic_response") {
        createdirectory.handle_request(data.data, function (err, res) {
            console.log('after sign up handle' + res);
            var payloads = [
                {
                    topic: data.replyTo,
                    messages: JSON.stringify({
                        correlationId: data.correlationId,
                        data: res
                    }),
                    partition: 0
                }
            ];
            producer.send(payloads, function (err, data) {
                console.log(data);
            });
            return;
        });
    }

    if (data.data.topic_c == "dropbox_list_topic_response") {
        listdirectory.handle_request(data.data, function (err, res) {
            console.log('after handle' + res);
            var payloads = [
                {
                    topic: data.replyTo,
                    messages: JSON.stringify({
                        correlationId: data.correlationId,
                        data: res
                    }),
                    partition: 0
                }
            ];
            producer.send(payloads, function (err, data) {
                console.log(data);
            });
            return;
        });
    }

    if (data.data.topic_c == "dropbox_listfiles_topic_response") {
        listfiles.handle_request(data.data, function (err, res) {
            console.log('after sign up handle' + res);
            var payloads = [
                {
                    topic: data.replyTo,
                    messages: JSON.stringify({
                        correlationId: data.correlationId,
                        data: res
                    }),
                    partition: 0
                }
            ];
            producer.send(payloads, function (err, data) {
                console.log(data);
            });
            return;
        });
    }

    if (data.data.topic_c == "dropbox_fileupload_topic_response") {
        uploadfiles.handle_request(data.data, function (err, res) {
            console.log('after sign up handle' + res);
            var payloads = [
                {
                    topic: data.replyTo,
                    messages: JSON.stringify({
                        correlationId: data.correlationId,
                        data: res
                    }),
                    partition: 0
                }
            ];
            producer.send(payloads, function (err, data) {
                console.log(data);
            });
            return;
        });
    }

    if (data.data.topic_c == "dropbox_childlist_topic_response") {
        childlist.handle_request(data.data, function (err, res) {
            console.log('after sign up handle' + res);
            var payloads = [
                {
                    topic: data.replyTo,
                    messages: JSON.stringify({
                        correlationId: data.correlationId,
                        data: res
                    }),
                    partition: 0
                }
            ];
            producer.send(payloads, function (err, data) {
                console.log(data);
            });
            return;
        });
    }

    if (data.data.topic_c == "dropbox_childfiles_topic_response") {
        childfiles.handle_request(data.data, function (err, res) {
            console.log('after sign up handle' + res);
            var payloads = [
                {
                    topic: data.replyTo,
                    messages: JSON.stringify({
                        correlationId: data.correlationId,
                        data: res
                    }),
                    partition: 0
                }
            ];
            producer.send(payloads, function (err, data) {
                console.log(data);
            });
            return;
        });
    }

    if (data.data.topic_c == "dropbox_updatestar_topic_response") {
        updatestar.handle_request(data.data, function (err, res) {
            console.log('after sign up handle' + res);
            var payloads = [
                {
                    topic: data.replyTo,
                    messages: JSON.stringify({
                        correlationId: data.correlationId,
                        data: res
                    }),
                    partition: 0
                }
            ];
            producer.send(payloads, function (err, data) {
                console.log(data);
            });
            return;
        });
    }

    if (data.data.topic_c == "dropbox_fileshare_topic_response") {
        fileshare.handle_request(data.data, function (err, res) {
            console.log('after sign up handle' + res);
            var payloads = [
                {
                    topic: data.replyTo,
                    messages: JSON.stringify({
                        correlationId: data.correlationId,
                        data: res
                    }),
                    partition: 0
                }
            ];
            producer.send(payloads, function (err, data) {
                console.log(data);
            });
            return;
        });
    }

    if (data.data.topic_c == "dropbox_createdirectoryshare_topic_response") {
        directoryshare.handle_request(data.data, function (err, res) {
            console.log('Directory share' + res);
            var payloads = [
                {
                    topic: data.replyTo,
                    messages: JSON.stringify({
                        correlationId: data.correlationId,
                        data: res
                    }),
                    partition: 0
                }
            ];
            producer.send(payloads, function (err, data) {
                console.log(data);
            });
            return;
        });
    }

    if (data.data.topic_c == "dropbox_useractivity_topic_response") {
        useractivity.handle_request(data.data, function (err, res) {
            console.log('Directory share' + res);
            var payloads = [
                {
                    topic: data.replyTo,
                    messages: JSON.stringify({
                        correlationId: data.correlationId,
                        data: res
                    }),
                    partition: 0
                }
            ];
            producer.send(payloads, function (err, data) {
                console.log(data);
            });
            return;
        });
    }

    if (data.data.topic_c == "dropbox_updateuseractivity_topic_response") {
        updateuseractivity.handle_request(data.data, function (err, res) {
            console.log('Directory share' + res);
            var payloads = [
                {
                    topic: data.replyTo,
                    messages: JSON.stringify({
                        correlationId: data.correlationId,
                        data: res
                    }),
                    partition: 0
                }
            ];
            producer.send(payloads, function (err, data) {
                console.log(data);
            });
            return;
        });
    }

    if (data.data.topic_c == "dropbox_activity_topic_response") {
        activity.handle_request(data.data, function (err, res) {
            console.log('Directory share' + res);
            var payloads = [
                {
                    topic: data.replyTo,
                    messages: JSON.stringify({
                        correlationId: data.correlationId,
                        data: res
                    }),
                    partition: 0
                }
            ];
            producer.send(payloads, function (err, data) {
                console.log(data);
            });
            return;
        });
    }

    if (data.data.topic_c == "dropbox_delete_topic_response") {
        ondelete.handle_request(data.data, function (err, res) {
            console.log('Directory share' + res);
            var payloads = [
                {
                    topic: data.replyTo,
                    messages: JSON.stringify({
                        correlationId: data.correlationId,
                        data: res
                    }),
                    partition: 0
                }
            ];
            producer.send(payloads, function (err, data) {
                console.log(data);
            });
            return;
        });
    }

    if (data.data.topic_c == "dropbox_deletefile_topic_response") {
        ondeletefile.handle_request(data.data, function (err, res) {
            console.log('Directory share' + res);
            var payloads = [
                {
                    topic: data.replyTo,
                    messages: JSON.stringify({
                        correlationId: data.correlationId,
                        data: res
                    }),
                    partition: 0
                }
            ];
            producer.send(payloads, function (err, data) {
                console.log(data);
            });
            return;
        });
    }
});