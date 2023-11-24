const Movie = require("../models/movie");
const Category = require("../models/category");
const Saloon = require("../models/saloon");
const fs=require("fs");
const { Op } = require("sequelize");
const Actor = require("../models/actor");
const sequelize = require("../data/db");
const Showtime = require("../models/showtime");
const Role = require("../models/role");
const User = require("../models/user");
const { raw } = require("express");
const Saloontype = require("../models/saloontype");
const Seat = require("../models/seat");



//film işlemleri
exports.get_movie_create=async (req,res)=>{
    try {
        res.render("admin/movie-create",{
            title: "Film Oluştur"
        })
    } catch (err) {
      console.log(err)  
    }
}

exports.post_movie_create=async (req,res)=>{
    const moviename=req.body.moviename;
    const content=req.body.content;
    const trailer=req.body.trailer;
    const duration=req.body.duration;
    const relasedate=req.body.relasedate;
    const visualtype=req.body.visualtype=="on" ? 1:0;
    const subtitle=req.body.isSubtitle=="on" ? 1:0;
    const movieimg=req.file.filename;

    try {
        await Movie.create({
            moviename: moviename,
            content: content,
            trailer: trailer,
            duration: duration,
            relasedate: relasedate,
            visualtype: visualtype,
            subtitle: subtitle,
            movieimg: movieimg
        })
        req.session.message={text:`${moviename} adlı film başarıyla eklendi`, class:"success"};
        res.redirect("/admin/movies");
    } catch (err) {
      console.log(err)  
    }
}

exports.get_movie_edit=async (req,res)=>{
    const movieId=req.params.movieid;
    try {
        const movie=await Movie.findByPk(movieId, {include:[{model: Category},{model: Saloon}]});
        const categories=await Category.findAll();
        res.render("admin/movie-edit",{
            title: "Film Düzenle",
            movie: movie,
            categories: categories,
        })
    } catch (err) {
      console.log(err)  
    }
}

exports.post_movie_edit=async (req,res)=>{
    const movieId=req.body.movieid;
    const moviename=req.body.moviename;
    const content=req.body.content;
    const trailer=req.body.trailer;
    const duration=req.body.duration;
    const relasedate=req.body.relasedate;
    const categoryIds=req.body.categories;
    const visualtype=req.body.visualtype=="on" ? 1:0;
    const subtitle=req.body.isSubtitle=="on" ? 1:0;
    let movieimg=req.body.movieimg;
    try {
        if(req.file){
            movieimg=req.file.filename;
        }
        const movie=await Movie.findByPk(movieId,{include:[{model: Category}]});
        if(movie){
            if(categoryIds==undefined){
                await movie.removeCategories(movie.categories);
            }else{
                await movie.removeCategories(movie.categories);
                const selectedCategories=await Category.findAll({
                    where:{
                     id:{
                        [Op.in]: categoryIds
                     }
                    }
                })
                await movie.addCategories(selectedCategories);

                movie.moviename=moviename;
                movie.content=content;
                movie.trailer=trailer;
                movie.duration=duration;
                movie.relasedate=relasedate;
                movie.visualtype=visualtype;
                movie.subtitle=subtitle;
                movie.movieimg=movieimg;

                await movie.save()         
            }
        }

        req.session.message={text:`${moviename} adlı film başarıyla güncellendi`, class:"success"};
        res.redirect("/admin/movies?action=edit")
    } catch (err) {
      console.log(err)  
    }
}

exports.get_actor_for_movie=async (req,res)=>{
    const movieId=req.params.movieid;
    try {
        const movie=await Movie.findByPk(movieId,{include:{model: Actor}});
        console.log(movie)
        const actors=await Actor.findAll({order:[["actorname","ASC"]]})
        res.render("admin/add-actor-for-movie",{
            title: "Aktör Ekle",
            actors: actors,
            movie: movie
        });
    } catch (err) {
      console.log(err)  
    }
}

