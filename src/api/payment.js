import request from './request';

const PaymentService = {
  createPaymentMethod: data => {
    const host = 'http://10.0.2.2:4242';
    const path = '/payment/createPaymentMethod';

    return request({
      url: `${path}`,
      method: 'post',
      data: data,
    });
  },
  createPaymentIntent: data => {
    const host = 'http://10.0.2.2:4242';
    const path = '/payment/createPaymentIntent';

    return request({
      url: `${path}`,
      method: 'post',
      data: data,
    });
  },
  getPaymentIntet: param => {
    const host = 'http://10.0.2.2:4242';
    const path = '/payment/paymentIntent';

    return request({
      url: `${path}${param}`,
      method: 'get',
    });
  },
  refundPaymentIntent: param => {
    const host = 'http://10.0.2.2:4242';
    const path = '/payment/refundPayment';

    return request({
      url: `${path}${param}`,
      method: 'get',
    });
  },
  payWithoutWebHook: data => {
    const path = '/payment/pay-without-webhooks';
    return request({
      url: `${path}`,
      method: 'post',
      data: data,
    });
  },
};

export default PaymentService;
