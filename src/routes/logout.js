const { Router } = require('express');

const router = Router();

router.post('/', (req, res, next) => {
    try {
        if (req.user) {
            req.logOut();
            res.sendStatus(200);
        } else {
            res.sendStatus(400);
        }
    } catch (error) {
        next();
    }
});

module.exports = router;
