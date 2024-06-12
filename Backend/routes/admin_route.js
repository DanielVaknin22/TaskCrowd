const express = require('express');
const router = express.Router();

router.get('/admin-dashboard', (req, res) => {
    res.send('Welcome to the admin dashboard');
});

module.exports = router;