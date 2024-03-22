const User = require('../models/user')
const bcrypt = require('bcryptjs')

exports.getLogin = (rq, rs) => {
    let message = rq.flash('err')
    if(message.length > 0) {
        message = message[0]
    } else {
        message = undefined
    }
    rs.render('auth/login', {
        pageTitle: 'Login',
        path: '/login',
        errorMessage: message
    })
}

exports.postLogin = (rq, rs) => {
    const email = rq.body.email
    const password = rq.body.password
    User.findOne({email: email})
        .then(user => {
            if(!user){
                rq.flash('err', 'invalid email')
                return rs.redirect('/login')
            }
            bcrypt.compare(password, user.password)
                .then(doMatch => {
                    if(doMatch){
                        rq.session.isLoggedIn = true
                        rq.session.user = user
                        return rq.session.save(err => {
                            console.log(err)
                            rs.redirect('/')
                        })
                    }
                    rq.flash('err', 'invalid password')
                    rs.redirect('/login')
                })
        })
}

exports.postLogout = (rq, rs) => {
    rq.session.destroy(err => {
        console.log(err)
        rs.redirect('/')
    })
}

exports.getSignup = (rq, rs) => {
    let message = rq.flash('taken')
    if (message.length > 0) {
        message = message[0]
    } else {
        message = undefined
    }
    rs.render('auth/signup', {
        pageTitle: 'Signup',
        path: '/signup',
        isAuthenticated: false,
        errorMessage: message
    })
}

exports.postSignup = async (rq, rs) => {
    const email = rq.body.email
    const password = rq.body.password
    const user = await User.findOne({email: email})
    if(user) {
        rq.flash('taken', 'An email can be taken once')
        return rs.redirect('/signup')
    }
    const newUser = new User({
        email: email,
        password: await bcrypt.hash(password, 12),
        deck: {items: []}
    })
    await newUser.save()
    rs.redirect('/login')
}