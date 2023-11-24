const { Op } = require("sequelize");
const Actor = require("../models/actor");
const Category = require("../models/category");
const Movie = require("../models/movie");
const Saloon = require("../models/saloon");
const Showtime = require("../models/showtime");
const displayPrograms = require("../models/displayprogram");
const sequelize = require("../data/db");
const Saloontype = require("../models/saloontype");
const Ticket = require("../models/ticket");
const Seat = require("../models/seat");
const User = require("../models/user");
const emailService=require("../helpers/send-mail");
const config = require("../config");





exports.get_buy_ticket=async(req,res)=>{
    const movieid=req.params.movieid;
    const saloonId=req.params.saloonid;
    const showtimeid=req.params.showtimeid;
    const message=req.session.message;
    delete req.session.message
    try {
        const movie=await Movie.findByPk(movieid,{attributes:["id","moviename"]});
        const saloon=await Saloon.findByPk(saloonId);
        const showtime=await Showtime.findByPk(showtimeid);
        const seats=await saloon.getSeats();
        const saloontype=await Saloontype.findOne({where: {id: saloon.saloontypeId}});
        const selectedSeats=await Ticket.findAll({where:{ [Op.and]:[{saloonId: saloonId},{showtimeId: showtimeid}]}},{attributes: ["seatId"], raw: true})
        console.log(selectedSeats)
        res.render("user/buy-ticket",{
            title: "Bilet Al",
            movie: movie,
            saloon: saloon,
            showtime:showtime,
            saloontype: saloontype,
            seats: seats,
            message: message,
            selectedSeats: selectedSeats
        })
    } catch (err) {
        console.log(err)
    }
}

exports.post_buy_ticket=async(req,res)=>{
    const movieId=req.body.movieid;
    const saloonId=req.body.saloonid;
    const showtimeId=req.body.showtimeid;
    const seatsIds=req.body.seats;
    const userId=req.session.userId;
    const cardnumber=req.body.cardnumber;
    const cvc=req.body.cvc;
    const namesurname=req.body.namesurname;
    try {
        if(cardnumber=="" || cvc=="" || namesurname==""){
            req.session.message={text:"Lütfen Kart Bilgilerini Girin", class:"warning"};
            return res.redirect(`/on-display/movie/${movieId}/saloon/${saloonId}/showtimes/${showtimeId}`);
        }else{

            if(seatsIds==undefined){
                req.session.message={text:"Lütfen Koltuk Seçin", class:"warning"};
                return res.redirect(`/on-display/movie/${movieId}/saloon/${saloonId}/showtimes/${showtimeId}`);
            }else{
                const ticket=await Ticket.findOne({where:{seatId: seatsIds}});
                if(ticket){
                    req.session.message={text:"Almaya çalıştığınız koltuk dolmuş olabilir lütfen başka bir koltuk seçmeyi deneyin", class:"warning"};
                    return res.redirect(`/on-display/movie/${movieId}/saloon/${saloonId}/showtimes/${showtimeId}`);
                }else{
                    const selectedSeats=await Seat.findAll({where:{id:{[Op.in]:seatsIds}},attributes: ["id"],raw:true});
                    for (let i = 0; i < selectedSeats.length; i++) {
                        const seatid = selectedSeats[i].id;
                        await Ticket.create({userId: userId, saloonId: saloonId, showTimeId: showtimeId, seatId:seatid})   
                    }
                    const user=await User.findByPk(userId,{attributes:["email", "fullname"]})
                    const movie=await Movie.findByPk(movieId,{attributes: ["moviename"]});
                    const saloon=await Saloon.findByPk(saloonId,{attributes: ["saloonname"]});
                    const showtime=await Showtime.findByPk(showtimeId,{attributes: ["date","time"]});
                    
                    await emailService.sendMail({
                        from: config.email.from,
                        to: user.email,
                        subject: "Bilet Satın Alındı",
                        html:`
                        <h3 style="text-align: center;">Bilet Bilgileriniz</h3>
                        <div class="content" style="margin-left: 10px;">
                            <h6>Merhaba ${user.fullname};</h6>
                            <p style="margin-left: 12px;">${showtime.date} / ${showtime.time} tarihinde, ${movie.moviename} adlı filme, ${saloon.saloonname} adlı salonumuzda eşlik edeceksiniz. Sizi aramızda görmekten mutluluk duyuyoruz.</p>
                            <p style="margin-left: 12px;">Bu mail ile beraber gişelerden fiziksel biletinizi alabilirsiniz. Bilet iptali ve daha fazla bilgi için bizimle iletişime geçebilirsiniz.</p>
                        </div>
                        `
                    })
                    
                    req.session.message={text:"Bilet satın alma işleminiz başarılı, bilet ile ilgili detayları mailinize gönderdik. E mailinizi kontrol edebilirsiniz", class:"success"}
                    return res.redirect("/account/settings")
                }
            }
        }
    } catch (err) {
        console.log(err)
    }
}

exports.get_choose_saloon=async(req,res)=>{
    const movieid=req.params.movieid;
    try {
        const movie= await Movie.findByPk(movieid,{include:[{model:Category},{model:Actor},{model: Saloon}]});
        const saloons=await Saloon.findAll({where:{movieId: movieid},include:{model: Saloontype}});
        const saloontypes=await Saloontype.findAll();
        if(saloons.length==0){
            req.session.message={text:"Salon bulunmadı. Detaylı bilgi için firmayla iletişime geçin ya da daha sonra tekrar deneyin.", class:"warning"}
        }
        const message=req.session.message;
        delete req.session.message

        res.render("user/choose-saloon",{
            title: "Salon Seçin",
            movie:movie,
            saloons: saloons,
            saloontypes: saloontypes,
            message: message
        })
    } catch (err) {
        console.log(err)
    }
}

exports.get_choose_showtime=async(req,res)=>{
    const saloonId=req.params.saloonid;
    try {
        console.log("Salon ıd: ",saloonId)
        const saloon=await Saloon.findByPk(saloonId,{include:{model: Movie}});
        const showtimes= await saloon.getShowTimes();
        const saloontypes=await Saloontype.findAll();
        if(showtimes.length==0){
            req.session.message={text:"Seans bulunmadı. Detaylı bilgi için firmayla iletişime geçin ya da daha sonra tekrar deneyin.", class:"warning"}
        }
        const message=req.session.message;
        res.render("user/choose-showtime",{
            title: "Seanslar",
            showtimes:showtimes,
            saloon: saloon,
            saloontypes: saloontypes,
            message: message
        })
    } catch (err) {
        console.log(err)
    }
}

exports.get_on_display_with_category=async(req,res)=>{
    const categoryId=req.params.categoryid;
    try {
        console.log("Category ID: ", categoryId)
        const category=await Category.findByPk(categoryId,{include:[{model: Movie}]})
        const movies= await category.getMovies();
        console.log(movies)
        const categories=await Category.findAll();
        res.render("user/movies-for-category",{
            title: category.categoryname + " " + "Filmleri",
            movies: movies,
            categories: categories,
            category: category
        })
    } catch (err) {
        console.log(err)
    }
}

exports.get_on_display=async(req,res)=>{
    try {
        const movies= await Movie.findAll({include:[{model:Category},{model:Actor}]});
        const categories=await Category.findAll();
        res.render("user/index",{
            title: "Vizyondakiler",
            movies: movies,
            categories: categories
        })
    } catch (err) {
        console.log(err)
    }
}
