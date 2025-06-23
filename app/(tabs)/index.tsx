console.log('[TabsIndex] HomeScreen Rendered');
import { Feather } from '@expo/vector-icons';
import { Link, router } from 'expo-router';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../../lib/supabase';
import useLoadingOverlayStore from '../../stores/loadingOverlay';

// Mock Data
const totalEarnings = 20.00;
const pendingPayout = 8.82;
const totalDownlines = 12; // Example data

export default function HomeScreen() {
  const showLoading = useLoadingOverlayStore((s) => s.show);
  const hideLoading = useLoadingOverlayStore((s) => s.hide);

  const handleLogout = async () => {
    showLoading('Logging out...');
    try {
      await supabase.auth.signOut();
      router.replace('/login');
    } catch (error) {
      Alert.alert('Error', 'Failed to logout. Please try again.');
    } finally {
      hideLoading();
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Dashboard</Text>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Home</Text>
          <Text style={styles.sectionSubtitle}>Manage your earnings and payout methods.</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.balanceRow}>
            <Text style={styles.balanceLabel}>Total Earnings</Text>
          </View> 
          <Text style={styles.balanceAmount}>${totalEarnings.toFixed(2)}</Text>
          <Text style={styles.balanceSubtext}>Ready for payout</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Previous Payouts</Text>
          <Text style={styles.pendingAmount}>${pendingPayout.toFixed(2)}</Text>
          <Text style={styles.cardSubtitle}>
            June 21, 2025
          </Text>
        </View>
        
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Total Downlines</Text>
          <Text style={styles.downlinesCount}>{totalDownlines}</Text>
        </View>

        <View style={styles.buttonRow}>
          <Link href="/invite" asChild>
            <TouchableOpacity style={styles.button}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                <Text style={styles.buttonText}>Invite New Member</Text>
                <Feather name="plus" size={20} color="#FFFFFF" style={{ marginLeft: 8 }} />
              </View>
            </TouchableOpacity>
          </Link>
          <Link href="/team" asChild>
            <TouchableOpacity style={styles.secondaryButton}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                <Text style={styles.secondaryButtonText}>View Team</Text>
                <Feather name="users" size={20} color="#111827" style={{ marginLeft: 24 }} />
              </View>
            </TouchableOpacity>
          </Link>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  container: {
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  logoutButton: {
    backgroundColor: '#E5E7EB',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  logoutButtonText: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    marginTop: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#111827',
  },
  sectionSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 4,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: 16,
    color: '#6B7280',
  },
  dollarSign: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#10B981',
  },
  balanceAmount: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 4,
  },
  balanceSubtext: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  
  pendingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 16,
  },
  pendingChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  pendingText: {
    color: '#8D6A00',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  pendingAmount: {
    fontSize: 24,
    fontWeight: 'medium',
    color: '#111827',
    marginTop: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  downlinesCount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
    paddingBottom: 20,
  },
  button: {
    flex: 1,
    backgroundColor: '#111827',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    paddingLeft: 40,
    paddingRight: 40,
    alignItems: 'flex-start',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
    paddingTop: 24,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  secondaryButtonText: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '600',
  },
});
