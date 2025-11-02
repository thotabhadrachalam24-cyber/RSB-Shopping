import { CheckCircleIcon } from '@heroicons/react/24/solid';

const statuses = [
  'Placed',
  'Confirmed',
  'Packed',
  'Shipped',
  'Out for Delivery',
  'Delivered'
];

const OrderTracking = ({ currentStatus, statusHistory }) => {
  const currentIndex = statuses.indexOf(currentStatus);

  return (
    <div className="py-6">
      {/* Timeline */}
      <div className="relative">
        {/* Progress Bar */}
        <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gray-200">
          <div 
            className="absolute top-0 left-0 w-full bg-primary-500 transition-all duration-500"
            style={{ height: `${(currentIndex / (statuses.length - 1)) * 100}%` }}
          />
        </div>

        {/* Status Points */}
        <div className="relative">
          {statuses.map((status, index) => {
            const isPast = index <= currentIndex;
            const statusData = statusHistory?.find(h => h.status === status);

            return (
              <div
                key={status}
                className={`mb-8 flex items-center ${
                  index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
                }`}
              >
                {/* Content */}
                <div className={`w-5/12 ${index % 2 === 0 ? 'text-right pr-8' : 'text-left pl-8'}`}>
                  <h3 className={`font-medium ${isPast ? 'text-gray-900' : 'text-gray-500'}`}>
                    {status}
                  </h3>
                  {statusData && (
                    <p className="text-sm text-gray-500">
                      {new Date(statusData.timestamp).toLocaleString('en-IN')}
                    </p>
                  )}
                  {statusData?.comment && (
                    <p className="text-sm text-gray-600 mt-1">{statusData.comment}</p>
                  )}
                </div>

                {/* Icon */}
                <div className="w-2/12 flex justify-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      isPast
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-200 text-gray-400'
                    }`}
                  >
                    <CheckCircleIcon className="w-6 h-6" />
                  </div>
                </div>

                {/* Empty space for alignment */}
                <div className="w-5/12" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;