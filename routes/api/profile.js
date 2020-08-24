const express   = require('express'),
      request   = require('request'),
      router    = express.Router(),
      passport  = require('passport'),
      jwt       = require('jsonwebtoken')
      ObjectId  = require('mongoose').Types.ObjectId
    
const { check, validationResult } = require('express-validator')

const Profile = require('../../models/profile-model')
const Auth    = require('../../models/auth-model')
const Post    = require('../../models/post-model')

router.get('/', async (req, res) => {
    try {
        const profiles = await Profile.find().populate('user', ['name', 'avatar'])
        res.status(200).json(profiles)
    } catch (err) {
        console.log(err)
        res.status(500).send('Server Error')
    }
})

router.get('/me', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        let profile = await Profile.findOne({ user: req.user.id }).populate('user', ['name', 'avatar'])

        if(!profile) return res.status(400).json({ msg: 'No profile for this user' })
        res.status(200).json(profile)
    } catch (err) {
        console.log(err.message)
        res.status(500).send('Server Error')
    }
})

router.get('/user/:user_id', async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.params.user_id }).populate('user', ['name', 'avatar'])

        if(!profile) return res.status(400).json({ msg: 'Profile not provided' })
        res.status(200).json(profile)
    } catch (err) {
        console.log(err.message)
        if(err.kind == 'ObjectId') return res.status(400).json({ msg: 'Profile not found' })
        res.status(500).send('Server Error')
    }
})

router.get('/github/:username', (req, res) => {
    try {
        const options = {
            uri: `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc`,
            method: 'GET',
            headers: { 'user-agent': 'node.js'}
        };

        request(options, (error, response, body) => {
            if(error) return res.status(400).json({ errors: error.array() })
            if(response.statusCode !== 200) return res.status(404).json({ msg: 'No Github profile found' })

            res.status(200).json(JSON.parse(body))
        })
    } catch (err) {
        console.log(err.message)
        res.status(500).send('Server Error')
    }
})

router.post('/', [
        passport.authenticate('jwt', { session: false }),
        [
            check('status', 'Status not provided').not().isEmpty(),
            check('skills', 'Skills not provided').not().isEmpty()
        ]
    ],
    async (req, res) => {
        const errors = validationResult(req)

        if(!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

        let { company, website, location, bio, status, githubusername, skills, youtube, facebook,twitter, instagram, linkedin } = req.body
        let profileFields = {}

        profileFields.user = req.user.id
        if(company) profileFields.company = company
        if(website) profileFields.website = website
        if(location) profileFields.location = location
        if(bio) profileFields.bio = bio
        if(status) profileFields.status = status
        if(githubusername) profileFields.githubusername = githubusername
        if(skills) profileFields.skills = skills.split(',').map((skill) => skill.trim())

        profileFields.social = {}
        if(youtube) profileFields.social.youtube = youtube
        if(twitter) profileFields.social.twitter = twitter
        if(facebook) profileFields.social.facebook = facebook
        if(linkedin) profileFields.social.linkedin = linkedin
        if(instagram) profileFields.social.instagram = instagram

        try {
            let profile = await Profile.findOne({ user: req.user.id })
            if(profile) {
                profile = await Profile.findOneAndUpdate(
                    { user: req.user.id },
                    { $set: profileFields },
                    { new: true }
                )

                return res.status(200).json(profile)
            }
            profile = new Profile(profileFields)
            await profile.save()
            res.status(200).json(profile)
        } catch (err) {
            console.log(err.message)
            res.status(500).send('Server Error')
        }
})

router.put('/experience', [
        passport.authenticate('jwt', { session: false }),
        [
            check('title', 'Title not provided').not().isEmpty(),
            check('company', 'Company not provided').not().isEmpty(),
            check('from', 'From date not provided').not().isEmpty()
        ]
    ],
    async (req, res) => {
        const errors = validationResult(req)

        if(!errors.isEmpty()) return res.status(400).json({ errors: errors.array })
        
        const { title, company, location, from, to, current, description } = req.body
        const newExp = { title, company, location, from, to, current, description }

        try {
            let profile = await Profile.findOne({ user: req.user.id })

            profile.experience.unshift(newExp)
            await profile.save()
            res.status(200).json(profile)
        } catch (err) {
            console.log(err.message)
            res.status(500).send('Server Error')
        }
})

router.put('/education', [
        passport.authenticate('jwt', { session: false }),
        [
            check('school', 'School not provided').not().isEmpty(),
            check('degree', 'Degree not provided').not().isEmpty(),
            check('program', 'Program not provided').not().isEmpty(),
            check('from', 'From date not provided').not().isEmpty()
        ]
    ],
    async (req, res) => {
        const errors = validationResult(req)

        if(!errors.isEmpty()) return res.status(400).json({ errors: errors.array })
        
        const { school, degree, program, from, to, current, description } = req.body
        const newEdu = { school, degree, program, from, to, current, description }

        try {
            let profile = await Profile.findOne({ user: req.user.id })

            profile.education.unshift(newEdu)
            await profile.save()
            res.status(200).json(profile)
        } catch (err) {
            console.log(err.message)
            res.status(500).send('Server Error')
        }
})

router.delete('/', passport.authenticate('jwt', { session: false }), async(req, res) => {
    try {
        await Post.deleteMany({ user: req.user.id })
        await Profile.findOneAndRemove({ user: req.user.id })
        await Auth.findByIdAndRemove({ _id: req.user.id })
        res.status(200).json({ msg: 'User deleted'})
    } catch (err) {
        console.log(err.message)
        res.status(500).send('Server Error')
    }
})

router.delete('/experience/:exp_id', passport.authenticate('jwt', { session: false }), async(req, res) => {
    try {
        let profile = await Profile.findOne({ user: req.user.id })
        let removeIndex = profile.experience.map((item) => item.id).indexOf(req.params.exp_id)

        profile.experience.splice(removeIndex, 1)
        await profile.save()
        res.status(200).json(profile)
    } catch (err) {
        console.log(err.message)
        res.status(500).send('Server Error')
    }
})

router.delete('/education/:edu_id', passport.authenticate('jwt', { session: false }), async(req, res) => {
    try {
        let profile = await Profile.findOne({ user: req.user.id })
        let removeIndex = profile.education.map((item) => item.id).indexOf(req.params.edu_id)

        profile.education.splice(removeIndex, 1)
        await profile.save()
        res.status(200).json(profile)
    } catch (err) {
        console.log(err.message)
        res.status(500).send('Server Error')
    }
})

module.exports = router