const sequelize=require("../data/db");
const DataTypes=require("sequelize");

const Seat=sequelize.define("seat",{
    seatnumber:{
        type: DataTypes.INTEGER
    },
    isSelected:{
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
})

module.exports=Seat;