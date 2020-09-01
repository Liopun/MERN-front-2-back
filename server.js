const express       = require('express'),
      mongoose      = require('mongoose'),
      bodyParser    = require('body-parser'),
      passport      = require('passport'),
      path          = require('path'),
      cors          = require('cors'),
      createError   = require('http-errors'),
      cookieParser  = require('cookie-parser'),
      keys        = require('config')

const indexRouter  = require('./routes/api/index'),
      authRouter   = require('./routes/api/auth'),
      profileRouter = require('./routes/api/profile'),
      postRouter    = require('./routes/api/post')

const connectDB = require('./utils/db')

require('./utils/passport-middleware')

const db = keys.get('mongoURI')

const app = express()

connectDB()

app.use(cors({origin: '*'}))

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cookieParser(keys.get('secretOrKey')))

app.use(passport.initialize())

// app.use('/api/', indexRouter)
app.use('/api/auth', authRouter)
app.use('/api/profile', profileRouter)
app.use('/api/posts', postRouter)

// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//     next(createError(404))
// })

// Serve static assets in production
if(process.env.NODE_ENV === 'production') {
    // Set static folder
    app.use(express.static('client/build'))
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    })
}

const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log(`Server started on port ${PORT}`))