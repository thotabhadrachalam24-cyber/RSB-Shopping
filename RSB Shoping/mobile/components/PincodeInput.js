import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator
} from 'react-native';
import axios from 'axios';
import Constants from 'expo-constants';

const API_URL = Constants.expoConfig.extra.apiUrl;

const PincodeInput = ({ onDeliveryCheck }) => {
  const [pincode, setPincode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [deliveryInfo, setDeliveryInfo] = useState(null);

  const checkPincode = async () => {
    // Validate Indian pincode format
    if (!/^\d{6}$/.test(pincode)) {
      setError('Please enter a valid 6-digit pincode');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { data } = await axios.get(`${API_URL}/api/pincodes/check/${pincode}`);
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
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={pincode}
          onChangeText={setPincode}
          placeholder="Enter pincode"
          keyboardType="numeric"
          maxLength={6}
        />
        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={checkPincode}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Check</Text>
          )}
        </TouchableOpacity>
      </View>

      {error ? (
        <Text style={styles.error}>{error}</Text>
      ) : null}

      {deliveryInfo && (
        <View style={styles.infoContainer}>
          <View style={styles.statusContainer}>
            <View
              style={[
                styles.statusDot,
                {
                  backgroundColor: deliveryInfo.deliverable ? '#22c55e' : '#ef4444'
                }
              ]}
            />
            <Text style={styles.statusText}>
              {deliveryInfo.deliverable
                ? 'Delivery Available'
                : 'Not Deliverable to this Location'}
            </Text>
          </View>

          {deliveryInfo.deliverable && (
            <>
              <Text style={styles.deliveryText}>
                Delivery to: {deliveryInfo.city}, {deliveryInfo.state}
              </Text>
              <Text style={styles.deliveryText}>
                Estimated delivery in {deliveryInfo.estimatedDays} days
              </Text>
            </>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16
  },
  inputContainer: {
    flexDirection: 'row',
    gap: 8
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16
  },
  button: {
    backgroundColor: '#0284c7',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center'
  },
  buttonDisabled: {
    opacity: 0.5
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500'
  },
  error: {
    marginTop: 8,
    color: '#ef4444',
    fontSize: 14
  },
  infoContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#f8fafc',
    borderRadius: 8
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4
  },
  statusText: {
    fontSize: 16,
    fontWeight: '500'
  },
  deliveryText: {
    marginTop: 8,
    color: '#64748b',
    fontSize: 14
  }
});

export default PincodeInput;