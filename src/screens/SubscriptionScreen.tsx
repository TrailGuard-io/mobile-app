import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { subscriptionService } from '../services/api';
import { SubscriptionPlan } from '../types';

export default function SubscriptionScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [plans, setPlans] = useState<Record<string, SubscriptionPlan>>({});
  const [currentSubscription, setCurrentSubscription] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<'premium' | 'pro' | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [plansData, currentData] = await Promise.all([
        subscriptionService.getPlans(),
        subscriptionService.getCurrentSubscription(),
      ]);
      setPlans(plansData);
      setCurrentSubscription(currentData);
    } catch (error) {
      Alert.alert(t('error'), t('network_error'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubscribe = async (planType: 'premium' | 'pro') => {
    Alert.alert(
      t('confirm_subscription'),
      t('confirm_subscription_message', { plan: plans[planType]?.name, price: plans[planType]?.price }),
      [
        { text: t('cancel'), style: 'cancel' },
        { 
          text: t('subscribe'), 
          onPress: () => processSubscription(planType)
        }
      ]
    );
  };

  const processSubscription = async (planType: 'premium' | 'pro') => {
    try {
      setIsProcessing(true);
      
      // In a real app, you would integrate with a payment processor here
      // For demo purposes, we'll simulate a payment
      const mockPaymentId = `mock_payment_${Date.now()}`;
      
      const result = await subscriptionService.createSubscription(planType, mockPaymentId);
      
      Alert.alert(
        t('success'),
        t('subscription_successful'),
        [
          {
            text: 'OK',
            onPress: () => {
              loadData(); // Refresh subscription data
              navigation.goBack();
            }
          }
        ]
      );
    } catch (error: any) {
      const message = error.response?.data?.error || t('subscription_failed');
      Alert.alert(t('error'), message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancelSubscription = async () => {
    Alert.alert(
      t('cancel_subscription'),
      t('cancel_subscription_confirmation'),
      [
        { text: t('no'), style: 'cancel' },
        { 
          text: t('yes'), 
          style: 'destructive',
          onPress: async () => {
            try {
              await subscriptionService.cancelSubscription();
              Alert.alert(t('success'), t('subscription_cancelled'));
              loadData();
            } catch (error: any) {
              const message = error.response?.data?.error || t('network_error');
              Alert.alert(t('error'), message);
            }
          }
        }
      ]
    );
  };

  const renderFeatureList = (features: string[]) => (
    <View style={styles.featureList}>
      {features.map((feature, index) => (
        <View key={index} style={styles.featureItem}>
          <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
          <Text style={styles.featureText}>{feature}</Text>
        </View>
      ))}
    </View>
  );

  const renderPlanCard = (planKey: 'premium' | 'pro', plan: SubscriptionPlan) => {
    const isCurrentPlan = currentSubscription?.currentPlan === planKey;
    const isSelected = selectedPlan === planKey;

    return (
      <View key={planKey} style={[
        styles.planCard,
        isCurrentPlan && styles.currentPlanCard,
        isSelected && styles.selectedPlanCard
      ]}>
        {planKey === 'pro' && (
          <View style={styles.popularBadge}>
            <Text style={styles.popularText}>{t('most_popular')}</Text>
          </View>
        )}

        <View style={styles.planHeader}>
          <Text style={styles.planName}>{plan.name}</Text>
          <View style={styles.priceContainer}>
            <Text style={styles.price}>${plan.price}</Text>
            <Text style={styles.pricePeriod}>/{t('month')}</Text>
          </View>
        </View>

        {renderFeatureList(plan.features)}

        {isCurrentPlan ? (
          <View style={styles.currentPlanButton}>
            <Ionicons name="checkmark" size={20} color="#4CAF50" />
            <Text style={styles.currentPlanText}>{t('current_plan')}</Text>
          </View>
        ) : (
          <TouchableOpacity
            style={[
              styles.subscribeButton,
              planKey === 'pro' && styles.proSubscribeButton
            ]}
            onPress={() => handleSubscribe(planKey)}
            disabled={isProcessing}
          >
            {isProcessing && selectedPlan === planKey ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <Ionicons name="star" size={16} color="#fff" />
                <Text style={styles.subscribeButtonText}>
                  {t('upgrade_to')} {plan.name}
                </Text>
              </>
            )}
          </TouchableOpacity>
        )}
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>{t('loading_subscription_info')}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>{t('subscription')}</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        <View style={styles.currentStatusCard}>
          <View style={styles.statusHeader}>
            <Ionicons 
              name={currentSubscription?.currentPlan === 'free' ? 'person' : 'star'} 
              size={24} 
              color="#4CAF50" 
            />
            <Text style={styles.statusTitle}>
              {t('current_plan')}: {t(`plan_${currentSubscription?.currentPlan || 'free'}`)}
            </Text>
          </View>
          
          {currentSubscription?.expiresAt && (
            <Text style={styles.expiryText}>
              {t('expires_on')}: {new Date(currentSubscription.expiresAt).toLocaleDateString()}
            </Text>
          )}

          {currentSubscription?.currentPlan !== 'free' && (
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCancelSubscription}
            >
              <Text style={styles.cancelButtonText}>{t('cancel_subscription')}</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Free Plan */}
        <View style={styles.planCard}>
          <View style={styles.planHeader}>
            <Text style={styles.planName}>{t('free_plan')}</Text>
            <View style={styles.priceContainer}>
              <Text style={styles.price}>$0</Text>
              <Text style={styles.pricePeriod}>/{t('month')}</Text>
            </View>
          </View>

          {renderFeatureList([
            t('basic_rescue_requests'),
            t('view_public_rescues'),
            t('basic_profile'),
          ])}

          <View style={styles.currentPlanButton}>
            <Text style={styles.freeText}>{t('always_free')}</Text>
          </View>
        </View>

        {/* Premium & Pro Plans */}
        {Object.entries(plans).map(([key, plan]) => 
          renderPlanCard(key as 'premium' | 'pro', plan)
        )}

        <View style={styles.noteCard}>
          <Ionicons name="information-circle" size={20} color="#2196F3" />
          <Text style={styles.noteText}>
            {t('subscription_note')}
          </Text>
        </View>

        <View style={styles.benefitsSection}>
          <Text style={styles.benefitsTitle}>{t('why_upgrade')}</Text>
          
          <View style={styles.benefitItem}>
            <Ionicons name="people" size={24} color="#4CAF50" />
            <View style={styles.benefitContent}>
              <Text style={styles.benefitTitle}>{t('team_collaboration')}</Text>
              <Text style={styles.benefitDescription}>
                {t('team_collaboration_description')}
              </Text>
            </View>
          </View>

          <View style={styles.benefitItem}>
            <Ionicons name="map" size={24} color="#FF9800" />
            <View style={styles.benefitContent}>
              <Text style={styles.benefitTitle}>{t('expedition_planning')}</Text>
              <Text style={styles.benefitDescription}>
                {t('expedition_planning_description')}
              </Text>
            </View>
          </View>

          <View style={styles.benefitItem}>
            <Ionicons name="chatbubbles" size={24} color="#9C27B0" />
            <View style={styles.benefitContent}>
              <Text style={styles.benefitTitle}>{t('real_time_chat')}</Text>
              <Text style={styles.benefitDescription}>
                {t('real_time_chat_description')}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  placeholder: {
    width: 34,
  },
  content: {
    padding: 20,
  },
  currentStatusCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
  },
  expiryText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  cancelButton: {
    backgroundColor: '#F44336',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  planCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    position: 'relative',
  },
  currentPlanCard: {
    borderColor: '#4CAF50',
    borderWidth: 2,
  },
  selectedPlanCard: {
    borderColor: '#2196F3',
    borderWidth: 2,
  },
  popularBadge: {
    position: 'absolute',
    top: -8,
    right: 20,
    backgroundColor: '#FF9800',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  popularText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  planName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  pricePeriod: {
    fontSize: 14,
    color: '#666',
  },
  featureList: {
    marginBottom: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 8,
    flex: 1,
  },
  currentPlanButton: {
    backgroundColor: '#E8F5E8',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  currentPlanText: {
    color: '#4CAF50',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  freeText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '600',
  },
  subscribeButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  proSubscribeButton: {
    backgroundColor: '#FF9800',
  },
  subscribeButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  noteCard: {
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 10,
    marginBottom: 20,
  },
  noteText: {
    fontSize: 12,
    color: '#1976D2',
    marginLeft: 8,
    flex: 1,
    lineHeight: 16,
  },
  benefitsSection: {
    marginTop: 20,
  },
  benefitsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
  },
  benefitContent: {
    flex: 1,
    marginLeft: 12,
  },
  benefitTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  benefitDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 18,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
});