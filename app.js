const express = require('express');
const mongoose = require('mongoose');
const session=require('express-session')
const MongoStore = require('connect-mongo');
const pageRoute = require('./routes/pageRoute');
const jobRoute = require('./routes/jobRoute');
const categoryRoute=require('./routes/categoryRoute')
const userRoute=require('./routes/userRoute')

const app = express();

//Template Engine
app.set('view engine', 'ejs');

//Connnect DB
mongoose
  .connect('mongodb://localhost/CI-project', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => {
    console.log('DB connected');
  });

  //Global
global.userIN=null

//Middlewares

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'my_keyboard_cat',
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({ mongoUrl: 'mongodb://localhost/CI-project' })//Kod değişikliğinde kullanıcının çıkışını engeller.
  //DBye session açar orda saklar
 
}))
app.use('*',(req,res,next)=>{
  userIN=req.session.userID;//userin değişkenine id atarsak kontrolde true dönecektir.
  next();
})

//Routes
app.use('/', pageRoute);
app.use('/jobs', jobRoute);
app.use('/categories', categoryRoute);
app.use('/users', userRoute);

const port = 3000;
app.listen(port, () => {
  console.log(`App created at ${port}`);
});
