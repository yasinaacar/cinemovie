const Movie=require("../models/movie");
const Category=require("../models/category");
const Saloon=require("../models/saloon");
const Actor = require("../models/actor");
const User = require("../models/user");
const bcrypt=require("bcrypt");
const Role = require("../models/role");
const Saloontype=require("../models/saloontype");
const Showtime = require("../models/showtime");



async function populate(){
    try {
        
        const movies=await Movie.bulkCreate([
            {moviename:"Hızlı ve Öfkeli 10", content:"Hızlı ve Öfkeli 10, Dom Torretto’dan intikam almak için onu sevdiklerini hedef alan bir kötüye karşı zorlu bir mücadeleye girişen Dom ve ekibinin hikayesini konu ediyor.", trailer:"https://www.youtube.com/watch?v=RnJbSIqOQCE&ab_channel=BoxOfficeT%C3%BCrkiye", movieimg:"fast-x.jpg", duration: 185,relasedate:"2023-05-19", visualtype: true, subtitle: true},
            {moviename:"Elif ve Arkadaşları Kapadokya", content:"Elif ve Arkadaşları Kapadokya, Kapadokya'ya okul gezisine giden Elif ve arkadaşlarının hikayesini konu ediyor.", trailer:"https://www.youtube.com/watch?v=G1OEFvbzlzw&ab_channel=BoxOfficeT%C3%BCrkiye", movieimg:"elif-ve-arkadaslari-kapadokya.jpg", duration: 130, relasedate:"2023-04-28", visualtype: false, subtitle: false},
            {moviename:"Örümcek-Adam: Örümcek-Evrenine Geçiş", content:"Spider-Man: Into the Spider-Verse, radyoaktif bir örümcek tarafından ısırılmasıyla bambaşka bir dünyaya adım atıp, özel yeteneklerle donanan Miles Morales'in maceralarını konu ediyor.", trailer:"https://www.youtube.com/watch?v=KtShUXs8Z_s&ab_channel=BoxOfficeT%C3%BCrkiye", duration: 126, movieimg:"orumcek-evrenine-gecis.jpg", relasedate:"2023-06-05", visualtype: true, subtitle: "false"},
        ]);

        const categories=await Category.bulkCreate([
            {categoryname: "Aksiyon"},
            {categoryname: "Animasyon"},
            {categoryname: "Macera"},
            {categoryname: "Çocuk Filmleri"},

        ]);

        const actors=await Actor.bulkCreate([
            {actorname: "Vin Diesel"},
            {actorname: "Dwayne Johnson,"},
            {actorname: "Shameik Moore"},
            {actorname: "Oscar Isaac"},
            {actorname: "İsa Doğmuş"},
            {actorname: "Justin Thompson"},
            
        ]);

        
        const saloons=await Saloon.bulkCreate([
            {saloonname:"S-1", capacity: 40},
            {saloonname:"S-2", capacity: 30},
            {saloonname:"S-3", capacity: 50},
        ])

        const countSaloonType=await Saloontype.count();
        if(countSaloonType==0){
            const saloonTypes= await Saloontype.bulkCreate([
                {typename: "Normal", info:"Rahat Koltuklar", ticketprice:55},
                {typename: "Premium", info:"Ayarlanabilen Açılı Koltuklar, Orta Boy Mısır ve Kola", ticketprice:55},
                {typename: "Gold Class", info:"Yataklı Koltuk, Şarj İstasyonu ve Self Servis Kahve", ticketprice:55},
            ])

            await saloonTypes[0].addSaloon(saloons[0]);
            await saloonTypes[1].addSaloon(saloons[1]);
            await saloonTypes[2].addSaloon(saloons[2]);

            await movies[0].addSaloons(saloons[0]);
            await movies[1].addSaloons(saloons[1]);
            await movies[2].addSaloons(saloons[2]);
        }

        const countShowtime=await Showtime.count();
        if(countShowtime==0){
            const showtimes=await Showtime.bulkCreate([
                {date:"2023-06-14", time:"14:50:00"},
                {date:"2023-06-14", time:"17:00:00"},
                {date:"2023-06-14", time:"19:20:00"}
            ])

            await showtimes[0].addSaloons(saloons[0]);
            await showtimes[1].addSaloons(saloons[1]);
            await showtimes[2].addSaloons(saloons[2]);
        }

        const countRole=await Role.count();
        if(countRole==0){
            const roles=await Role.bulkCreate([
                {rolename: "Admin"},
                {rolename: "Müşteri"}
            ])
            const countUser=await User.count();
            if(countUser==0){
                const users=await User.bulkCreate([
                    {fullname: "Cinemovie", email: "cinemovie1@outlook.com", password: await bcrypt.hash("123456", 10), phone: 5204836719}, //admin kişisi
                    {fullname: "Ayşe Yılmaz", email: "info@ayseyilmaz.com", password: await bcrypt.hash("123456", 10), phone: 5182369745},
                    {fullname: "Mehmet Kaya", email: "info@mehmetkaya.com", password: await bcrypt.hash("123456", 10), phone: 5791028364},
                ])

                await roles[0].addUser(users[0]);
                await roles[1].addUser(users[1]);
                await roles[1].addUser(users[2]);

            }
        }

        await categories[0].addMovie(movies[0]);
        await categories[1].addMovie(movies[1]);
        await categories[1].addMovie(movies[2]);
        await categories[2].addMovie(movies[2]);

        await actors[0].addMovie(movies[0]);
        await actors[0].addMovie(movies[0]);
        await actors[2].addMovie(movies[1]);


    } catch (err) {
        console.log(err)
    }
}

module.exports=populate;