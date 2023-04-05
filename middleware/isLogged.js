function isLoggedIn(req,res,next) {
    req.user ? next() : res.sendStatus(403);
}

module.exports =  isLoggedIn