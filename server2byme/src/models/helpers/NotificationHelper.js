const fcmAdmin = require('../../config/FCM');

exports.triggerFCM = async (deviceTokens, data) => {
  try {
    console.log('Notification trigger called');
    let payloadData = {
      title: data.title || '',
      message: data.message || '',
      type: data.type || '',
      // additional: data.additional ? JSON.stringify(data.additional) : "",
    };
    let payload = {
      notification: {
        body: data.message || '',
        title: data.title || '',
      },
      data: payloadData,
    };
    fcmAdmin
      .messaging()
      .sendToDevice(deviceTokens, payload)
      .then((res) => {})
      .catch((error) => {
        console.log('error........Notification not sent', error);
      });
    return true;
  } catch (e) {
    throw e;
  }
};
exports.triggerOTP = async (payload, OTP) => {
  if (process.env.ENVIRONMENT === 'development') {
    return;
  }
  const options = {
    method: 'get',
    url: `${process.env.MSG_91_API}/otp?template_id=${process.env.MSG_91_DLT_TE_OTP_ID}&mobile=${payload.countryCode}${payload.mobileNumber}&authkey=${process.env.MSG_91_AUTH_KEY}&otp=${OTP}`,
    body: JSON.stringify({ Param1: OTP }),
  };
  try {
    const response = await axios(options);
    const responseOK =
      response && (response.status === 200 || response.status === 400);
    if (responseOK) {
      return response.data;
    }
  } catch (error) {
    customErrorLogger(error);
    throw new Error(error.message || 'SMS Sending Failed');
  }
};
exports.triggerSMS = async (payload) => {
  if (process.env.NODE_ENV === 'development') {
    return;
  }
  const options = {
    method: 'post',
    url: process.env.MSG_91_API,
    headers: {
      authorization: process.env.MSG_91_AUTH_KEY,
    },
    data: payload,
  };
  const response = await axios(options);
  const responseOK =
    response && (response.status >= 200 || response.status < 300);
  if (responseOK) {
    console.log('sms', response.data);
    return response.data;
  }
  customErrorLogger(response.data);
};