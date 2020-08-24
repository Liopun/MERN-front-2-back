const express   = require('express'),
      router    = express.Router(),
      passport  = require('passport'),
      jwt       = require('jsonwebtoken')

const { check, validationResult } = require('express-validator')

const Profile = require('../../models/profile-model')
const Auth    = require('../../models/auth-model')
const Post    = require('../../models/post-model')

router.get('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const posts = await Post.find().sort({ date: -1 })

        return res.status(200).json(posts)
    } catch (err) {
        console.log(err.message)
        return res.status(500).send('Server Error')
    }
})

router.get('/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)

        if(!post) return res.status(404).json({ msg: 'Page not found' })

        return res.status(200).json(post)
    } catch (err) {
        console.log(err.message)
        if(err.kind === 'ObjectId') return res.status(404).send({ msg: 'Post not found'})
        return res.status(500).send('Server Error')
    }
})

router.post('/', [
        passport.authenticate('jwt', { session: false }),
        [check('text', 'Text not provided').not().isEmpty()]
    ],
    async (req, res) => {
        const errors = validationResult(req)
        if(!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

        try {
            const user = await Auth.findById(req.user.id).select('-password')
            const newPost = new Post({
                text: req.body.text,
                name: user.name,
                avatar: user.avatar,
                user: req.user.id
            })

            const post = await newPost.save()
            return res.status(200).json(post)
        } catch (err) {
            console.log(err.message)
            return res.status(500).send('Server Error')
        }
})

router.post('/comment/:id', [
        passport.authenticate('jwt', { session: false }),
        [check('text', 'Text not provided').not().isEmpty()]
    ],
    async (req, res) => {
        const errors = validationResult(req)
        if(!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

        try {
            const user = await Auth.findById(req.user.id).select('-password')
            const post = await Post.findById(req.params.id)
            const newComment = {
                text: req.body.text,
                name: user.name,
                avatar: user.avatar,
                user: req.user.id
            }

            post.comments.unshift(newComment)
            await post.save()
            return res.status(200).json(post.comments)
        } catch (err) {
            console.log(err.message)
            return res.status(500).send('Server Error')
        }
})

router.put('/like/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)

        if(post.likes.filter((like) => like.user.toString() === req.user.id).length > 0)
            return res.status(400).json({ msg: 'You already likes this post'})
        
        post.likes.unshift({ user: req.user.id })
        await post.save()
        return res.status(200).json(post.likes)
    } catch (err) {
        console.log(err.message)
        return res.status(500).send('Server Error')
    }
})

router.put('/unlike/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)

        if(post.likes.filter((like) => like.user.toString() === req.user.id).length === 0)
            return res.status(400).json({ msg: 'Post has 0 likes'})

        const removeIndex = post.likes.map((like) => like.user.toString()).indexOf(req.user.id)

        post.likes.splice(removeIndex, 1)
        await post.save()
        return res.json(post.likes)
    } catch (err) {
        console.log(err.message)
        return res.status(500).send('Server Error')
    }
})

router.delete('/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)

        if(!post) return res.status(404).send({ msg: 'Post not found'})
        if(post.user.toString() !== req.user.id) return res.status(401).json({ msg: 'Unauthorized user'})

        await post.remove()
        res.status(200).json({ msg: 'Post removed'})
    } catch (err) {
        console.log(err.message)
        if(err.kind === 'ObjectId') return res.status(404).send({ msg: 'Post not found'})
        return res.status(500).send('Server Error')
    }
})

router.delete('/comment/:id/:comment_id', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        const comment = post.comments.find((comment) => comment.id === req.params.comment_id)

        if(!comment) return res.status(404).json({ msg: 'Comment does not exist'})
        if(comment.user.toString() !== req.user.id) return res.status(401).json({ msg: 'Unauthorized user'})

        const removeIndex = post.comments.map((comment) => comment.user.toString())
                                            .indexOf(req.user.id)
        
        post.comments.splice(removeIndex, 1)
        await post.save()
        return res.status(200).json(post.comments)
    } catch (err) {
        console.log(err.message)
        return res.status(500).send('Server Error')
    }
})

module.exports = router