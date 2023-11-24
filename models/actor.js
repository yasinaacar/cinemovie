const sequelize=require("../data/db");
const DataTypes=require("sequelize");

const Actor=sequelize.define("actor",{
    actorname:{
        type: DataTypes.STRING,
        allowNull: false
    }
})

module.exports=Actor;