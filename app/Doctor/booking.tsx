import { db } from "@/firebaseConfig";
import { useLocalSearchParams } from "expo-router";
import { onValue, ref } from "firebase/database";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

export default function BookingList() {
  const { doctorId } = useLocalSearchParams();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!doctorId) return;

    const bookingRef = ref(db, `bookings/${doctorId}`);
    const unsubscribe = onValue(bookingRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const list = Object.keys(data)
          .map((key) => ({ id: key, ...data[key] }))
          // 🔹 নতুন বুকিংগুলো আগে দেখানোর জন্য sort
          .sort((a, b) => {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          });
        setBookings(list);
      } else {
        setBookings([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [doctorId]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text>Loading bookings...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Bookings for You</Text>

      {bookings.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.noText}>No bookings yet.</Text>
        </View>
      ) : (
        bookings.map((item) => (
          <View key={item.id} style={styles.card}>
            <Text style={styles.label}>Patient Name:</Text>
            <Text style={styles.value}>{item.name}</Text>

            <Text style={styles.label}>Phone:</Text>
            <Text style={styles.value}>{item.phone}</Text>

            <Text style={styles.label}>Date:</Text>
            <Text style={styles.value}>{item.date}</Text>

            {item.message && (
              <>
                <Text style={styles.label}>Message:</Text>
                <Text style={styles.value}>{item.message}</Text>
              </>
            )}
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#e8f0fe",
    flexGrow: 1,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
    color: "#1a237e",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 3,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#555",
  },
  value: {
    fontSize: 16,
    color: "#1565c0",
    marginBottom: 6,
  },
  noText: {
    fontSize: 16,
    color: "#777",
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 50,
  },
});