exports.post_actor_for_movie=async (req,res)=>{
    const actorIds=req.body.actors;
    const movieId=req.body.movieid

    async function addActorsForMovie(movie,actorList){

        await movie.removeActors(movie.actors);

        const selectedActors=await Actor.findAll({
            where:{
                id:{
                    [Op.in]: actorList
                }
            }
        })

        await movie.addActors(selectedActors)
    }

    try {
        const movie=await Movie.findByPk(movieId,{include:{model: Actor}});
        if(actorIds == undefined){
            await movie.removeActors(movie.actors);
        }else{
            if(actorIds.length==1){
                const actorArray=[];
                actorArray.push(actorIds);
                addActorsForMovie(movie, actorArray);
            }else{
                addActorsForMovie(movie,actorIds)
            }
        }
        return res.redirect(`/admin/movie/edit/${movieId}`)

    } catch (err) {
      console.log(err)  
    }
}

exports.get_movie_delete=async (req,res)=>{
    const movieId=req.params.movieid;
    try {
        const movie=await Movie.findByPk(movieId, {include: {model: Category}});
        res.render("admin/movie-delete",{
            title: "Film Sil",
            movie: movie
        })
    } catch (err) {
      console.log(err)  
    }
}

exports.post_movie_delete=async (req,res)=>{
    const movieId=req.body.movieId;
    const movieName=req.body.moviename;
    try {
        await Movie.destroy({where:{id: movieId}})
        req.session.message={text:`${movieName} adlı film silindi`, class:"danger"};
        res.redirect("/admin/movies?action=delete")
    } catch (err) {
      console.log(err)  
    }
}

exports.get_movies=async (req,res)=>{
    const message=req.session.message;
    delete req.session.message

    try {
        const movies=await Movie.findAll({include:{model: Category}});
        res.render("admin/movie-list",{
            title: "Filmler",
            movies: movies,
            message: message
        })
    } catch (err) {
      console.log(err)  
    }
}

//kategori-tür işlemleri
exports.get_category_create=async (req,res)=>{
    try {
        res.render("admin/category-create",{
            title: "Kategori Oluştur"
        })
    } catch (err) {
      console.log(err)  
    }
}

exports.post_category_create=async (req,res)=>{
    const categoryname=req.body.categoryname;
    try {
        await Category.create({categoryname: categoryname});
        req.session.message={text:`${categoryname} adlı kategori başarıyla eklendi`, class:"success"};
        res.redirect("/admin/categories?action=create");
    } catch (err) {
      console.log(err)  
    }
}

exports.get_category_edit=async (req,res)=>{
    const categoryId=req.params.categoryid;
    try {
        const category=await Category.findByPk(categoryId);
        const count=await category.countMovies()
        const movies=await category.getMovies()
        res.render("admin/category-edit",{
            title: "Kategori Düzenle",
            category: category,
            movies: movies,
            count: count
        })
    } catch (err) {
      console.log(err)  
    }
}

exports.post_category_edit=async (req,res)=>{
    const categoryId=req.body.categoryid;
    const categoryname=req.body.categoryname;
    try {
        await Category.update({categoryname: categoryname},{where:{id: categoryId}});
        req.session.message={text:`${categoryname} adlı kategori başarıyla güncellendi`, class:"success"};
        res.redirect("/admin/categories?action=edit");
    } catch (err) {
      console.log(err)  
    }
}

exports.post_remove_movie_from_category=async (req,res)=>{
    const movieId=req.body.movieid;
    const categoryId=req.body.categoryid;
    try {
        const category=await findByPk(categoryId);
        await category.removeMovie(movieId)
        // req.session.message={text:`${categoryname} adlı kategori başarıyla güncellendi`, class:"success"};
        res.redirect("/admin/categories?action=edit");
    } catch (err) {
      console.log(err)  
    }
}

