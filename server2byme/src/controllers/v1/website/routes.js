const router = require('express').Router();
const AuthHelper = require('../../../models/helpers/AuthHelper');
const { usersRoles } = require('../../../config/Options');


const user=require("./user/routes")
const basicDetail=require("./BasicDetail/routes")
const chat=require("./chat/routes")
const paymentGateWay=require("./paymentGateWay/routes")


router.use('/user',user);
router.use("/chat",chat)
router.use("/paymentGateWay",paymentGateWay)
router.use('/basicDetail',basicDetail)






const cart = require('./cart/routes');
const order = require('./order/routes');

router.use('/cart', cart);
router.use('/order', order);
const student = require('./student/routes');
router.use('/student', student);

module.exports = router;
