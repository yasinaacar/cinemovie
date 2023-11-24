const sequelize=require("../data/db");
const DataTypes=require("sequelize");

const Category=sequelize.define("category",{
    categoryname:{
        type: DataTypes.STRING,
        allowNull: false
    }
})

module.exports=Category;