exports.get_category_delete=async (req,res)=>{
    const categoryId=req.params.categoryid;
    try {
        const category=await Category.findByPk(categoryId);
        const count=await category.countMovies();
        res.render("admin/category-delete",{
            title: "Kategori Sil",
            category: category,
            count: count
        })
    } catch (err) {
      console.log(err)  
    }
}

exports.post_category_delete=async (req,res)=>{
    const categoryId=req.body.categoryid;
    const categoryname=req.body.categoryname;
    try {
        await Category.destroy({where: {id: categoryId}});
        req.session.message={text:`${categoryname} adlı kategori başarıyla silindi`, class:"danger"};
        res.redirect("/admin/categories?action=delete");
    } catch (err) {
      console.log(err)  
    }
}

exports.get_categories=async (req,res)=>{
    const message=req.session.message;
    delete req.session.message

    try {
        const categories=await Category.findAll();
        res.render("admin/category-list",{
            title: "Kategoriler",
            categories: categories,
            message: message
        })
    } catch (err) {
      console.log(err)  
    }
}

//sanatçı işlemleri
exports.get_actor_create=async (req,res)=>{
    try {
        res.render("admin/actor-create",{
            title: "Sanatçı Oluştur"
        })
    } catch (err) {
      console.log(err)  
    }
}

exports.post_actor_create=async (req,res)=>{
    const actorname=req.body.actorname;
    try {
        await Actor.create({actorname: actorname});
        req.session.message={text:`${actorname} adlı sanatçı başarıyla eklendi`, class:"success"};
        res.redirect("/admin/actors?action=create")
    } catch (err) {
      console.log(err)  
    }
}

exports.get_actor_edit=async (req,res)=>{
    const actorId=req.params.actorid;
    try {
        const actor=await Actor.findByPk(actorId,{include:{model: Movie}});
        const movies=await actor.getMovies()
        const count=await actor.countMovies()
        res.render("admin/actor-edit",{
            title: "Sanatçı Düzenle",
            actor: actor,
            movies: movies,
            count: count
        })
    } catch (err) {
      console.log(err)  
    }
}

exports.post_actor_edit=async (req,res)=>{
    const actorId=req.body.actorid;
    const actorname=req.body.actorname;
    try {
        await Actor.update({actorname: actorname},{where: {id: actorId}});
        req.session.message={text:`${actorname} adlı sanatçı başarıyla güncellendi`, class:"success"};
        res.redirect("/admin/actors?action=edit")
    } catch (err) {
      console.log(err)  
    }
}

exports.get_actor_delete=async (req,res)=>{
    const actorId=req.params.actorid;
    try {
        const actor=await Actor.findByPk(actorId);
        res.render("admin/actor-delete",{
            title: "Sanatçı Sil",
            actor: actor
        })
    } catch (err) {
      console.log(err)  
    }
}

exports.post_actor_delete=async (req,res)=>{
    const actorId=req.body.actorid;
    const actorname=req.body.actorname;
    try {
        await Actor.destroy({where: {id: actorId}});
        req.session.message={text:`${actorname} adlı sanatçı başarıyla silindi`, class:"danger"};
        res.redirect("/admin/actors?action=delete")
    } catch (err) {
      console.log(err)  
    }
}

exports.get_actors=async (req,res)=>{
    const message=req.session.message
    delete req.session.message

    try {
        const actors=await Actor.findAll();
        console.log(actors);
        res.render("admin/actor-list",{
            title: "Sanatçılar",
            actors: actors,
            message: message,
        })
    } catch (err) {
      console.log(err)  
    }
}


//salon işlemleri
exports.get_saloon_create=async (req,res)=>{
    try {
        const saloontypes=await Saloontype.findAll();
        res.render("admin/saloon-create",{
            title: "Salon Oluştur",
            saloontypes:saloontypes
        })
    } catch (err) {
      console.log(err)  
    }
}

