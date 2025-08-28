// app/hospital.tsx
import { db } from "@/firebaseConfig";
import { router } from "expo-router";
import { onValue, ref } from "firebase/database";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function HospitalScreen() {
  const [hospitals, setHospitals] = useState<string[]>([]);
  const [filteredHospitals, setFilteredHospitals] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const doctorsRef = ref(db, "doctors");
    const unsubscribe = onValue(doctorsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const hospitalSet = new Set<string>();

        Object.values<any>(data).forEach((doc) => {
          if (doc.hospital && doc.hospital.trim() !== "") {
            hospitalSet.add(doc.hospital.trim());
          }
        });

        const sortedHospitals = Array.from(hospitalSet).sort();
        setHospitals(sortedHospitals);
        setFilteredHospitals(sortedHospitals);
      } else {
        setHospitals([]);
        setFilteredHospitals([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Search filter
  useEffect(() => {
    if (search.trim() === "") {
      setFilteredHospitals(hospitals);
    } else {
      setFilteredHospitals(
        hospitals.filter((h) => h.toLowerCase().includes(search.toLowerCase()))
      );
    }
  }, [search, hospitals]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text>Loading hospitals...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* --- Search Bar --- */}
      <View style={styles.searchBar}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search hospitals..."
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <Text style={styles.header}>Hospitals</Text>

      {filteredHospitals.length === 0 ? (
        <Text style={styles.noData}>No hospitals found</Text>
      ) : (
        <FlatList
          data={filteredHospitals}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() =>
                router.push({ pathname: "/Hospital/hospitalDoctors", params: { hospital: item } })
              }
            >
              <Text style={styles.name}>{item}</Text>
            </TouchableOpacity>
          )}
        />
      )}

      {/* --- Bottom Navigation --- */}
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.navBtn} onPress={() => router.push("/Home/(tabs)/home")}>
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navBtn} onPress={() => router.push("/Department/department")}>
          <Text style={styles.navText}>Department</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navBtn} onPress={() => router.push("/Hospital/hospitals")}>
          <Text style={styles.navText}>Hospital</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9f9f9", padding: 16, paddingTop: 70 },
  header: { fontSize: 22, fontWeight: "bold", marginBottom: 16, textAlign: "center", color: "#333" },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
  },
  name: { fontSize: 18, fontWeight: "600", color: "#007bff" },
  noData: { textAlign: "center", marginTop: 40, fontSize: 16, color: "#666" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  // --- Search bar ---
  searchBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#ddd",
    zIndex: 100,
  },
  searchInput: {
    backgroundColor: "#f1f1f1",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
  },

  // --- Bottom Navigation Styles ---
  navBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#fff",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderColor: "#ddd",
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
  navBtn: {
    flex: 1,
    alignItems: "center",
  },
  navText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#007bff",
  },
});
