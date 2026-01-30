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
  Image,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { teamService } from '../services/api';
import { Team } from '../types';

export default function TeamsScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    loadTeams();
  }, []);

  const loadTeams = async () => {
    try {
      setIsLoading(true);
      const data = await teamService.getAllTeams();
      setTeams(data);
    } catch (error) {
      Alert.alert(t('error'), t('network_error'));
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await loadTeams();
    setIsRefreshing(false);
  }, []);

  const handleJoinTeam = async (teamId: number) => {
    try {
      await teamService.joinTeam(teamId);
      Alert.alert(t('success'), t('joined_team_successfully'));
      loadTeams();
    } catch (error: any) {
      const message = error.response?.data?.error || t('network_error');
      Alert.alert(t('error'), message);
    }
  };

  const renderTeamCard = ({ item: team }: { item: Team }) => {
    const memberCount = team._count?.members || 0;
    const expeditionCount = team._count?.expeditions || 0;

    return (
      <TouchableOpacity
        style={styles.teamCard}
        onPress={() => navigation.navigate('TeamDetail', { teamId: team.id })}
      >
        <View style={styles.teamHeader}>
          {team.avatar ? (
            <Image source={{ uri: team.avatar }} style={styles.teamAvatar} />
          ) : (
            <View style={[styles.teamAvatar, styles.defaultAvatar]}>
              <Ionicons name="people" size={24} color="#666" />
            </View>
          )}
          
          <View style={styles.teamInfo}>
            <Text style={styles.teamName}>{team.name}</Text>
            <Text style={styles.teamOwner}>
              {t('created_by')}: {team.owner?.name || team.owner?.email}
            </Text>
            
            <View style={styles.teamStats}>
              <View style={styles.statItem}>
                <Ionicons name="people" size={16} color="#666" />
                <Text style={styles.statText}>
                  {memberCount}/{team.maxMembers}
                </Text>
              </View>
              
              <View style={styles.statItem}>
                <Ionicons name="map" size={16} color="#666" />
                <Text style={styles.statText}>{expeditionCount}</Text>
              </View>
              
              {!team.isPublic && (
                <View style={styles.statItem}>
                  <Ionicons name="lock-closed" size={16} color="#FFA500" />
                  <Text style={styles.statText}>{t('private')}</Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {team.description && (
          <Text style={styles.teamDescription} numberOfLines={2}>
            {team.description}
          </Text>
        )}

        <View style={styles.teamActions}>
          {team.isPublic && memberCount < team.maxMembers && (
            <TouchableOpacity
              style={styles.joinButton}
              onPress={() => handleJoinTeam(team.id)}
            >
              <Ionicons name="add" size={16} color="#fff" />
              <Text style={styles.joinButtonText}>{t('join')}</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity style={styles.viewButton}>
            <Text style={styles.viewButtonText}>{t('view_details')}</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>{t('loading_teams')}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('teams')}</Text>
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => navigation.navigate('CreateTeam')}
        >
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={teams}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderTeamCard}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="people-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>{t('no_teams_available')}</Text>
            <Text style={styles.emptySubtext}>{t('create_first_team')}</Text>
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
  listContainer: {
    padding: 15,
  },
  teamCard: {
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
  teamHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  teamAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  defaultAvatar: {
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  teamInfo: {
    flex: 1,
  },
  teamName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  teamOwner: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  teamStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  statText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  teamDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  teamActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  joinButton: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  joinButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  viewButton: {
    backgroundColor: 'transparent',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  viewButtonText: {
    color: '#4CAF50',
    fontSize: 14,
    fontWeight: '600',
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