//kullanıcı giriş yapmadan direkt sayfaya erişmek isterse login sayfasına yönlendirilir
module.exports=function(req,res,next){
    if(!req.session.isAuth){
        return res.redirect("/account/login?returnUrl="+req.originalUrl);
    }
    next()
}