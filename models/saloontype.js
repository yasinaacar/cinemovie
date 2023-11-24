const sequelize=require("../data/db");
const DataTypes=require("sequelize");

const Saloontype=sequelize.define("saloontype",{
    typename:{
        type: DataTypes.STRING,
    },
    info: {
        type: DataTypes.STRING,
    },
    ticketprice:{
        type: DataTypes.INTEGER
    }
})

module.exports=Saloontype;