module.exports = {
    mongoURI: process.env.mongoURI,
    secretOrKey: process.env.secretOrKey,
    refreshTokenSecret: process.env.refreshTokenSecret,
    port: process.env.port,
    tokenLife: process.env.tokenLife,
    refreshTokenLife: process.env.refreshTokenLife
}