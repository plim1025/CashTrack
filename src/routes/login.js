const { Router } = require('express');
const passport = require('passport');

const router = Router();

router.get('/', (req, res, next) => {
    try {
        res.json({ error: req.session.flash.error.slice(-1)[0] });
    } catch (error) {
        next();
    }
});

router.post(
    '/',
    passport.authenticate('local', {
        failureFlash: true,
        failureRedirect: '/login',
        successRedirect: '/',
    })
);

module.exports = router;
