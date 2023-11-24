const { DATEONLY } = require("sequelize");
const sequelize=require("../data/db");
const DataTypes=require("sequelize");

const Movie=sequelize.define("movie",{
    moviename:{
        type: DataTypes.STRING,
        allowNull: false
    },
    content:{
        type: DataTypes.TEXT
    },
    trailer:{
        type: DataTypes.STRING
    },
    movieimg:{
        type: DataTypes.STRING
    },
    duration:{
        type: DataTypes.STRING
    },
    relasedate:{
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    visualtype:{
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    subtitle:{
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }

},{timestamps: true})

module.exports=Movie;