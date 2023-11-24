const config=require("../config");
const Sequelize= require("sequelize");


const sequelize= new Sequelize(config.db.database, config.db.user, config.db.password,{
    host: config.db.host,
    dialect: "mysql",
    define:{
        timestamps: false
    }
})

async function connect(){
    try{
        await sequelize.authenticate();
        return console.log("Veri tabanına bağlanıldı...")

    }catch(err){
        console.log("Veri tabanı bağlantısı BAŞARISIZ!!!", err)
    }
}

connect()

module.exports=sequelize;