exports.post_saloon_create=async (req,res)=>{
    const saloonname=req.body.saloonname;
    const capacity=req.body.capacity;
    const saloontypeId=req.body.saloontypeid;
    try {
        const newSaloon=await Saloon.create({saloonname: saloonname, capacity: capacity, saloontypeId: saloontypeId},{include:{model: Seat}});
        console.log("kapasite: ",newSaloon.capacity)
        for (let i = 1; i <= newSaloon.capacity; i++) {
            await Seat.create({seatnumber: i, saloonId: newSaloon.id})
            
        }
        req.session.message={text:`${saloonname} adlı salon başarıyla eklendi`, class:"success"};
        res.redirect("/admin/saloons?action=create")
    } catch (err) {
      console.log(err)  
    }
}

exports.get_saloon_edit=async (req,res)=>{
    const saloonId=req.params.saloonid;
    try {
        const saloon=await Saloon.findByPk(saloonId,{include:[{model: Saloontype},{model: Movie}]});
        const movies=await Movie.findAll();
        const saloontypes= await Saloontype.findAll();
        res.render("admin/saloon-edit",{
            title: "Salon Düzenle",
            saloon: saloon,
            movies: movies,
            saloontypes: saloontypes
        })
    } catch (err) {
      console.log(err)  
    }
}

exports.post_saloon_edit=async (req,res)=>{
    const saloonId=req.body.saloonid;
    const saloonname=req.body.saloonname;
    const capacity=req.body.capacity;
    const movieId=req.body.movieid;
    const saloontypeId=req.body.saloontypeid;

    async function saveSaloon(saloon){
        saloon.saloonname=saloonname;
        saloon.capacity=capacity;
        saloon.saloontypeId=saloontypeId
        await Seat.destroy({where:{saloonId: saloonId}})
        for (let i = 1; i <= capacity; i++) {
            await Seat.create({seatnumber: i, saloonId: saloonId})
            
        }
        await saloon.save()
    }

    try {
        const saloon=await Saloon.findByPk(saloonId,{include:[{model: Movie},{model: Seat}]});
        if(movieId==""){
            saveSaloon(saloon);
        }else{
            saloon.movieId=movieId;
            saveSaloon(saloon);
        }
        req.session.message={text:`${saloonname} adlı salon başarıyla güncellendi`, class:"success"};
        res.redirect("/admin/saloons?action=edit")
    } catch (err) {
      console.log(err)  
    }
}

exports.get_saloon_delete=async (req,res)=>{
    const saloonId=req.params.saloonid;
    try {
        const saloon=await Saloon.findByPk(saloonId);
        res.render("admin/saloon-delete",{
            title: "Salon Sil",
            saloon: saloon
        })
    } catch (err) {
      console.log(err)  
    }
}

exports.post_saloon_delete=async (req,res)=>{
    const saloonId=req.body.saloonid;
    const saloonname=req.body.saloonname;
    try {
        await Seat.destroy({where:{saloonId:saloonId}});
        await Saloon.destroy({where:{id:saloonId}});
        req.session.message={text:`${saloonname} adlı salon başarıyla silindi`, class:"danger"};
        res.redirect("/admin/saloons?action=delete")
    } catch (err) {
      console.log(err)  
    }
}

exports.get_saloons=async (req,res)=>{
    const message=req.session.message;
    delete req.session.message

    try {
        const saloons=await Saloon.findAll({include:[{model: Movie}, {model: Saloontype}]});
        const saloontypes=await Saloontype.findAll();
        res.render("admin/saloon-list",{
            title: "Salonlar",
            message: message,
            saloons: saloons,
            saloontypes: saloontypes
        })
    } catch (err) {
      console.log(err)  
    }
}

//Salon Türü işlemleri
exports.get_saloontype_create=async (req,res)=>{

    try {
        res.render("admin/saloontype-create",{
            title: "Salon Türü Oluştur",
        })
    } catch (err) {
      console.log(err)  
    }
}

