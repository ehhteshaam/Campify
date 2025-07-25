if(process.env.NODE_ENV !=='production') {
    require('dotenv').config()
}


console.log(process.env.SECRET)
console.log(process.env.API_KEY)

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const JOI=require('joi');
const {campgroundSchema, reviewSchema} = require('./schemas.js');
const methodOverride = require('method-override');
const Campground = require('./models/campground');
const ExpressError = require('./utils/ExpressError');
const Review = require('./models/review'); 
const session=require('express-session');
const flash = require('connect-flash');
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');
const passport =  require('passport');
const LocalStrategy =  require('passport-local');
const User = require('./models/user');
const userRoutes = require('./routes/users');
const helmet = require("helmet");
const dburl=process.env.DB_URL || 'mongodb://localhost:27017/Campify';
const MongoDBStore = require("connect-mongo")(session);

const scriptSrcUrls = [
    "https://cdn.jsdelivr.net",
    "https://stackpath.bootstrapcdn.com",
    "https://api.mapbox.com",
    "https://kit.fontawesome.com",
    "https://cdnjs.cloudflare.com",
    "https://res.cloudinary.com", // for Cloudinary images
    "https://cdn.maptiler.com"
];

const styleSrcUrls = [
    "https://kit-free.fontawesome.com",
    "https://stackpath.bootstrapcdn.com",
    "https://api.mapbox.com",
    "https://cdn.jsdelivr.net",
    "https://fonts.googleapis.com",
    "https://cdn.maptiler.com"
];

const connectSrcUrls = [
    "https://*.tiles.mapbox.com",
    "https://api.mapbox.com",
    "https://events.mapbox.com",
    "https://api.maptiler.com"
];

const fontSrcUrls = [
    "https://fonts.gstatic.com"
];



// 'mongodb://localhost:27017/Campify'
const mongoSanitize = require('express-mongo-sanitize');
mongoose.connect(dburl);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(mongoSanitize({
    replaceWith: '_'
}))

const secret=process.env.SECRET ||'thisshouldbeabettersecret';

const store = new MongoDBStore({
    url:dburl,
    secret,
    touchAfter: 24*60*60
});

store.on("error",function(e){
    console.log("SESSION STORE ERROR!",e)
})


const sessionConfig = {
    store,
    name:'session',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie:{
        httpOnly:true,
        // secure: true,
        expires: Date.now() + 100*60*60*24*7,
        maxAge: 100*60*60*24*7
    }
}
app.use(session(sessionConfig))
app.use(flash());
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com", // replace with your Cloudinary cloud name
                "https://images.unsplash.com"
            ],
            fontSrc: ["'self'", ...fontSrcUrls]
        },
    })
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next) => {
    res.locals.currentUser = req.user;
    res.locals.success=req.flash('success');
    res.locals.error=req.flash('error');
    next();
})

app.get('/fakeUser', async (req, res) => {
    try {
        let user = await User.findOne({ username: 'ehhteshaam' });

        if (!user) {
            user = new User({ email: 'ehhteshaam@gmail.com', username: 'ehhteshaam' });
            await User.register(user, 'chicken');
        }

        res.send(user); // show user info (with _id, username, email)
    } catch (e) {
        res.send(e.message); // catch other errors
    }
});


app.use('/',userRoutes);
app.use('/campgrounds',campgroundRoutes);
app.use('/campgrounds/:id/reviews',reviewRoutes);

app.get('/', (req, res) => {
    res.render('home')
});
app.get('/about', (req, res) => {
    res.render('about');
});



app.all(/(.*)/, (req, res, next) => {
    next(new ExpressError('Page Not Found',404))
})

app.use((err, req, res,  next) =>{
    const { statusCode=500}= err;
    if(! err.message) err.message = 'Oh No, Something went wrong'
    res.status(statusCode).render('error',{ err });
})

app.listen(3000, () => {
    console.log('Serving on port 3000')
})


