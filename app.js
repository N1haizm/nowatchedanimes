const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session)
const csrf = require('csurf')
const flash = require('connect-flash')
const multer = require('multer')

const adminRoutes = require('./routes/admin')
const routerMarket = require('./routes/market')
const authRoute = require('./routes/auth')

const control404 = require('./controllers/panofo')
const mongoose = require('mongoose')
const User = require('./models/user')

const app = express()

const MONGODB_URI = 'mongodb+srv://Nihad:X2LTtsMsv4vwpime@cluster0.vfqqknd.mongodb.net/market'

const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions'
})

const fileStore = multer.diskStorage({
    destination: (rq, file, cb) => {
        cb(null, 'images')
    },
    filename: (rq, file, cb) => {
        cb(null, file.filename + '-' + file.originalname)
    }
})

const fileFilter = (rq, file, cb) => {
    if(file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg'){
        cb(null, true)
    }else{
        cb(null, false)
    }
}

const csrfProtection = csrf()

app.set('view engine', 'ejs')
app.set('views', 'views')


app.use(bodyParser.urlencoded({extended: false}))
app.use(multer({storage: fileStore, fileFilter: fileFilter}).single('image'))
app.use(session({secret: 'my secret', resave: false, saveUninitialized: false, store: store}))

app.use(csrfProtection)

app.use(flash())

app.use((rq, rs, nxt) => {
    if (!rq.session.user) {
        return nxt()
    }
    User.findById(rq.session.user._id)
        .then(user => {
            rq.user = user
            nxt()
        })
        .catch(err => console.log(err))
})

app.use(express.static(path.join(__dirname, 'public')))
app.use('/images', express.static(path.join(__dirname, 'images')))

app.use((rq, rs, nxt) => {
    rs.locals.isAuthenticated = rq.session.isLoggedIn
    rs.locals.csrfToken = rq.csrfToken()
    nxt()
})

app.use('/admin', adminRoutes)

app.use(routerMarket)

app.use(authRoute)

app.use(control404)

mongoose.connect(MONGODB_URI)
    .then(res => {
        console.log('connected!')
        app.listen(3000)
    })
    .catch(err => console.error(err))