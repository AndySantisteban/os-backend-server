// @ts-check
const Enterprise = require('../models/Enterprise');
const { verifyTokenAndAuthorization, verifyTokenAndAdmin } = require('./verifyToken');

const router = require('express').Router();

router.get('/', verifyTokenAndAdmin, async (req, res) => {
    const query = req.query.new;
    try {
        const enterprise = query ? await Enterprise.find().sort({ _id: -1 }).limit(5) : await Enterprise.find();
        res.status(200).json(enterprise);
    } catch (err) {
        res.status(500).json({
            message: err.message,
        });
    }
});

router.get('/find/:id', verifyTokenAndAdmin, async (req, res) => {
    try {
        const enterprise = await Enterprise.findById(req.params.id);
        const { password, ...others } = enterprise._doc;
        res.status(200).json(others);
    } catch (err) {
        res.status(500).json({
            message: err.message,
        });
    }
});

router.get('/stats', verifyTokenAndAdmin, async (req, res) => {
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

    try {
        const data = await Enterprise.aggregate([
            { $match: { createdAt: { $gte: lastYear } } },
            {
                $project: {
                    month: { $month: '$createdAt' },
                },
            },
            {
                $group: {
                    _id: '$month',
                    total: { $sum: 1 },
                },
            },
        ]);
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({
            message: err.message,
        });
    }
});

router.put('/:id', verifyTokenAndAuthorization, async (req, res) => {
    if (req.body.password) {
        req.body.password = CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SEC).toString();
    }

    try {
        const updatedEnterprise = await Enterprise.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body,
            },
            { new: true }
        );
        res.status(200).json(updatedEnterprise);
    } catch (err) {
        res.status(500).json({
            message: err.message,
        });
    }
});

router.delete('/:id', verifyTokenAndAuthorization, async (req, res) => {
    try {
        await Enterprise.findByIdAndDelete(req.params.id);
        res.status(200).json('Enterprise deleted');
    } catch (err) {
        res.status(500).json({
            message: err.message,
        });
    }
});
module.exports = router;
