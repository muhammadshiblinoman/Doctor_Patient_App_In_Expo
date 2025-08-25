// app/hospital.tsx
import { db } from "@/firebaseConfig";
import { router } from "expo-router";
import { onValue, ref } from "firebase/database";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function HospitalScreen() {
  const [hospitals, setHospitals] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

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

        setHospitals(Array.from(hospitalSet).sort());
      } else {
        setHospitals([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

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
      <Text style={styles.header}>Hospitals</Text>

      {hospitals.length === 0 ? (
        <Text style={styles.noData}>No hospitals found</Text>
      ) : (
        <FlatList
          data={hospitals}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9f9f9", padding: 16 },
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

  // --- Bottom Navigation Styles ---
  navBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#fff",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderColor: "#ddd",
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
