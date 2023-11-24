//modüller
const express=require("express");
const app=express();
const path=require("path")
const cookieParser = require('cookie-parser')
const session=require("express-session");

//tanımlanan moduller
const userRoutes=require("./routes/user");
const authRoutes=require("./routes/auth");
const adminRoutes=require("./routes/admin");
const sequelize=require("./data/db");
const locals=require("./middlewares/locals");

//middlewares
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
app.use(session({
    secret:"hello world",
    resave: false,
    saveUninitialized: false,
    cookie:{
        maxAge: 1000*60*60
    }
}))
app.use(locals)

app.use("/libs", express.static(path.join(__dirname, "node_modules")));
app.use("/static", express.static(path.join(__dirname, "public")));

app.use("/account", authRoutes);
app.use("/admin", adminRoutes);
app.use(userRoutes);

//modeller
const Movie=require("./models/movie");
const Category=require("./models/category");
const Actor=require("./models/actor");
const Saloon=require("./models/saloon");
const Saloontype = require("./models/saloontype");
const Showtime=require("./models/showtime");
const User=require("./models/user");
const Role=require("./models/role");
const Seat = require("./models/seat");
const movieactors=require("./models/movieactor");
const moviecategory=require("./models/moviecategory");
const displayProgram=require("./models/displayprogram");
const Ticket=require("./models/ticket");




//ilşişkiler
Movie.belongsToMany(Category, { through: moviecategory});
Category.belongsToMany(Movie, { through: moviecategory});
Movie.belongsToMany(Actor, { through: movieactors});
Actor.belongsToMany(Movie, { through: movieactors});

Movie.hasMany(Saloon);
Saloon.belongsTo(Movie);

Saloon.belongsToMany(Showtime, { through: displayProgram});
Showtime.belongsToMany(Saloon, { through: displayProgram});

Saloontype.hasMany(Saloon);
Saloon.belongsTo(Saloontype);

Saloon.hasMany(Seat);
Seat.belongsTo(Saloon);


User.belongsToMany(Role,{through: "userRoles"});
Role.belongsToMany(User,{through: "userRoles"});



//test verileri
const dummyData=require("./data/dummy-data");



(async()=>{
   await sequelize.sync({force:true});
   await dummyData();
   
})();

app.listen(3000,()=>{
    console.log("3000 portu bekleniyor");
})