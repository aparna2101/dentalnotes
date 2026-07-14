const router = require('express').Router();
const adminRouter = require('./admin/routes');
const websiteRouter = require('./website/routes');

router.use('/admin', adminRouter);
router.use('/website',websiteRouter);
module.exports = router;
