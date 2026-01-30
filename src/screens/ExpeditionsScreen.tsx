import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { expeditionService } from '../services/api';
import { Expedition } from '../types';

const DIFFICULTY_COLORS = {
  beginner: '#4CAF50',
  intermediate: '#FF9800',
  advanced: '#F44336',
  expert: '#9C27B0',
};

const STATUS_COLORS = {
  planned: '#2196F3',
  active: '#4CAF50',
  completed: '#9E9E9E',
  cancelled: '#F44336',
};

export default function ExpeditionsScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [expeditions, setExpeditions] = useState<Expedition[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'planned' | 'active'>('all');

  useEffect(() => {
    loadExpeditions();
  }, [selectedFilter]);

  const loadExpeditions = async () => {
    try {
      setIsLoading(true);
      const filters = selectedFilter !== 'all' ? { status: selectedFilter } : undefined;
      const data = await expeditionService.getAllExpeditions(filters);
      setExpeditions(data);
    } catch (error) {
      Alert.alert(t('error'), t('network_error'));
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await loadExpeditions();
    setIsRefreshing(false);
  }, [selectedFilter]);

  const handleJoinExpedition = async (expeditionId: number) => {
    try {
      await expeditionService.joinExpedition(expeditionId);
      Alert.alert(t('success'), t('joined_expedition_successfully'));
      loadExpeditions();
    } catch (error: any) {
      const message = error.response?.data?.error || t('network_error');
      Alert.alert(t('error'), message);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'leaf';
      case 'intermediate': return 'trail-sign';
      case 'advanced': return 'mountain';
      case 'expert': return 'warning';
      default: return 'help';
    }
  };

  const renderExpeditionCard = ({ item: expedition }: { item: Expedition }) => {
    const memberCount = expedition._count?.members || 0;
    const difficultyColor = DIFFICULTY_COLORS[expedition.difficulty];
    const statusColor = STATUS_COLORS[expedition.status];

    return (
      <TouchableOpacity
        style={styles.expeditionCard}
        onPress={() => navigation.navigate('ExpeditionDetail', { expeditionId: expedition.id })}
      >
        <View style={styles.expeditionHeader}>
          <View style={styles.expeditionTitleRow}>
            <Text style={styles.expeditionTitle} numberOfLines={1}>
              {expedition.title}
            </Text>
            
            {expedition.isPremium && (
              <View style={styles.premiumBadge}>
                <Ionicons name="star" size={12} color="#FFD700" />
                <Text style={styles.premiumText}>PRO</Text>
              </View>
            )}
          </View>
          
          <View style={styles.expeditionMeta}>
            <View style={[styles.difficultyBadge, { backgroundColor: difficultyColor }]}>
              <Ionicons 
                name={getDifficultyIcon(expedition.difficulty)} 
                size={12} 
                color="#fff" 
              />
              <Text style={styles.difficultyText}>
                {t(`difficulty_${expedition.difficulty}`)}
              </Text>
            </View>
            
            <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
              <Text style={styles.statusText}>
                {t(`status_${expedition.status}`)}
              </Text>
            </View>
          </View>
        </View>

        {expedition.description && (
          <Text style={styles.expeditionDescription} numberOfLines={2}>
            {expedition.description}
          </Text>
        )}

        <View style={styles.expeditionDetails}>
          <View style={styles.detailItem}>
            <Ionicons name="calendar" size={16} color="#666" />
            <Text style={styles.detailText}>
              {formatDate(expedition.startDate)}
            </Text>
          </View>

          <View style={styles.detailItem}>
            <Ionicons name="people" size={16} color="#666" />
            <Text style={styles.detailText}>
              {memberCount}/{expedition.maxParticipants}
            </Text>
          </View>

          {expedition.cost && (
            <View style={styles.detailItem}>
              <Ionicons name="cash" size={16} color="#666" />
              <Text style={styles.detailText}>
                ${expedition.cost}
              </Text>
            </View>
          )}

          {expedition.team && (
            <View style={styles.detailItem}>
              <Ionicons name="people-circle" size={16} color="#666" />
              <Text style={styles.detailText}>
                {expedition.team.name}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.expeditionFooter}>
          <View style={styles.creatorInfo}>
            <Text style={styles.creatorText}>
              {t('by')} {expedition.creator?.name || expedition.creator?.email}
            </Text>
          </View>

          {expedition.status === 'planned' && memberCount < expedition.maxParticipants && (
            <TouchableOpacity
              style={styles.joinButton}
              onPress={() => handleJoinExpedition(expedition.id)}
            >
              <Ionicons name="add" size={16} color="#fff" />
              <Text style={styles.joinButtonText}>{t('join')}</Text>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderFilterButton = (filter: 'all' | 'planned' | 'active', label: string) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        selectedFilter === filter && styles.activeFilterButton
      ]}
      onPress={() => setSelectedFilter(filter)}
    >
      <Text style={[
        styles.filterButtonText,
        selectedFilter === filter && styles.activeFilterButtonText
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>{t('loading_expeditions')}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('expeditions')}</Text>
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => navigation.navigate('CreateExpedition')}
        >
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.filterContainer}>
        {renderFilterButton('all', t('all'))}
        {renderFilterButton('planned', t('planned'))}
        {renderFilterButton('active', t('active'))}
      </View>

      <FlatList
        data={expeditions}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderExpeditionCard}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="map-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>{t('no_expeditions_available')}</Text>
            <Text style={styles.emptySubtext}>{t('create_first_expedition')}</Text>
          </View>
        }
      />
    </View>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  createButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterContainer: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: '#f0f0f0',
  },
  activeFilterButton: {
    backgroundColor: '#4CAF50',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  activeFilterButtonText: {
    color: '#fff',
  },
  listContainer: {
    padding: 15,
  },
  expeditionCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  expeditionHeader: {
    marginBottom: 12,
  },
  expeditionTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  expeditionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9E6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFE066',
  },
  premiumText: {
    fontSize: 10,
    color: '#B8860B',
    fontWeight: 'bold',
    marginLeft: 2,
  },
  expeditionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  difficultyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  difficultyText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
    marginLeft: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
  },
  expeditionDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  expeditionDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 4,
  },
  detailText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  expeditionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  creatorInfo: {
    flex: 1,
  },
  creatorText: {
    fontSize: 12,
    color: '#999',
  },
  joinButton: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  joinButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});