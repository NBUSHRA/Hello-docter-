const express = require('express')
const helmet = require('helmet')
const morgan = require('morgan')
const app = express()
 require('dotenv').config()

 const dbConfig = require("./config/dbConfig");
  app.use(express.json());
const userRoute = require("./routes/userRoutes");
const adminRoute  = require('./routes/adminRoutes'); 
const DrRoute = require('./routes/DrRoutes');


 app.use(helmet())
 app.use(morgan('tiny'))
app.use("/api/user", userRoute);
 app.use("/api/admin", adminRoute);
app.use('/api/doctor',DrRoute);


 const port =  process.env.PORT || 5000;








// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})