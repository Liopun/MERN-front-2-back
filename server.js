const express       = require('express'),
      mongoose      = require('mongoose'),
      bodyParser    = require('body-parser'),
      passport      = require('passport'),
      path          = require('path'),
      cors          = require('cors'),
      createError   = require('http-errors'),
      cookieParser  = require('cookie-parser')

const keys         = require('./_config/keys')

const indexRouter  = require('./routes/api/index'),
      authRouter   = require('./routes/api/auth'),
      profileRouter = require('./routes/api/profile'),
      postRouter    = require('./routes/api/post')

require('./_utils/passport-middleware.js')
require('dotenv').config()

const db = keys.mongoURI

const app = express()

app.use(cors({origin: '*'}))

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cookieParser(keys.secretOrKey))

mongoose.connect(db, { useUnifiedTopology: true, useNewUrlParser: true })
         .then(() => console.log("MongoDB Connection Established"))
         .catch((err) => console.log(err))

app.use(passport.initialize())

app.use('/api/', indexRouter)
app.use('/api/auth', authRouter)
app.use('/api/profile', profileRouter)
app.use('/api/posts', postRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404))
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log(`Server started on port ${PORT}`))