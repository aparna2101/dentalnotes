const User = require('../../../../models/User');
const Message = require('../../../../models/message');
const Chat = require('../../../../models/chat');
const Settings=require("../../../../models/Setting")
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

const settings = {


   createSettings: async (req, res) => {
    try {
      const cloudinary = require('../../../../../utils/cloudinary');
      
      // Extract data from request body
      let {
        companyName,
        contactEmail,
        subscription = "{}",
      } = req.body;

      subscription = typeof subscription === 'string' ? JSON.parse(subscription) : subscription;

      // Handle File Uploads
      let logoUrl = "";
      let promoVideoUrl = "";

      if (req.files) {
        if (req.files.image && req.files.image[0]) {
          logoUrl = await cloudinary.uploadFromBuffer(req.files.image[0].buffer);
        }
        if (req.files.video && req.files.video[0]) {
          promoVideoUrl = await cloudinary.uploadFromBuffer(req.files.video[0].buffer);
        }
      }

      // Check if settings already exist
      let existingSettings = await Settings.findOne({});

      if (existingSettings) {
        // Update existing settings
        existingSettings.companyName = companyName || existingSettings.companyName;
        if (logoUrl) existingSettings.logo = logoUrl;
        existingSettings.contactEmail = contactEmail || existingSettings.contactEmail;
        
        existingSettings.subscription = {
          planName: subscription.planName || existingSettings.subscription.planName,
          price: subscription.price || existingSettings.subscription.price,
          durationInDays: subscription.durationInDays || existingSettings.subscription.durationInDays,
          features: subscription.features || existingSettings.subscription.features,
          promoVideoUrl: promoVideoUrl || existingSettings.subscription.promoVideoUrl,
          descriptionPoints: subscription.descriptionPoints || existingSettings.subscription.descriptionPoints,
        };
        
        existingSettings.updatedAt = Date.now();
        await existingSettings.save();

        return res.success({
          message: "Settings updated successfully",
          data: existingSettings,
        });
      } else {
        // Create new settings
        const newSettings = await Settings.create({
          companyName,
          logo: logoUrl,
          contactEmail,
          subscription: {
            ...subscription,
            promoVideoUrl,
          },
        });

        return res.success({
          message: "Settings created successfully",
          data: newSettings,
        });
      }
    } catch (err) {
      console.error("Error creating/updating settings:", err);
      return res.serverError(err.message || "Internal Server Error");
    }
  },

  getSettings: async (req, res) => {
  try {
    let {
      page = 1,
      pageSize = 9999999,
      search = null,
      column = "createdAt",
      direction = -1,
    } = req.query;

    const skip = Math.max(0, parseInt(page, 10) - 1) * parseInt(pageSize, 10);
    const sortOptions = { [column]: parseInt(direction, 10) };

    // Build search filter (optional)
    let filter = {};
    if (search) {
      filter = {
        $or: [
          { companyName: { $regex: search, $options: "i" } },
          { contactEmail: { $regex: search, $options: "i" } },
          { "subscription.planName": { $regex: search, $options: "i" } },
        ],
      };
    }

    // Get total count
    const totalCount = await Settings.countDocuments(filter);

    // Fetch paginated data
    const settings = await Settings.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(pageSize, 10));

    // Return success response
    return res.success({
     
      data: settings,
      pagination: {
        total: totalCount,
        page: parseInt(page, 10),
        pageSize: parseInt(pageSize, 10),
        totalPages: Math.ceil(totalCount / parseInt(pageSize, 10)),
      },
    });
  } catch (err) {
    console.error("Error fetching settings:", err);
    return res.serverError(err.message || "Internal Server Error");
  }
},




  // createSettings: async (req, res) => {
  //   try {
  //     let {
  //       page = 1,
  //       pageSize = 9999999,
  //       search = null,
  //       column = 'createdAt',
  //       direction = -1,
  //       role = [],
  //     } = req.query;

  //     const { content } = req.body;
  //     const skip = Math.max(0, parseInt(page, 10) - 1) * parseInt(pageSize, 10);

  //     const senderId = req.user.id;
  //     const receiverId = new mongoose.Types.ObjectId(req.params.id);

  //     var chat = await Chat.findOne({
  //       participants: { $all: [senderId, receiverId] },
  //     });

  //     if (!chat) {
  //       chat = new Chat({
  //         participants: [senderId, receiverId],
  //         lastMessage: content,
  //         lastMessageAt: Date.now(),
  //       });
  //       await chat.save();
  //     } else {
  //       // Update the chat with the latest message
  //       chat.lastMessage = content;
  //       chat.lastMessageAt = Date.now();
  //       await chat.save();
  //     }

  //     const newMessage = await Message.create({
  //       chatId: chat._id,
  //       content: content,
  //       receiver: receiverId,
  //       sender: senderId,
  //     });

  //     return res.success({
  //       data: newMessage,
  //     });
  //   } catch (err) {
  //     console.log(err);
  //     res.serverError(errors);
  //   }
  // },




  // getSettings: async (req, res) => {
  //   try {
  //     let {
  //       page = 1,
  //       pageSize = 9999999,
  //       search = null,
  //       column = 'createdAt',
  //       direction = -1,
  //       role = [],

  //       chatId = null,
  //     } = req.query;

  //     const skip = Math.max(0, parseInt(page, 10) - 1) * parseInt(pageSize, 10);
  //     const senderId = req.user._id;
  //     const receiverId = new mongoose.Types.ObjectId(req.params.id);
  //     // if (!false) {
  //     //   var chat = await Chat.findOne({
  //     //     participants: { $all: [senderId, receiverId] },
  //     //   });
  //     //   chatId = chat?._id;
  //     // }
  //     // const message = await Message.find({ chatId: chatId }).sort({
  //     //   createdAt: 1,
  //     // });

  //     return res.success({
  //       data: message,
  //     });
  //   } catch (err) {
  //     console.log(err);
  //     res.serverError(errors);
  //   }
  // },

  // createPayment: async (req, res) => {
  //   try {
  //     let {
  //       page = 1,
  //       pageSize = 9999999,
  //       search = null,
  //       column = 'createdAt',
  //       direction = -1,
  //       role = [],
  //       chatId = null,
  //     } = req.query;

  //     var { amount = 0 } = req.body;

  //     const user = await User.findOne({ _id: req.user._id });

  //     console.log('got the user', user);
  //     amount = 499;
  //     const options = {
  //       amount: amount * 100, // Convert to paise (₹500 => 50000 paise)
  //       currency: 'INR',
  //       receipt: `receipt_${Date.now()}`,
  //     };

  //     const order = await razorpay.orders.create(options);
  //     order.amount = options.amount;
  //     console.log('your order', order);

  //     user.orderId = order.id;
  //     await user.save();

  //     console.log('your after save', user);

  //     res.success({ data: order });
  //   } catch (err) {
  //     console.log(err);
  //   }
  // },

  // verifyPayment: async (req, res) => {
  //   const crypto = require('crypto');
  //   const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
  //     req.body;
  //   const user = await User.findOne({ orderId: razorpay_order_id });
  //   const key_secret = 'ZNoTWuTDMj7Svw0eJr501VDl';

  //   const generatedSignature = crypto
  //     .createHmac('sha256', key_secret)
  //     .update(`${razorpay_order_id}|${razorpay_payment_id}`)
  //     .digest('hex');

  //   if (generatedSignature === razorpay_signature) {
  //     user.isPremium = true;
  //     await user.save();
  //     res.success({ success: true, message: 'Payment successfull and saved!' });
  //   } else {
  //     res
  //       .status(400)
  //       .json({ success: false, message: 'Payment verification failed!' });
  //   }
  // },

  // newPhonePayPayment: async (req, res) => {
  //   try {
  //     const merchantTransactionId = `${req.body.userId}-${Date.now()}`;
  //     const user=await User.findById(req?.user?._id);
  //     if(!user){
  //       res.status(404).json({
  //       message :"Login user Not found",
  //       success:false
  //       })

  //     }
     
  //     user.orderId=merchantTransactionId;
  //     await user.save();

  //     const data = {
  //       merchantId: merchant_id,
  //       merchantTransactionId: merchantTransactionId,
  //       merchantUserId: 'XSJJFMJMFJ',

  //       amount: 599 * 100,
  //       redirectUrl: `https://api.dentalnotesrep.com/api/v1/website/paymentGateWay/verify/${merchantTransactionId}`,
  //       redirectMode: 'POST',
       
  //       paymentInstrument: {
  //         type: 'PAY_PAGE',
  //       },
  //     };
  //     const payload = JSON.stringify(data);
  //     const payloadMain = Buffer.from(payload).toString('base64');
  //     const keyIndex = 1;
  //     const stringToHash = payloadMain + '/pg/v1/pay' + salt_key;
  //     const sha256 = crypto
  //       .createHash('sha256')
  //       .update(stringToHash)
  //       .digest('hex');
  //     const checksum = `${sha256}###${keyIndex}`;

     

  //     const prod_URL = 'https://api.phonepe.com/apis/hermes/pg/v1/pay';
  //     // const prod_URL = 'https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay';
  //     const options = {
  //       method: 'POST',
  //       url: prod_URL,
  //       headers: {
  //         accept: 'application/json',
  //         'Content-Type': 'application/json',
  //         'X-VERIFY': checksum,
  //       },
  //       data: {
  //         request: payloadMain,
  //       },
  //     };

  //     const response = await axios.request(options);

  //     return res
  //       .status(200)
  //       .json({
  //         redirect: response?.data?.data?.instrumentResponse?.redirectInfo?.url,
  //       });
  //     // return res.redirect(response.data.data.instrumentResponse.redirectInfo.url);
  //   } catch (error) {
  //     console.error('Payment Error:', error);
  //     return res.status(500).json({
  //       message: 'Payment request failed',
  //       error: error.message,
  //       success: false,
  //     });
  //   }
  // },

  // verifyPhonePayPayment: async (req, res) => {
  //   try {
  //     const { id } = req.params; // Get transaction ID from URL
  //     const paymentData = req.body; // Get PhonePe's response data
    
  //     console.log("Your orderId in verification:", id);
  //     console.log("Your Payment Data in verification:", paymentData);
    
  //     const user = await User.findOne({ orderId: id });
    
  //     console.log("Your user found by orderId:", user);
    
  //     // ✅ Change this condition to check if the payment was successful
  //     if (paymentData.code === 'PAYMENT_SUCCESS' && user) {
  //       user.isPremium = true; // Mark user as premium
  //       await user.save();
  //       return res.status(200).json({ message: 'Payment Successful', success: true });
  //     } else {
  //       return res.status(400).json({ message: 'Payment Failed', success: false });
  //     }
    
  //   } catch (error) {
  //     console.error('Payment Status Error:', error);
  //     return res.status(500).json({ message: 'Error updating payment', error });
  //   }
  // },
};

module.exports = settings;
