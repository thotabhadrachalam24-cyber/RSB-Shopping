import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { formatToINR } from '../utils/currency';

const CheckoutForm = ({ cart, addresses, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const formik = useFormik({
    initialValues: {
      addressId: addresses?.[0]?._id || '',
      paymentMethod: 'razorpay'
    },
    validationSchema: Yup.object({
      addressId: Yup.string().required('Please select a delivery address'),
      paymentMethod: Yup.string().required('Please select a payment method')
    }),
    onSubmit: handleSubmit
  });

  async function handleSubmit(values) {
    try {
      setLoading(true);
      setError('');

      // Create Razorpay order
      const { data: orderData } = await axios.post('/api/payments/razorpay/create-order', {
        amount: cart.total // Amount should be in paise
      });

      const selectedAddress = addresses.find(addr => addr._id === values.addressId);

      // Initialize Razorpay
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderData.order.amount,
        currency: "INR",
        name: "RSB Shopping",
        description: `Order for ${cart.items.length} items`,
        order_id: orderData.order.id,
        handler: async function(response) {
          // Verify payment
          await axios.post('/api/payments/razorpay/verify', {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature
          });

          // Create order
          const order = await axios.post('/api/orders', {
            addressId: values.addressId,
            paymentId: response.razorpay_payment_id,
            paymentMethod: 'razorpay'
          });

          onSuccess?.(order.data);
        },
        prefill: {
          name: selectedAddress?.name,
          contact: selectedAddress?.phone,
        },
        theme: {
          color: "#0284c7" // primary-600
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      setError(err.response?.data?.message || 'Error processing payment');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6">
      {/* Delivery Address Selection */}
      <div>
        <h3 className="text-lg font-medium">Select Delivery Address</h3>
        <div className="mt-4 space-y-4">
          {addresses?.map(address => (
            <label
              key={address._id}
              className="flex items-start p-4 border rounded-lg cursor-pointer hover:border-primary-500"
            >
              <input
                type="radio"
                name="addressId"
                value={address._id}
                checked={formik.values.addressId === address._id}
                onChange={formik.handleChange}
                className="mt-1"
              />
              <div className="ml-4">
                <p className="font-medium">{address.name}</p>
                <p className="text-sm text-gray-600">{address.street}</p>
                <p className="text-sm text-gray-600">
                  {address.city}, {address.state} - {address.pincode}
                </p>
                <p className="text-sm text-gray-600">Phone: {address.phone}</p>
              </div>
            </label>
          ))}
        </div>
        {formik.touched.addressId && formik.errors.addressId && (
          <p className="mt-2 text-sm text-red-600">{formik.errors.addressId}</p>
        )}
      </div>

      {/* Order Summary */}
      <div className="p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-medium">Order Summary</h3>
        <div className="mt-4 space-y-2">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatToINR(cart.subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>GST (18%)</span>
            <span>{formatToINR(cart.gst)}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Shipping</span>
            <span>{formatToINR(cart.shippingFee)}</span>
          </div>
          <div className="pt-2 mt-2 flex justify-between font-medium border-t">
            <span>Total</span>
            <span>{formatToINR(cart.total)}</span>
          </div>
        </div>
      </div>

      {/* Payment Method */}
      <div>
        <h3 className="text-lg font-medium">Payment Method</h3>
        <div className="mt-4 space-y-4">
          <label className="flex items-center">
            <input
              type="radio"
              name="paymentMethod"
              value="razorpay"
              checked={formik.values.paymentMethod === 'razorpay'}
              onChange={formik.handleChange}
            />
            <span className="ml-2">Pay with Razorpay</span>
          </label>
        </div>
      </div>

      {error && (
        <div className="p-4 text-red-700 bg-red-50 rounded-lg">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 text-white bg-primary-600 rounded-lg hover:bg-primary-700 disabled:opacity-50"
      >
        {loading ? 'Processing...' : `Pay ${formatToINR(cart.total)}`}
      </button>
    </form>
  );
};

export default CheckoutForm;