const express  = require('express'),
      router   = express.Router(),
      gravatar = require('gravatar'),
      bcrypt   = require('bcrypt'),
      jwt      = require('jsonwebtoken'),
      passport = require('passport')

const { check, validationResult } = require('express-validator')

const keys             = require('../../_config/keys')
const Auth             = require('../../models/auth-model')

const tokenList = {}
const TOKENLIFE = keys.tokenLife, REFRESHLIFE = keys.refreshTokenLife, SECRET = keys.secretOrKey

router.post('/register', 
    [
        check('name', 'Name is not provided').not().isEmpty(),
        check('email', 'Valid email is not provided').isEmail(),
        check('password', 'Password must be at least 6 characters').isLength({ min: 6})
    ],
    async (req, res) => {

        const errors = validationResult(req)

        if(!errors.isEmpty())
            return res.status(400).json({errors: errors.array()})
        
        try {
            const { name, email, password } = req.body
            let user = await Auth.findOne({ email: email })

            if(user) return res.status(400).json({ errors: [{ msg: 'Email taken' }]})

            const avatar = gravatar.url(email, { s:'200', r:'pg', d:'mm' })
            const newUser = new Auth({ name, email, avatar, password })
            const salt = await bcrypt.genSalt(10)
            const response = {
                success: true,
                message: 'Account created!'
            }

            newUser.password = await bcrypt.hash(password, salt)
            await newUser.save()
            
            res.status(200).json(response)
        } catch (err) {
            console.error(err.message)
            res.status(500).send('Server error')
        }

})

router.post('/login', 
    [
        check('email', 'Valid email not provided').isEmail(),
        check('password', 'Password not provided').exists()
    ],
    async (req, res) => {

        const errors = validationResult(req)

        if (!errors.isEmpty())
            return res.status(200).json({ errors: errors.array() })

        try {
            const { email, password } = req.body
            let user = await Auth.findOne({ email: email })

            if (!user) return res.status(400).json({ errors: [{ msg: 'User not found' }]});

            const isMatch = await bcrypt.compare(password, user.password)

            if (isMatch) {
                const payload = { id: user.id, name: user.name, avatar: user.avatar }
                const cookieOptions = {
                    maxAge: TOKENLIFE * 1000,
                    httpOnly: true,
                    signed: true
                }

                const token = jwt.sign(payload, SECRET, { subject: `${user.id}`, expiresIn: TOKENLIFE })

                const response = {
                    success: true,
                    message: 'Successfully logged in!'
                }

                tokenList[token] = {
                    jwtToken: token,
                    id: payload.id,
                    name: payload.name,
                    avatar: payload.avatar
                }
                console.log("loginPayload::", tokenList)

                res.cookie('jwtToken', token, cookieOptions)
                res.status(200).json(response)
            } else {
                return res.status(400).json({errors: [{ msg: 'Invalid Credentials'}]})
            }
        } catch (err) {
            console.error(err.message)
            return res.status(500).send('Server error')
        }
        
})

router.get('/refresh-token', (req, res) => {

    const refreshData = req.signedCookies['jwtToken']

    console.log(tokenList)

    if (refreshData && (refreshData in tokenList)) {
        const payload = {
            id: tokenList[refreshData].id,
            name: tokenList[refreshData].name,
            avatar: tokenList[refreshData].avatar
        }
        const cookieOptions = {
            maxAge: REFRESHLIFE * 1000,
            httpOnly: true,
            signed: true
        }

        const token = jwt.sign(payload, SECRET, { subject: payload.id, expiresIn: TOKENLIFE })

        const response = {
            success: true,
            message: 'Status: OK'
        }

        tokenList[refreshData].jwtToken = token

        res.cookie('jwtToken', token, cookieOptions)
        res.status(200).json(response)
    } else {
        res.status(404).send('Invalid request')
    }

})

router.get('/revoke-token', (req, res, next) => {
    const token = req.signedCookies['jwtToken']
    if (token in tokenList) delete tokenList[token]
    res.clearCookie()
    res.status(204).send('out')

})

router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
    const { user } = req

    res.status(200).send({ user })
})

module.exports = router