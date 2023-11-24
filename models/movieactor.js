const sequelize=require("../data/db");
const DataTypes=require("sequelize");

const movieActors=sequelize.define("movieActors",{
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    }
});

module.exports=movieActors