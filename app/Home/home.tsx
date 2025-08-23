// app/doctorDetails.tsx
import { db } from "@/firebaseConfig";
import { useLocalSearchParams } from "expo-router";
import { get, ref } from "firebase/database";
import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";

// ✅ Import Gemini SDK
import { GoogleGenerativeAI } from "@google/generative-ai";

export default function DoctorDetails() {
  const { uid } = useLocalSearchParams();
  const [doctor, setDoctor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [aiDescription, setAiDescription] = useState<string>("");

  // ✅ Initialize Gemini
  const genAI = new GoogleGenerativeAI(process.env.EXPO_PUBLIC_GEMINI_API_KEY || "");

  useEffect(() => {
    if (!uid) return;
    const fetchDoctor = async () => {
      try {
        const snapshot = await get(ref(db, "doctors/" + uid));
        if (snapshot.exists()) {
          const docData = snapshot.val();
          setDoctor(docData);

          // ✅ Call Gemini to generate department description
          if (docData.department) {
            generateDepartmentDescription(docData.department);
          }
        }
      } catch (error) {
        console.error("Error fetching doctor details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctor();
  }, [uid]);

  // ✅ Function to generate department description
  const generateDepartmentDescription = async (department: string) => {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `Give a short, simple description about the medical department: ${department}`;
      const result = await model.generateContent(prompt);
      setAiDescription(result.response.text());
    } catch (error) {
      console.error("Gemini error:", error);
      setAiDescription("No AI description available.");
    }
  };

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
      <Text style={styles.field}>🆔 Registration No: {doctor.regNo || "N/A"}</Text>
      <Text style={styles.field}>📅 Created At: {doctor.createdAt?.slice(0, 10)}</Text>
      <Text style={styles.field}>👨‍⚕️ Status: {doctor.status}</Text>

      {/* ✅ AI Department Description */}
      <View style={styles.aiBox}>
        <Text style={styles.aiTitle}>About {doctor.department}:</Text>
        <Text style={styles.aiText}>
          {aiDescription || "Generating description..."}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 16, textAlign: "center", color: "#007bff" },
  field: { fontSize: 16, marginBottom: 10, color: "#333" },
  aiBox: { marginTop: 20, padding: 16, backgroundColor: "#f0f8ff", borderRadius: 10 },
  aiTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 8, color: "#007bff" },
  aiText: { fontSize: 15, color: "#333" },
});
