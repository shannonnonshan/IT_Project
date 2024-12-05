export default function(req, res, next){
    if(req.session.auth === false){
        req.session.retUrl = req.originalUrl;
        return res.redirect('/account/signup');
    }
    next();
}

export function authAdmin(req, res, next){
    if(req.session.auth === false){
        req.session.retUrl = req.originalUrl;
        return res.redirect('/account/signin');
    }
    next();

    if(req.session.authUser.permission < 1){
        return res.render('features');  //thong bao khong du quyen
    }
}

