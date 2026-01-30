import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  Switch,
  ActivityIndicator,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { teamService } from '../services/api';

export default function CreateTeamScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isPublic: true,
    maxMembers: 10,
  });
  
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      Alert.alert(t('error'), t('team_name_required'));
      return;
    }

    if (formData.maxMembers < 2 || formData.maxMembers > 50) {
      Alert.alert(t('error'), t('invalid_max_members'));
      return;
    }

    try {
      setIsLoading(true);
      
      const teamData = {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        isPublic: formData.isPublic,
        maxMembers: formData.maxMembers,
      };

      const newTeam = await teamService.createTeam(teamData);
      
      Alert.alert(
        t('success'),
        t('team_created_successfully'),
        [
          {
            text: 'OK',
            onPress: () => {
              navigation.goBack();
              navigation.navigate('TeamDetail', { teamId: newTeam.id });
            },
          },
        ]
      );
    } catch (error: any) {
      const message = error.response?.data?.error || t('network_error');
      Alert.alert(t('error'), message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>{t('create_team')}</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>{t('team_name')} *</Text>
          <TextInput
            style={styles.input}
            placeholder={t('enter_team_name')}
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
            maxLength={100}
          />
          <Text style={styles.charCount}>{formData.name.length}/100</Text>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>{t('description')}</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder={t('enter_team_description')}
            value={formData.description}
            onChangeText={(text) => setFormData({ ...formData, description: text })}
            multiline
            numberOfLines={4}
            maxLength={500}
          />
          <Text style={styles.charCount}>{formData.description.length}/500</Text>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>{t('max_members')}</Text>
          <View style={styles.numberInputContainer}>
            <TouchableOpacity
              style={styles.numberButton}
              onPress={() => 
                setFormData({ 
                  ...formData, 
                  maxMembers: Math.max(2, formData.maxMembers - 1) 
                })
              }
            >
              <Ionicons name="remove" size={20} color="#4CAF50" />
            </TouchableOpacity>
            
            <Text style={styles.numberValue}>{formData.maxMembers}</Text>
            
            <TouchableOpacity
              style={styles.numberButton}
              onPress={() => 
                setFormData({ 
                  ...formData, 
                  maxMembers: Math.min(50, formData.maxMembers + 1) 
                })
              }
            >
              <Ionicons name="add" size={20} color="#4CAF50" />
            </TouchableOpacity>
          </View>
          <Text style={styles.helpText}>{t('members_range_help')}</Text>
        </View>

        <View style={styles.inputGroup}>
          <View style={styles.switchContainer}>
            <View style={styles.switchLabel}>
              <Text style={styles.label}>{t('public_team')}</Text>
              <Text style={styles.switchDescription}>
                {formData.isPublic ? t('anyone_can_join') : t('invite_only')}
              </Text>
            </View>
            <Switch
              value={formData.isPublic}
              onValueChange={(value) => setFormData({ ...formData, isPublic: value })}
              trackColor={{ false: '#767577', true: '#4CAF50' }}
              thumbColor="#fff"
            />
          </View>
        </View>

        <View style={styles.premiumNotice}>
          <Ionicons name="star" size={20} color="#FFD700" />
          <Text style={styles.premiumText}>
            {t('team_creation_premium_feature')}
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.createButton, isLoading && styles.disabledButton]}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <>
              <Ionicons name="people" size={20} color="#fff" />
              <Text style={styles.createButtonText}>{t('create_team')}</Text>
            </>
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
  form: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
    marginTop: 4,
  },
  numberInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    padding: 8,
  },
  numberButton: {
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  numberValue: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  helpText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  switchLabel: {
    flex: 1,
  },
  switchDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  premiumNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9E6',
    borderRadius: 10,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#FFE066',
  },
  premiumText: {
    fontSize: 14,
    color: '#B8860B',
    marginLeft: 8,
    flex: 1,
  },
  createButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  createButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
});