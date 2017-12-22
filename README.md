# Dropbox

Dropbox Prototype developed using ReactJs, NodeJs, Kafka, MongoDB

# Functionality 

  * Signup new user
  * Sign in existing user
  * Upload a file 
  * List a file 
  * Create a directory
  * Star a folder/directory
  * Share a folder/directory byemail/name/link
  * Create group
  * Add member in agroup
  * Show members in group
  * Assign access permission to adirectory
  * Delete member from agroup
  

Steps to start Application-

Start Zookeeper Instance.
zookeeper-server-start.bat ..\..\config\zookeeper.properties

Start Kakfka Server
kafka-server-start.bat ..\..\config\server.properties

Create Topics.
Please refer KAFKA_TOPICS.txt file.

Start Mongo Server
mongod 
 
Start React app-
1. npm install
2. npm start

Start Kafka Front end-
1. npm install
2. npm start

Start Kafka Back end-
1. npm install
2. npm start

