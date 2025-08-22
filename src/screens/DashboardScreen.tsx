import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import * as Location from 'expo-location';
import { rescueService } from '../services/api';
import { Rescue } from '../types';

export default function DashboardScreen() {
  const { t } = useTranslation();
  const [rescues, setRescues] = useState<Rescue[]>([]);
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  useEffect(() => {
    loadRescues();
  }, []);

  const loadRescues = async () => {
    try {
      const data = await rescueService.getMyRescues();
      setRescues(data);
    } catch (error) {
      console.error('Error loading rescues:', error);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadRescues();
    setIsRefreshing(false);
  };

  const getCurrentLocation = async () => {
    setIsGettingLocation(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(t('error'), t('permission_denied'));
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setLatitude(location.coords.latitude.toFixed(6));
      setLongitude(location.coords.longitude.toFixed(6));
    } catch (error) {
      Alert.alert(t('error'), t('location_error'));
    } finally {
      setIsGettingLocation(false);
    }
  };

  const handleSendRescue = async () => {
    if (!latitude || !longitude) {
      Alert.alert(t('error'), 'Please provide location coordinates');
      return;
    }

    setIsLoading(true);
    try {
      const newRescue = await rescueService.requestRescue(
        parseFloat(latitude),
        parseFloat(longitude),
        message
      );
      
      setRescues([newRescue, ...rescues]);
      setLatitude('');
      setLongitude('');
      setMessage('');
      Alert.alert(t('success'), t('rescue_sent'));
    } catch (error: any) {
      Alert.alert(t('error'), error.response?.data?.message || t('network_error'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
      }
    >
      <View style={styles.content}>
        <Text style={styles.title}>{t('rescue_list')}</Text>

        {rescues.length === 0 ? (
          <Text style={styles.noRescues}>{t('no_rescues')}</Text>
        ) : (
          <View style={styles.rescueList}>
            {rescues.map((rescue) => (
              <View key={rescue.id} style={styles.rescueCard}>
                <Text style={styles.rescueText}>
                  <Text style={styles.label}>{t('location')}: </Text>
                  {rescue.latitude}, {rescue.longitude}
                </Text>
                <Text style={styles.rescueText}>
                  <Text style={styles.label}>{t('message')}: </Text>
                  {rescue.message || '—'}
                </Text>
                <Text style={styles.rescueText}>
                  <Text style={styles.label}>{t('status')}: </Text>
                  {rescue.status}
                </Text>
                <Text style={styles.rescueDate}>
                  {t('date')}: {new Date(rescue.createdAt).toLocaleString()}
                </Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>{t('request_rescue')}</Text>

        <View style={styles.locationRow}>
          <TextInput
            style={[styles.coordinateInput, { marginRight: 5 }]}
            placeholder="Latitude"
            value={latitude}
            onChangeText={setLatitude}
            keyboardType="numeric"
            editable={!isLoading}
          />
          <TextInput
            style={[styles.coordinateInput, { marginLeft: 5 }]}
            placeholder="Longitude"
            value={longitude}
            onChangeText={setLongitude}
            keyboardType="numeric"
            editable={!isLoading}
          />
        </View>

        <TouchableOpacity
          style={styles.locationButton}
          onPress={getCurrentLocation}
          disabled={isGettingLocation || isLoading}
        >
          {isGettingLocation ? (
            <ActivityIndicator size="small" color="#4CAF50" />
          ) : (
            <Text style={styles.locationButtonText}>{t('use_location')}</Text>
          )}
        </TouchableOpacity>

        <TextInput
          style={styles.messageInput}
          placeholder={t('optional_message')}
          value={message}
          onChangeText={setMessage}
          multiline
          numberOfLines={3}
          editable={!isLoading}
        />

        <TouchableOpacity
          style={[styles.sendButton, isLoading && styles.sendButtonDisabled]}
          onPress={handleSendRescue}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.sendButtonText}>{t('send_request')}</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  noRescues: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginVertical: 20,
  },
  rescueList: {
    marginBottom: 20,
  },
  rescueCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  rescueText: {
    fontSize: 14,
    marginBottom: 5,
    color: '#333',
  },
  label: {
    fontWeight: '600',
  },
  rescueDate: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  divider: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 15,
    color: '#333',
  },
  locationRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  coordinateInput: {
    flex: 1,
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  locationButton: {
    marginBottom: 15,
  },
  locationButtonText: {
    color: '#4CAF50',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  messageInput: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 15,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  sendButton: {
    height: 50,
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.6,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});