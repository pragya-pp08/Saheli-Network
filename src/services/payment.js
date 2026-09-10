import { post } from './api';

let checkoutScript;
function loadCheckout() {
  if (window.Razorpay) return Promise.resolve();
  if (!checkoutScript) checkoutScript = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = resolve;
    script.onerror = () => { checkoutScript = null; script.remove(); reject(new Error('Payment checkout could not load.')); };
    document.head.appendChild(script);
  });
  return checkoutScript;
}

export async function payForOrder(id) {
  const checkout = await post(`/orders/${id}/payment`);
  await loadCheckout();
  return new Promise((resolve, reject) => {
    const widget = new window.Razorpay({ ...checkout, name: 'Saheli Network', description: 'Payment for completed work',
      handler: async result => {
        try { await post(`/orders/${id}/payment/verify`, result); resolve(); }
        catch (err) { reject(err); }
      },
      modal: { ondismiss: () => reject(new Error('Checkout closed. No confirmed payment has been recorded yet.')) },
      theme: { color: '#f43f5e' },
    });
    widget.on('payment.failed', () => reject(new Error('Payment failed. Please try again.')));
    widget.open();
  });
}
