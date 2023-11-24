const sequelize=require("../data/db");
const DataTypes=require("sequelize");
const Saloon = require("./saloon");
const Showtime = require("./showtime");
const Seat = require("./seat");
const User = require("./user");

const Ticket=sequelize.define("ticket",{
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: 'id'
      },
      allowNull: false
    },
    saloonId: {
        type: DataTypes.INTEGER,
        references: {
          model: Saloon,
          key: 'id'
        },
        allowNull: false
    },
    showTimeId: {
        type: DataTypes.INTEGER,
        references: {
          model: Showtime,
          key: 'id'
        },
        allowNull: false
    },
    seatId: {
        type: DataTypes.INTEGER,
        references: {
          model: Seat,
          key: 'id'
        },
        allowNull: false
    },
})

module.exports=Ticket;