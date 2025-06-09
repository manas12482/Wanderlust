if(process.env.NODE_ENV != "production"){
require('dotenv').config();
}

const dbUrl = process.env.ATLASDB_URL

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path=require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");

// DIFFERENT ROUTES
const listingRouter = require("./routes/listing.js");
const reviewRouter =  require("./routes/review.js");
const userRouter =  require("./routes/user.js");

const Listing = require("./models/Listing.js");


const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");

// FOR AUTHENTICATION AND AUTHORIZATION
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"public")));

const store = MongoStore.create({
  mongoUrl : dbUrl,
  crypto:{
    secret: process.env.SECRET,
  },
  touchAfter:24*3600,
});

store.on("error",()=>{
  console.log("ERROR IN MONGO SESSION STORE",err);
});

const sessionOptions ={
  store,
  secret :process.env.SECRET,
  resave : false,
  saveUninitialized : true,
  cookie: {
    expires : Date.now() + 7*24*60*60*1000,
    maxAge : 7*24*60*60*1000,
    httpOnly : true,
  },
};



app.use(session(sessionOptions));     // USING EXPRESS SESSION
app.use(flash());                     // USING FLASH CONNECT TO DISPLAY FLASH MESSAGES

app.use(passport.initialize());         // IMPLEMENTING PASSPORT FOR AUTHENTICATION
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{                                //middleware for using flash
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
})



main()
.then(()=>{
    console.log("connected to database wanderlust")
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(dbUrl);
}


// Using different routes
  app.use("/listings",listingRouter);
  app.use("/listings/:id/reviews",reviewRouter);
  app.use("/",userRouter);

  //search button
  app.get("/search",async (req,res)=>{
    const location = req.query.q?.trim().toLowerCase();
  
    if (!location) {
      return res.send("Please enter a location.");
    }
  
    try {
      // Case-insensitive search
      const listings = await Listing.find({
        location: { $regex: location, $options: 'i' }
      });
  
      res.render("listings/searchresult.ejs", { results: listings, query: location });
    } catch (err) {
      console.error("Database error:", err);
      res.status(500).send("Server error.");
    }
  });

app.get("/", (req, res) => {
  res.redirect("/listings");
});



// app.all("*", (req, res, next) => {
//  next( new ExpressError (404, "Page not Found"));
// });

app.use((err,req,res,next)=>{
    let {status=500,message="Something went Wrong"}=err;
    // res.status(status).send(message);
    //   res.render("listings/error.ejs",{message});
    res.status(status).render("listings/error.ejs", { message });

});



app.listen(8080,()=>{
    console.log("server is listening to port 8080");
});
