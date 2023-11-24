const bcrypt=require("bcrypt");
const User = require("../models/user");
const Role = require("../models/role");
const emailService=require("../helpers/send-mail");
const config = require("../config");
const cyrpto=require("crypto");
const { Op } = require("sequelize");



exports.get_register=async(req,res)=>{
    const message=req.session.message;
    delete req.session.message

    try {
        res.render("auth/register",{
            title: "Kaydol",
            message: message
        })
    } 
    catch (err) {
        console.log(err)
    }
}

exports.post_register=async(req,res)=>{
    const fullname=req.body.fullname;
    const email=req.body.email;
    const phone=req.body.phone;
    const password=req.body.password;
    const againPassword=req.body.passwordagain;
    try {
        const customer=await Role.findOne({where:{rolename: "Müşteri"}})
        const user=await User.findOne({where:{email: email}},{include:{model:Role}});
        if(user){
            req.session.message={text:"*Bu email adresine kayıtlı bir hesap zaten var", warning: "alreadyTaken"}
        }else{
            if(password != againPassword){
                req.session.message={text:"*Şifre ve Şifre Tekrar değerleri aynı olmalı", warning: "noMatches"}

            }else{
                const hashedPassword=await  bcrypt.hash(password, 10);

                const newUser=await User.create({
                    fullname: fullname,
                    email: email,
                    phone: phone,
                    password: hashedPassword
                });

                await newUser.setRoles(customer)

                await emailService.sendMail({
                    from: config.email.from,
                    to: newUser.email,
                    subject: "Cinemovie'ye Hoşgeldin",
                    html:`
                    <h3 style="text-align: center;">Cinemovie'ye Hoşgeldin</h3>
                    <div class="content" style="margin-left: 10px;">
                        <h6>Merhaba ${fullname};</h6>
                        <p style="margin-left: 12px;">Cinemovie olarak seni aramızda görmekten mutluluk duyuyoruz. Cinemovie web hizmetini kullanarak artık filmleri daha detaylı inceleyip, biletini alabilirsin.</p>
                    </div>
                    `
                })

                return res.redirect("/account/login?action=create")
            }
        }
        return res.redirect("/account/register")
    } 
    catch (err) {
        console.log(err)
    }
}

exports.get_log_in=async(req,res)=>{
    const message=req.session.message;
    delete req.session.message

    try {
        res.render("auth/log-in",{
            title: "Giriş Yap",
            message: message,
            action: req.query.action

        })
    } 
    catch (err) {
        console.log(err)
    }
}

exports.post_log_in=async(req,res)=>{
    const email=req.body.email;
    const password=req.body.password;
    try {
        const user=await User.findOne({where:{email: email}});
        if(!user){
            req.session.message={text:"*Sisteme kayıtlı böyle bir e-mail adresi yok", warning:"wrongEmail"};
        }else{
            const match=await bcrypt.compare(password, user.password);

            if(!match){
                req.session.message={text:"*Parola yanlış", warning:"wrongPassword"};
            }else{
                const userRoles=await user.getRoles({attributes:["rolename"],raw:true});
                req.session.roles=userRoles.map((role=> role["rolename"]))
                console.log(req.session.roles)
                req.session.isAuth=true;
                req.session.userId=user.id;
                req.session.fullname= user.fullname;
                const url= req.query.returnUrl || "/";
                return res.redirect(url)
            }
        }
        return res.redirect("/account/login")
    } 
    catch (err) {
        console.log(err)
    }
}

exports.get_forgot_password=async(req,res)=>{
    const message=req.session.message
    delete req.session.message

    try {
        res.render("auth/forgot-password",{
            title: "Şifremi Unuttum",
            message: message
        })
    } 
    catch (err) {
        console.log(err)
    }
}

exports.post_forgot_password=async(req,res)=>{
    const email=req.body.email;
    try {
        const user=await User.findOne({where:{email: email}});
        if(!user){
            req.session.message={text:"Geçersiz E-Mail adresi", class: "danger"}
            res.redirect("/account/forgot-password")
        }else{
            let token=cyrpto.randomBytes(32).toString("hex");
            user.resetToken=token;
            user.resetTokenExpiration=Date.now() +(1000*60*60);
            await user.save()

            await emailService.sendMail({
                from: config.email.from,
                to: user.email,
                subject: "Parola Sıfırla",
                html:`
                <h3 style="text-align: center;">Şifrenizi mi Unuttunuz?</h3>
                <div class="content" style="margin-left: 10px;">
                    <h6>Merhaba ${user.fullname};</h6>
                    <p style="margin-left: 12px;">Parolanı Güncellemek için aşağıdaki linke tıklayabilirsin.</p>
                    <p style="margin-left: 12px;">
                        <a href="http://127.0.0.1:3000/account/reset-password/${token}">Paraloyı sıfırla</a>
                    </p>   
                </div>
                `
            })

            req.session.message={text:"E mailiniz sıfırlama linki gönderdik. Lütfen mailinizi kontrol edin", class:"warning"}
            return res.redirect("/account/login")
        }
        res.render("auth/forgot-password",{
            title: "Şifremi Unuttum"
        })
    } 
    catch (err) {
        console.log(err)
    }
}

exports.get_reset_password=async(req,res)=>{
    const message=req.session.message;
    const token=req.params.token;
    delete req.session.message

    try {
        const user=await User.findOne({
            where:{
                resetToken: token,
                resetTokenExpiration:{
                    [Op.gt]: Date.now()
                }
            }
        })
        res.render("auth/reset-password",{
            title: "Şifremi Unuttum",
            token: token,
            user: user,
            message: message
        })
    } 
    catch (err) {
        console.log(err)
    }
}

exports.post_reset_password=async(req,res)=>{
    const token=req.body.token;
    const userId=req.body.userid;
    const password=req.body.password;
    try {
        const user=await User.findOne({
            where:{
                resetToken: token,
                resetTokenExpiration:{
                    [Op.gt]: Date.now()
                },
                id: userId
            }
        });
        if(password != "undefined" && password!=""){
            const hashedPassword=await bcrypt.hash(password,10);
             user.password=hashedPassword;
             user.resetToken=null;
             user.resetTokenExpiration=null;
             await user.save();

             res.redirect("/account/login");
        }else{
            req.session.message={text: "Şifre alanı boş geçilemez", class:"danger"};
            res.redirect(`/account/reset-password/${token}`)
        }
    } 
    catch (err) {
        console.log(err)
    }
}

exports.get_account_settings=async(req,res)=>{
    const message=req.session.message;
    delete req.session.message
    try {
        res.render("auth/account-setting",{
            title: "Hesabım",
            message: message
        })
    } 
    catch (err) {
        console.log(err)
    }
}

exports.post_account_settings=async(req,res)=>{
    try {
        res.render("auth/account-setting",{
            title: "Hesabım"
        })
    } 
    catch (err) {
        console.log(err)
    }
}

exports.get_logout=async(req,res)=>{
    try {
        await req.session.destroy();
        return res.redirect("/");
    } catch (err) {
        console.log(err)
    }
}
