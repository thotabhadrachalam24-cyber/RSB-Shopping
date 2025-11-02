import { useState } from 'react';
import axios from 'axios';

const PincodeChecker = ({ onDeliveryCheck }) => {
  const [pincode, setPincode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [deliveryInfo, setDeliveryInfo] = useState(null);

  const checkPincode = async (e) => {
    e.preventDefault();
    
    // Validate Indian pincode format
    if (!/^\d{6}$/.test(pincode)) {
      setError('Please enter a valid 6-digit pincode');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { data } = await axios.get(`/api/pincodes/check/${pincode}`);
      setDeliveryInfo(data.data);
      onDeliveryCheck?.(data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error checking pincode');
      setDeliveryInfo(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <form onSubmit={checkPincode} className="flex items-center gap-2">
        <div className="flex-1">
          <input
            type="text"
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
            placeholder="Enter pincode"
            maxLength={6}
            pattern="\d{6}"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 text-white bg-primary-600 rounded-lg hover:bg-primary-700 disabled:opacity-50"
        >
          {loading ? 'Checking...' : 'Check'}
        </button>
      </form>

      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}

      {deliveryInfo && (
        <div className="mt-4 p-4 rounded-lg bg-gray-50">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${deliveryInfo.deliverable ? 'bg-green-500' : 'bg-red-500'}`} />
            <p className="font-medium">
              {deliveryInfo.deliverable ? 'Delivery Available' : 'Not Deliverable to this Location'}
            </p>
          </div>
          {deliveryInfo.deliverable && (
            <>
              <p className="mt-2 text-sm text-gray-600">
                Delivery to: {deliveryInfo.city}, {deliveryInfo.state}
              </p>
              <p className="mt-1 text-sm text-gray-600">
                Estimated delivery in {deliveryInfo.estimatedDays} days
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default PincodeChecker;