exports.post_saloontype_create=async (req,res)=>{
    const typename=req.body.typename;
    const info=req.body.info;
    const ticketprice=req.body.ticketprice;
    try {
        await Saloontype.create({typename: typename, info: info, ticketprice: ticketprice});
        req.session.message={text:`${typename} adlı Salon Türü başarıyla eklendi`, class:"success"};
        res.redirect("/admin/saloontypes?action=create")
    } catch (err) {
      console.log(err)  
    }
}

exports.get_saloontype_edit=async (req,res)=>{
    const saloontypetypes=[
        {id: 1, typename: "Normal", info:"Rahat Koltuklar"},
        {id: 2, typename: "Premium", info:"Yataklı, ücretsiz orta boy mısır ve kola"},
        {id: 3, typename: "Gold Class", info:"Geniş Yataklı koltuklar, Şarj Ünitesi, Özel gişe ve self servis kahve ikramı"},
    ]
    const saloontypeId=req.params.saloontypeid;
    try {
        const saloontype=await Saloontype.findByPk(saloontypeId);
        res.render("admin/saloontype-edit",{
            title: "Salon Türü Düzenle",
            saloontype: saloontype,
        })
    } catch (err) {
      console.log(err)  
    }
}

exports.post_saloontype_edit=async (req,res)=>{
    const saloontypeId=req.body.saloontypeid;
    const typename=req.body.typename;
    const info=req.body.info;
    const ticketprice=req.body.ticketprice;

    try {
        await Saloontype.update({typename: typename, info: info, ticketprice: ticketprice},{where:{id: saloontypeId}});
        req.session.message={text:`${typename} adlı salon türü başarıyla güncellendi`, class:"success"};
        res.redirect("/admin/saloontypes?action=edit")
    } catch (err) {
      console.log(err)  
    }
}

exports.get_saloontype_delete=async (req,res)=>{
    const saloontypeId=req.params.saloontypeid;
    try {
        const saloontype=await Saloontype.findByPk(saloontypeId);
        res.render("admin/saloontype-delete",{
            title: "Salon Türü Sil",
            saloontype: saloontype
        })
    } catch (err) {
      console.log(err)  
    }
}

exports.post_saloontype_delete=async (req,res)=>{
    const saloontypeId=req.body.saloontypeid;
    const typename=req.body.typename;
    try {
        await Saloontype.destroy({where:{id:saloontypeId}});
        req.session.message={text:`${typename} adlı salon türü başarıyla silindi`, class:"danger"};
        res.redirect("/admin/saloontypes?action=delete")
    } catch (err) {
      console.log(err)  
    }
}

exports.get_saloontypes=async (req,res)=>{
    const message=req.session.message;
    delete req.session.message

    try {
        const saloontypes=await Saloontype.findAll({include:{model: Saloon}});
        res.render("admin/saloontype-list",{
            title: "Salon Türleri",
            message: message,
            saloontypes: saloontypes
        })
    } catch (err) {
      console.log(err)  
    }
}

//seans işlemleri
exports.get_showtime_create=async (req,res)=>{
    try {
        res.render("admin/showtime-create",{
            title: "Seans Oluştur",
        })
    } catch (err) {
      console.log(err)  
    }
}

exports.post_showtime_create=async (req,res)=>{
    const date=req.body.date;
    const time=req.body.time;
    try {
        await Showtime.create({date:date, time: time});
        res.redirect("/admin/showtimes")
    } catch (err) {
      console.log(err)  
    }
}

exports.get_showtime_edit=async (req,res)=>{
    const showtimeId=req.params.showtimeid;
    try {
        const saloons=await Saloon.findAll({include:{model:Movie}});
        const showtime=await Showtime.findByPk(showtimeId,{include:[{model: Saloon}]})
        res.render("admin/showtime-edit",{
            title: "Seans Düzenle",
            saloons: saloons,
            showtime: showtime
        })
    } catch (err) {
      console.log(err)  
    }
}

