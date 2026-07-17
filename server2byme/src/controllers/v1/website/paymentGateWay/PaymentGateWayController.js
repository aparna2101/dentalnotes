const User = require('../../../../models/User');
const SubscriptionHistorhy = require('../../../../models/subscriptionHistory');
const Message = require('../../../../models/message');
const Chat = require('../../../../models/chat');
const Settings = require('../../../../models/Setting');
const salt_key = '5bbad229-14dc-433f-b6e3-3bdafe731bd8';
const merchant_id = 'M22U0V6S6UC4P';

const crypto = require('crypto');
const axios = require('axios');

const Razorpay = require('razorpay');

const mongoose = require('mongoose');

const razorpay = new Razorpay({
  key_id: 'rzp_test_r5JK3GVo92vEPm', // Test Key ID
  key_secret: 'ZNoTWuTDMj7Svw0eJr501VDl', // Test Key Secret
});

const userObj = {
  message: async (req, res) => {
    try {
      let {
        page = 1,
        pageSize = 9999999,
        search = null,
        column = 'createdAt',
        direction = -1,
        role = [],
      } = req.query;

      const { content } = req.body;
      const skip = Math.max(0, parseInt(page, 10) - 1) * parseInt(pageSize, 10);

      const senderId = req.user.id;
      const receiverId = new mongoose.Types.ObjectId(req.params.id);

      var chat = await Chat.findOne({
        participants: { $all: [senderId, receiverId] },
      });

      if (!chat) {
        chat = new Chat({
          participants: [senderId, receiverId],
          lastMessage: content,
          lastMessageAt: Date.now(),
        });
        await chat.save();
      } else {
        // Update the chat with the latest message
        chat.lastMessage = content;
        chat.lastMessageAt = Date.now();
        await chat.save();
      }

      const newMessage = await Message.create({
        chatId: chat._id,
        content: content,
        receiver: receiverId,
        sender: senderId,
      });

      return res.success({
        data: newMessage,
      });
    } catch (err) {
      console.log(err);
      res.serverError(errors);
    }
  },

  getAllmessage: async (req, res) => {
    try {
      let {
        page = 1,
        pageSize = 9999999,
        search = null,
        column = 'createdAt',
        direction = -1,
        role = [],

        chatId = null,
      } = req.query;

      const skip = Math.max(0, parseInt(page, 10) - 1) * parseInt(pageSize, 10);
      const senderId = req.user._id;
      const receiverId = new mongoose.Types.ObjectId(req.params.id);
      if (!false) {
        var chat = await Chat.findOne({
          participants: { $all: [senderId, receiverId] },
        });
        chatId = chat?._id;
      }
      const message = await Message.find({ chatId: chatId }).sort({
        createdAt: 1,
      });

      return res.success({
        data: message,
      });
    } catch (err) {
      console.log(err);
      res.serverError(errors);
    }
  },

  createPayment: async (req, res) => {
    try {
      let {
        page = 1,
        pageSize = 9999999,
        search = null,
        column = 'createdAt',
        direction = -1,
        role = [],
        chatId = null,
      } = req.query;

      var { amount = 0 } = req.body;

      const user = await User.findOne({ _id: req.user._id });

      console.log('got the user', user);
      amount = 499;
      const options = {
        amount: amount * 100, // Convert to paise (₹500 => 50000 paise)
        currency: 'INR',
        receipt: `receipt_${Date.now()}`,
      };

      const order = await razorpay.orders.create(options);
      order.amount = options.amount;
      console.log('your order', order);

      user.orderId = order.id;
      await user.save();

      console.log('your after save', user);

      res.success({ data: order });
    } catch (err) {
      console.log(err);
    }
  },

  verifyPayment: async (req, res) => {
    const crypto = require('crypto');
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;
    const user = await User.findOne({ orderId: razorpay_order_id });
    const key_secret = 'ZNoTWuTDMj7Svw0eJr501VDl';

    const generatedSignature = crypto
      .createHmac('sha256', key_secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generatedSignature === razorpay_signature) {
      user.isPremium = true;
      await user.save();
      res.success({ success: true, message: 'Payment successfull and saved!' });
    } else {
      res
        .status(400)
        .json({ success: false, message: 'Payment verification failed!' });
    }
  },

  newPhonePayPayment: async (req, res) => {
    try {
      const merchantTransactionId = `${req.body.userId}-${Date.now()}`;
      const { subscriptionInfoObject = null } = req.body;
      const user = await User.findById(req?.user?._id);
      let existingSettings = await Settings.findOne({});
      if (!user) {
        res.status(404).json({
          message: 'Login user Not found',
          success: false,
        });
      }

      var finalPaymentPrice = existingSettings?.subscription?.price || null;

      if (subscriptionInfoObject.subscriptionType !== 'default') {
        finalPaymentPrice = subscriptionInfoObject?.moduleInfo?.price;
      }

      var moduleInfo = {
        subscriptionType: subscriptionInfoObject.subscriptionType,
        moduleInfo: subscriptionInfoObject.moduleInfo,
        spanLife: 365,
        price: finalPaymentPrice,
      };

      if (!finalPaymentPrice) {
        res.status(404).json({
          message: 'Currently Payment Gateway dont accepting Request',
          success: false,
        });
      }

      user.orderId = merchantTransactionId;
      user.subscriptionInfo = moduleInfo;
      await user.save();

      // Save pending transaction details to prevent overwriting issues on multiple clicks
      await mongoose.connection.db.collection('PendingOrder').updateOne(
        { _id: merchantTransactionId },
        {
          $set: {
            userId: user._id,
            subscriptionInfo: moduleInfo,
            createdAt: new Date()
          }
        },
        { upsert: true }
      );

      const data = {
        merchantId: merchant_id,
        merchantTransactionId: merchantTransactionId,
        merchantUserId: 'XSJJFMJMFJ',

        amount: finalPaymentPrice * 100,
        redirectUrl: `${req.protocol}://${req.get('host')}/api/v1/website/paymentGateWay/verify/${merchantTransactionId}`,
        redirectMode: 'POST',


        paymentInstrument: {
          type: 'PAY_PAGE',
        },
      };
      const payload = JSON.stringify(data);
      const payloadMain = Buffer.from(payload).toString('base64');
      const keyIndex = 1;
      const stringToHash = payloadMain + '/pg/v1/pay' + salt_key;
      const sha256 = crypto
        .createHash('sha256')
        .update(stringToHash)
        .digest('hex');
      const checksum = `${sha256}###${keyIndex}`;

      const prod_URL = 'https://api.phonepe.com/apis/hermes/pg/v1/pay';
      // const prod_URL = 'https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay';
      const options = {
        method: 'POST',
        url: prod_URL,
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json',
          'X-VERIFY': checksum,
          'X-MERCHANT-ID': merchant_id
        },
        data: {
          request: payloadMain,
        },
      };

      const response = await axios.request(options);

      return res.status(200).json({
        redirect: response?.data?.data?.instrumentResponse?.redirectInfo?.url,
      });
      // return res.redirect(response.data.data.instrumentResponse.redirectInfo.url);
    } catch (error) {
      console.error('Payment Error:', error);
      return res.status(500).json({
        message: 'Payment request failed',
        error: error.message,
        success: false,
      });
    }
  },

  verifyPhonePayPayment: async (req, res) => {
    try {
      const { id } = req.params; // Get transaction ID from URL
      console.log('Your orderId in verification:', id);

      // Query PhonePe Status API directly to fetch the source-of-truth status
      const keyIndex = 1;
      const stringToHash = `/pg/v1/status/${merchant_id}/${id}` + salt_key;
      const sha256 = crypto
        .createHash('sha256')
        .update(stringToHash)
        .digest('hex');
      const checksum = `${sha256}###${keyIndex}`;

      const url = `https://api.phonepe.com/apis/hermes/pg/v1/status/${merchant_id}/${id}`;
      
      console.log(`Checking live status for transaction ${id}...`);
      const phonepeResponse = await axios.get(url, {
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json',
          'X-VERIFY': checksum,
          'X-MERCHANT-ID': merchant_id
        }
      });

      const paymentData = phonepeResponse?.data;
      console.log('PhonePe API Status response:', paymentData);

      // Retrieve the pending order mapping to get the correct user and subject
      const pendingOrder = await mongoose.connection.db.collection('PendingOrder').findOne({ _id: id });
      console.log('Your pending order found by id:', pendingOrder);

      // Lookup user using the pending order's userId
      const user = pendingOrder ? await User.findById(pendingOrder.userId) : null;
      console.log('Your user found by pending order:', user);

      // Check if PhonePe returns successful payment code and state is COMPLETED
      const isSuccess = paymentData && (paymentData.code === 'PAYMENT_SUCCESS' || (paymentData.data && paymentData.data.state === 'COMPLETED'));

      if (isSuccess && user && pendingOrder) {
        const subsctiption = pendingOrder.subscriptionInfo;

        // Check if history already exists to prevent duplicate insertion
        const existingHistory = await SubscriptionHistorhy.findOne({ orderId: id });
        if (!existingHistory) {
          await SubscriptionHistorhy.create({
            userId: user._id,
            orderId: id,
            spanLife: subsctiption?.spanLife || 365,
            price: subsctiption?.price,
            module: subsctiption?.moduleInfo,
            subscriptionType: subsctiption?.subscriptionType
          });
        }
        await user.save();

        // Clean up pending order since it is successfully processed
        await mongoose.connection.db.collection('PendingOrder').deleteOne({ _id: id });
        
        // Redirect back to frontend success page
        return res.redirect('https://dentalnotesrep.com/notessubject');
      } else {
        console.log('Payment verification failed or user not found. Redirecting to failed page.');
        return res.redirect('https://dentalnotesrep.com/notessubject?status=failed');
      }
    } catch (error) {
      console.error('Payment Status Verification Error:', error);
      return res.redirect('https://dentalnotesrep.com/notessubject?status=error');
    }
  },
};

module.exports = userObj;
