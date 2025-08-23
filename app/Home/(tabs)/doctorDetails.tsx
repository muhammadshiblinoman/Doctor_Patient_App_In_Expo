// app/doctorDetails.tsx
import { db } from "@/firebaseConfig";
import { useLocalSearchParams } from "expo-router";
import { get, ref } from "firebase/database";
import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";

export default function DoctorDetails() {
  const { uid } = useLocalSearchParams(); // uid from navigation params
  const [doctor, setDoctor] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) return;
    const fetchDoctor = async () => {
      try {
        const snapshot = await get(ref(db, "doctors/" + uid));
        if (snapshot.exists()) {
          setDoctor(snapshot.val());
        }
      } catch (error) {
        console.error("Error fetching doctor details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctor();
  }, [uid]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text>Loading doctor details...</Text>
      </View>
    );
  }

  if (!doctor) {
    return (
      <View style={styles.center}>
        <Text style={{ fontSize: 16, color: "#666" }}>Doctor not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{doctor.name}</Text>
      <Text style={styles.field}>📞 Phone: {doctor.phone}</Text>
      <Text style={styles.field}>📧 Email: {doctor.email}</Text>
      <Text style={styles.field}>🎓 Degree: {doctor.degree}</Text>
      <Text style={styles.field}>🏥 Department: {doctor.department}</Text>
      <Text style={styles.field}>🏩 Hospital: {doctor.hospital}</Text>
      <Text style={styles.field}>📍 Chamber/Place: {doctor.place}</Text>
      <Text style={styles.field}>⏰ Appointment Time: {doctor.appointmentTime}</Text>
      <Text style={styles.field}>👨‍⚕️ Status: {doctor.status}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
    color: "#007bff",
  },
  field: {
    fontSize: 16,
    marginBottom: 10,
    color: "#333",
  },
});
