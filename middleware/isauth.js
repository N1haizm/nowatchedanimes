module.exports = (rq, rs, nxt) => {
    if(!rq.session.isLoggedIn){
        return rs.redirect('/login')
    }
    nxt()
}