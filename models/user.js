const sequelize=require("../data/db");
const DataTypes=require("sequelize");


const User=sequelize.define("user",{
    fullname:{
        type: DataTypes.STRING,
        allowNull: false
    },
    email:{
        type: DataTypes.STRING,
        allowNull: false
    },
    password:{
        type: DataTypes.STRING,
        allowNull: false
    },
    phone:{
        type: DataTypes.STRING,
    },
    resetToken:{
        type: DataTypes.STRING,
    },
    resetTokenExpiration:{
        type: DataTypes.DATE
    }
})


module.exports=User;