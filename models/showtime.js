const sequelize=require("../data/db");
const DataTypes=require("sequelize");


const Showtime=sequelize.define("showTimes",{
    date:{
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    time:{
        type: DataTypes.TIME,
        allowNull: false
    },

});

module.exports=Showtime;