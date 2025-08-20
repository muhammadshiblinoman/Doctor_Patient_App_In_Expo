import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const departments = [
  'Cardiology', 'Neurology', 'Orthopedics', 'ENT',
  'Gynecology', 'Dermatology', 'Urology', 'Oncology',
];

const dhakaHospitals = [
  'Square Hospital', 'United Hospital', 'Apollo Hospital', 'BSMMU',
];

const chittagongHospitals = [
  'Chittagong Medical College', 'Chevron Lab', 'CSCR Hospital', 'Max Hospital',
];

const dhakaSpecialists = [
  'Cardiology Specialist', 'Cancer Specialist', 'ENT Specialist', 'Skin Specialist',
];

const chittagongSpecialists = [
  'Neurology Specialist', 'Eye Specialist', 'Child Specialist', 'Urology Specialist',
];

export default function Home() {
  const router = useRouter();

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        {/* Search Cards */}
        <View style={styles.cardContainer}>
          <TouchableOpacity style={styles.searchCard} onPress={() => router.push('/Home/home')}>
            <Ionicons name="people" size={24} color="#007AFF" />
            <Text>Doctors</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.searchCard} onPress={() => router.push('/Home/home')}>
            <Ionicons name="layers" size={24} color="#007AFF" />
            <Text>Departments</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.searchCard} onPress={() => router.push('/Home/home')}>
            <Ionicons name="business" size={24} color="#007AFF" />
            <Text>Hospitals</Text>
          </TouchableOpacity>
        </View>

        {/* Departments */}
        <Text style={styles.sectionTitle}>Departments</Text>
        <View style={styles.grid}>
          {departments.map((d, idx) => (
            <TouchableOpacity key={idx} style={styles.gridItem} onPress={() => router.push(`//${d}`)}>
              <Text>{d}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Hospitals by City (Side by Side) */}
        <Text style={styles.sectionTitle}>Hospitals by City</Text>
        <View style={styles.cityHospitalsContainer}>
          <View style={styles.cityColumn}>
            <Text style={styles.cityTitle}>Dhaka</Text>
            {dhakaHospitals.map((name, idx) => (
              <TouchableOpacity key={idx} style={styles.cityItem} onPress={() => router.push(`//${name}`)}>
                <Text>{name}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.cityColumn}>
            <Text style={styles.cityTitle}>Chittagong</Text>
            {chittagongHospitals.map((name, idx) => (
              <TouchableOpacity key={idx} style={styles.cityItem} onPress={() => router.push(`//${name}`)}>
                <Text>{name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Specialist Doctors */}
        <Text style={styles.sectionTitle}>Specialist Doctors in Dhaka</Text>
        {dhakaSpecialists.map((s, idx) => (
          <TouchableOpacity key={idx} style={styles.specialistCard}>
            <Text>{s}</Text>
          </TouchableOpacity>
        ))}

        <Text style={styles.sectionTitle}>Specialist Doctors in Chittagong</Text>
        {chittagongSpecialists.map((s, idx) => (
          <TouchableOpacity key={idx} style={styles.specialistCard}>
            <Text>{s}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity onPress={() => router.push('/Home/home')}>
          <Ionicons name="home" size={24} color="#007AFF" />
          <Text style={styles.navLabel}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/Home/home')}>
          <Ionicons name="people" size={24} color="#007AFF" />
          <Text style={styles.navLabel}>Doctors</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/Home/home')}>
          <Ionicons name="layers" size={24} color="#007AFF" />
          <Text style={styles.navLabel}>Departments</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/Home/home')}>
          <Ionicons name="business" size={24} color="#007AFF" />
          <Text style={styles.navLabel}>Hospitals</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 16,
  },
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  searchCard: {
    backgroundColor: '#e6f0ff',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
  },
  gridItem: {
    width: '48%',
    backgroundColor: '#f2f2f2',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  cityHospitalsContainer: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 10,
  },
  cityColumn: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 10,
  },
  cityTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 8,
  },
  cityItem: {
    paddingVertical: 6,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  specialistCard: {
    backgroundColor: '#e6ffe6',
    padding: 14,
    borderRadius: 8,
    marginBottom: 8,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    backgroundColor: '#f8f8f8',
  },
  navLabel: {
    fontSize: 12,
    color: '#007AFF',
    textAlign: 'center',
  },
});
