// app/hospitalDoctors.tsx
import { db } from "@/firebaseConfig";
import { router, useLocalSearchParams } from "expo-router";
import { onValue, ref } from "firebase/database";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function HospitalDoctors() {
  const { hospital } = useLocalSearchParams();
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const doctorsRef = ref(db, "doctors");
    const unsubscribe = onValue(doctorsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();

        // Trim & lowercase to avoid mismatch
        const filtered = Object.values<any>(data).filter(
          (doc) =>
            String(doc.hospital ?? "").trim().toLowerCase() === String(hospital ?? "").trim().toLowerCase()
        );

        setDoctors(filtered);
      } else {
        setDoctors([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [hospital]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text>Loading doctors...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Doctors at {hospital}</Text>

      {doctors.length === 0 ? (
        <Text style={styles.noData}>No doctors found in this hospital</Text>
      ) : (
        <FlatList
          data={doctors}
          keyExtractor={(item: any, index) => item.uid || index.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.text}>Degree: {item.degree}</Text>
              <Text style={styles.text}>Department: {item.department}</Text>
              <Text style={styles.text}>Hospital: {item.hospital}</Text>

              <TouchableOpacity
                style={styles.moreBtn}
                onPress={() =>
                  router.push({ pathname: "/Home/doctorDetails", params: { uid: item.uid } })
                }
              >
                <Text style={styles.moreText}>More</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9f9f9", padding: 16 },
  header: { fontSize: 20, fontWeight: "bold", marginBottom: 16, textAlign: "center", color: "#333" },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
  },
  name: { fontSize: 18, fontWeight: "600" },
  text: { fontSize: 14, color: "#555" },
  moreBtn: { marginTop: 8, backgroundColor: "#007bff", paddingVertical: 8, borderRadius: 8 },
  moreText: { color: "#fff", textAlign: "center", fontWeight: "bold" },
  noData: { textAlign: "center", marginTop: 40, fontSize: 16, color: "#666" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});
