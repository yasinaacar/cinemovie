module.exports=function(req,res,next){
    if(!req.session.isAuth){
        return res.redirect("/account/login?returnUrl="+req.originalUrl);
    }
    if(!req.session.roles.includes("Müşteri")){
        req.session.message={text:"Lütfen hesabınıza giriş yapın"};
        return res.redirect("/account/login?returnUrl="+req.originalUrl);

    }
    next()
}