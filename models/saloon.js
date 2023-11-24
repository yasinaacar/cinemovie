const { INTEGER } = require("sequelize");
const sequelize=require("../data/db");
const DataTypes=require("sequelize");

const Saloon=sequelize.define("saloon",{
    saloonname:{
        type: DataTypes.STRING,
        allowNull: false
    },
    capacity:{
        type: DataTypes.INTEGER,
        allowNull: false
    }
})

module.exports=Saloon;