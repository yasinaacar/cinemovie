const sequelize=require("../data/db");
const DataTypes=require("sequelize");

const displayPrograms=sequelize.define("displayPrograms",{
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    }
});

module.exports=displayPrograms