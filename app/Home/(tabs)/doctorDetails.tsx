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

  // DOB থেকে Age calculate করার ফাংশন
  const calculateAge = (dob: string) => {
    if (!dob) return "-";
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

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
        <Text style={styles.loadingText}>Loading doctor details...</Text>
      </View>
    );
  }

  if (!doctor) {
    return (
      <View style={styles.center}>
        <Text style={styles.notFoundText}>Doctor not found</Text>
      </View>
    );
  }

  const infoFields = [
    { label: "Phone", value: doctor.phone, emoji: "📞" },
    { label: "Email", value: doctor.email, emoji: "📧" },
    { label: "Degree", value: doctor.degree, emoji: "🎓" },
    { label: "Department", value: doctor.department, emoji: "🏥" },
    { label: "Hospital", value: doctor.hospital, emoji: "🏩" },
    { label: "Chamber/Place", value: doctor.place, emoji: "📍" },
    { label: "Appointment Time", value: doctor.appointmentTime, emoji: "⏰" },
    { label: "Status", value: doctor.status, emoji: "👨‍⚕️" },
    { label: "Age", value: calculateAge(doctor.dob), emoji: "🎂" }, // Age added
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{doctor.name}</Text>

      {infoFields.map((field, index) => (
        <View key={index} style={styles.card}>
          <Text style={styles.cardLabel}>{field.emoji} {field.label}</Text>
          <Text style={styles.cardValue}>{field.value}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f0f0f0",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
  loadingText: {
    marginTop: 8,
    color: "#007bff",
    fontSize: 16,
  },
  notFoundText: {
    color: "#666",
    fontSize: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#007bff",
    textAlign: "center",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  cardLabel: {
    fontSize: 14,
    color: "#555",
    marginBottom: 4,
  },
  cardValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
});
