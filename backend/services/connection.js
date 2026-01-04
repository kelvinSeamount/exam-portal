
var mongoose = require("mongoose");
var config = require('config');
const adminService = require("../services/admin");


//database connection
const mongoUri = process.env.MONGODB_URI || config.get('mongodb.connectionString');
console.log('DEBUG - MONGODB_URI from env:', process.env.MONGODB_URI ? 'EXISTS' : 'MISSING');
console.log('DEBUG - Using connection:', mongoUri.substring(0, 50) + '...');

mongoose.Promise = global.Promise;
let options = {
  useNewUrlParser: true,
  useUnifiedTopology: true
};

if(process.env.NODE_ENV==="docker") {
  options.authSource = config.get('mongodb.authDB')
}

mongoose.connect(mongoUri, options).then(()=>{
    console.log("connected to mongoDB");
    adminService.addAdminIfNotFound();
    
}).catch((err)=>{
    console.log("Error connecting to database",err);
})


module.exports=mongoose;