const sequelize=require("../data/db");
const DataTypes=require("sequelize");

const Role=sequelize.define("role",{
    rolename:{
        type: DataTypes.STRING,
        allowNull: false
    }
});

module.exports=Role