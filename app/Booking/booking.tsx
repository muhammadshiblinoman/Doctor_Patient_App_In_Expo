import { db } from "@/firebaseConfig";
import { useLocalSearchParams } from "expo-router";
import { push, ref, remove, set } from "firebase/database";
import { useState } from "react";
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity
} from "react-native";

export default function BookingScreen() {
  const { uid, name, hospital, department } = useLocalSearchParams();
  const [patientName, setPatientName] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [message, setMessage] = useState("");

  const handleBooking = async () => {
    if (!patientName || !phone || !date) {
      Alert.alert("Error", "Please fill all required fields.");
      return;
    }

    try {
      const bookingRef = ref(db, `bookings/${uid}`);

      // 🔥 পুরনো বুকিং ডিলিট করে দিচ্ছে
      await remove(bookingRef);

      // 🆕 নতুন বুকিং যোগ করছে
      await set(push(bookingRef), {
        name: patientName,
        phone,
        date,
        message,
        doctorName: name,
        hospital,
        department,
        createdAt: new Date().toISOString(),
      });

      Alert.alert("Success", "Booking sent successfully!");
      setPatientName("");
      setPhone("");
      setDate("");
      setMessage("");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Book Appointment with Dr. {name}</Text>

      <TextInput
        placeholder="Your Name"
        style={styles.input}
        value={patientName}
        onChangeText={setPatientName}
      />
      <TextInput
        placeholder="Your Phone"
        style={styles.input}
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
      />
      <TextInput
        placeholder="Preferred Date"
        style={styles.input}
        value={date}
        onChangeText={setDate}
      />
      <TextInput
        placeholder="Message (Optional)"
        style={[styles.input, { height: 100 }]}
        multiline
        value={message}
        onChangeText={setMessage}
      />

      <TouchableOpacity style={styles.button} onPress={handleBooking}>
        <Text style={styles.btnText}>Confirm Booking</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f1f6fa",
    flexGrow: 1,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    color: "#1a237e",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  button: {
    backgroundColor: "#1e88e5",
    padding: 14,
    borderRadius: 8,
    marginTop: 10,
  },
  btnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});
