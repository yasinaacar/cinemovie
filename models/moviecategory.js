const sequelize=require("../data/db");
const DataTypes=require("sequelize");

const movieCategories=sequelize.define("movieCategories",{
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    }
})

module.exports=movieCategories