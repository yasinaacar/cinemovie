module.exports=function(req,res,next){
    if(!req.session.isAuth){
        return res.redirect("/account/login?returnUrl="+req.originalUrl);
    }
    if(!req.session.roles.includes("Admin")){
        req.session.message={text:"Yetkili bir kullanıcı ile oturum açınız. Eğer yetkiniz olduğunu düşünüyorsanız yönetici ile iletişime geçiniz."};
        return res.redirect("/account/login?returnUrl="+req.originalUrl);

    }
    next()
}