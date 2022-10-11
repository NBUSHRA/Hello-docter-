 const mongoose = require('mongoose');
 mongoose.connect(process.env.MONGO_URL)
 const connection  = mongoose.connection;
 connection.on('connected' , () => {
    console.log('MongoDB is connected');
 });

 connection.on('error' , (error) => {
    console.log( 'Error in MongoDB connection', error);
 })




// const mongoose = require('mongoose');
// module.exports = ()=>{
//     mongoose.connect(process.env.MONGO_URL).then(()=>{
//         console.log('connect to DB')
//     }).catch((err)=>{
//         throw err
//     })
// }

 module.exports = mongoose;