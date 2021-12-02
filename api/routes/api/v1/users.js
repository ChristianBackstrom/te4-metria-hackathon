const express = require('express');
const router = express.Router();
const { User } = require('../../../models');

router.get('/:id', async (req, res) => {
    const user = await User.findByPk(req.params.id);
    res.json({user});
});

module.exports = router;