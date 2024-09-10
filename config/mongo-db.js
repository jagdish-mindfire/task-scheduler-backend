const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_DB_STRING)
.then(() => console.log('Connected to MonGodb')).catch((e)=>{
console.log(e);
});