exports.post_showtime_edit=async (req,res)=>{
    const showtimeId=req.body.showtimeid;
    const date=req.body.date;
    const time=req.body.time;
    const saloonIds=req.body.saloons;

    async function addSaloonsForShowtime(showtime,saloonList){

        await showtime.removeSaloons(showtime.saloons);

        const selectedSaloons=await Saloon.findAll({
            where:{
                id:{
                    [Op.in]: saloonList
                }
            }
        })

        await showtime.addSaloons(selectedSaloons)
    }
    async function saveUpdate(showtime){
        showtime.date=date;
        showtime.time=time;
        await showtime.save();
    }
    console.log(saloonIds)
    try {
        const showtime=await Showtime.findByPk(showtimeId,{include:{model: Saloon}});
        if(showtime){
            if(saloonIds==undefined){
                await showtime.removeSaloons(showtime.saloons);
                saveUpdate(showtime)
            }else{
                if(saloonIds.length==1){
                    const saloonIdList=[];
                    saloonIdList.push(saloonIds);
                    addSaloonsForShowtime(showtime,saloonIdList);
                    saveUpdate(showtime)
                }else{
                    addSaloonsForShowtime(showtime,saloonIds);
                    saveUpdate(showtime)

                }
            }
            return res.redirect("/admin/showtimes")
        }
    } catch (err) {
      console.log(err)  
    }
}

exports.get_showtime_delete=async (req,res)=>{
    const showtimeId=req.params.showtimeid;
    try {
        const showtime=await Showtime.findByPk(showtimeId,{include:[{model: Saloon}]});
        res.render("admin/showtime-delete",{
            title: "Seans Sil",
            showtime: showtime
        })
    } catch (err) {
      console.log(err)  
    }
}

exports.post_showtime_delete=async (req,res)=>{
    const showtimeId=req.body.showtimeid;
    try {
        await Showtime.destroy({where:{id: showtimeId}});
        req.session.message={text:"Seans silindi", class:"danger"};
        res.redirect("/admin/showtimes");
    } catch (err) {
      console.log(err)  
    }
}

exports.get_showtimes=async (req,res)=>{
    try {       
        const showtimes=await Showtime.findAll({include:[ {model: Saloon}]});
        const message=req.session.message;
        delete req.session.message

        res.render("admin/showtime-list",{
            title: "Seanslar",
            showtimes: showtimes,
            message: message,
        })
    } catch (err) {
      console.log(err)  
    }
}

//rol işlemleri
exports.get_role_create=async (req,res)=>{
    try {
        res.render("admin/role-create",{
            title: "Rol Oluştur",
        })
    } catch (err) {
      console.log(err)  
    }
}

exports.post_role_create=async (req,res)=>{
    const rolename=req.body.rolename;
    try {
        await Role.create({rolename: rolename});
        req.session.message={text:`${rolename} adlı rol eklendi`, class:"success"};
        res.redirect("/admin/roles?action=create");
    } catch (err) {
      console.log(err)  
    }
}

exports.get_role_edit=async (req,res)=>{
    const roleId=req.params.roleid;
    try {
        const role=await Role.findByPk(roleId,{include:{model: User}})
        const count= await role.countUsers();
        if(roleId==1 || roleId==2){
            req.session.message={text:`${roleId} id numaralı rolü düzenleyemezsiniz.`, class:"warning"};
            return res.redirect("/admin/roles");
        }
        res.render("admin/role-edit",{
            title: "Rol Düzenle",
            role: role,
            count: count
        })
    } catch (err) {
      console.log(err)  
    }
}

