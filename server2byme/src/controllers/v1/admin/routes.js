const router = require('express').Router();
const AuthHelper = require('../../../models/helpers/AuthHelper');
const { usersRoles } = require('../../../config/Options');

const user = require('./user/routes')
const product=require("./product/routes")
const cart=require("./cart/routes")
const order=require("./order/routes")
const payment=require("./payment/routes")
const invoice=require("./invoice/routes")
const visit=require("./visit/routes")
const location=require("./location/routes")
const cartItem=require("./cartItem/routes")



router.use('/user',  user);
router.use('/product',product);
router.use('/cart',cart);
router.use('/order',order);
router.use('/payment',payment);
router.use('/invoice',invoice);
router.use('/visit',visit);                
router.use('/location',location);
router.use('/cartItem',(req,res,next)=>{console.log("Come Up to cartItem ") ;next()},cartItem);












const seminar = require('./seminar/routes')
const questionSet = require('./questionSet/routes')
const question = require('./question/routes')
const result=require("./result/routes")

router.use('/seminar',AuthHelper.authenticateJWT(usersRoles.getADMIN()), seminar);
router.use('/questionSet',AuthHelper.authenticateJWT(usersRoles.getADMIN()), questionSet);
router.use('/question',AuthHelper.authenticateJWT(usersRoles.getADMIN()), question);
router.use('/result', AuthHelper.authenticateJWT(usersRoles.getADMIN()), result);





module.exports = router;
