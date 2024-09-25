const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_DB_STRING)
.then().catch((e)=>{
console.log(e);
});