exports.post_role_edit=async (req,res)=>{
    const roleId=req.body.roleid;
    const rolename=req.body.rolename;
    try {
        await Role.update({rolename:rolename},{where:{id: roleId}});
        req.session.message={text:`${rolename} adlı rol güncellendi`, class:"success"};
        res.redirect("/admin/roles?action=update")
    } catch (err) {
      console.log(err)  
    }
}

exports.get_role_delete=async (req,res)=>{
    const roleId=req.params.roleid;
    try {
        const role=await Role.findByPk(roleId,{include:{model: User}});
        if(roleId==1 || roleId==2){
            req.session.message={text:`${roleId} id numaralı rolü silemezsiniz.`, class:"warning"};
            return res.redirect("/admin/roles");
        }
        const count=await role.countUsers();
        res.render("admin/role-delete",{
            title: "Rol Sil",
            role: role,
            count: count
        })
    } catch (err) {
      console.log(err)  
    }
}

exports.post_role_delete=async (req,res)=>{
    const roleId=req.body.roleid;
    const rolename=req.body.rolename;
    try {
        await Role.destroy({where:{id: roleId}});
        req.session.message={text:`${rolename} adlı rol silindi`, class:"danger"};
        res.redirect("/admin/roles?action=delete");
    } catch (err) {
      console.log(err)  
    }
}

exports.get_roles=async (req,res)=>{
    const message=req.session.message;
    delete req.session.message
    try {       
        const roles=await Role.findAll({
            attributes:{
                include:["role.id","role.rolename",[sequelize.fn("COUNT", sequelize.col("users.id")),"user_count"]]
            },
            include:[
                {model: User, attributes:["id"]}
            ],
            group: ["role.id"],
            raw: true,
            includeIgnoreAttributes: false
        })
         res.render("admin/role-list",{
            title: "Roller",
            roles: roles,
            message: message,
        })
    } catch (err) {
      console.log(err)  
    }
}


//user-kullanıcı işlemleri
exports.get_user_edit=async (req,res)=>{
    const userId=req.params.userid;
    try {
        const user=await User.findByPk(userId,{include:{model: Role}})
        const roles=await Role.findAll();
        if(userId==1){
            req.session.message={text:`id numarası ${userId} olan kullancı sabit admin olduğu için düzenleyemezsiniz. Eğer düzenlemek istediğiniz bir veri varsa yazılım firmasıyla iletişime geçin`, class:"warning"};
            return res.redirect("/admin/users");

        }
        res.render("admin/user-edit",{
            title: "Kullanıcı Düzenle",
            user: user,
            roles: roles
        })
    } catch (err) {
      console.log(err)  
    }
}

exports.post_user_edit=async (req,res)=>{
    const userId=req.body.userid;
    const roleIds=req.body.roles;

    async function addRoleforUser(user,roleList){

        await user.removeRoles(user.roles);

        const selectedRoles=await Role.findAll({
            where:{
                id:{
                    [Op.in]: roleList
                }
            }
        })
        await user.addRoles(selectedRoles)
    }

    try {
        const user=await User.findByPk(userId,{include:{model: Role}});
        if(!user){
            req.session.message={text:`${userId} id numaralı kullanıcı bulunamadı`, class:"danger"};
            return res.redirect("/admin/users")
        }else{
            
            if(roleIds==undefined){
                await user.removeRoles(user.roles);
            }else{
                if(roleIds.length==1){
                    const roleList=[];
                    roleList.push(roleIds);

                    addRoleforUser(user, roleList);
                }else{
                    addRoleforUser(user, roleIds);
                }
            }
        }
        return res.redirect("/admin/users");

    } catch (err) {
      console.log(err)  
    }
}

exports.get_users=async (req,res)=>{
    const message=req.session.message;
    delete req.session.message

    try {       
        const users=await User.findAll({include:{model: Role}})
         res.render("admin/user-list",{
            title: "Kullancılar",
            users: users,
            message: message,
        })
    } catch (err) {
      console.log(err)  
    }
}