import { db } from "@/firebaseConfig";
import { router, useLocalSearchParams } from "expo-router";
import { onValue, ref, remove, update } from "firebase/database";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function BookingList() {
  const { doctorId } = useLocalSearchParams(); // doctorId must come from navigation
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!doctorId) {
      console.log("No doctorId provided!");
      setLoading(false);
      return;
    }

    const bookingRef = ref(db, `bookings/${doctorId}`);
    const unsubscribe = onValue(bookingRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const list = Object.keys(data)
          .map((key) => ({ id: key, ...data[key] }))
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        setBookings(list);
      } else {
        setBookings([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [doctorId]);

  const handleAccept = async (item: any) => {
    if (!doctorId || !item.id) return;
    try {
      const bookingRef = ref(db, `bookings/${doctorId}/${item.id}`);
      await update(bookingRef, { status: "accepted" });

      // Generate a serial number if needed
      const serialNumber = Math.floor(Math.random() * 1000 + 1);
      await update(bookingRef, { serialNumber });

      Alert.alert("Success", "Booking accepted!");

      // Navigate to appointment details page
      router.push({
        pathname: "/Doctor/appoinment",
        params: { doctorId, bookingId: item.id },
      });
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  const handleDelete = (item: any) => {
    if (!doctorId || !item.id) return;

    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this booking?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              console.log(
                "Deleting booking:",
                item.id,
                "for doctor:",
                doctorId
              );
              const bookingRef = ref(db, `bookings/${doctorId}/${item.id}`);
              await remove(bookingRef);
              console.log("Deleted successfully");
              Alert.alert("Deleted", "Booking has been removed.");
              // UI automatically update hobe onValue listener diye
            } catch (error: any) {
              console.log("Delete error:", error.message);
              Alert.alert("Error", error.message);
            }
          },
        },
      ]
    );
  };

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
            <Text style={styles.value}>{item.patientName}</Text>

            <Text style={styles.label}>Phone:</Text>
            <Text style={styles.value}>{item.phone}</Text>

            {item.reason && (
              <>
                <Text style={styles.label}>Reason:</Text>
                <Text style={styles.value}>{item.reason}</Text>
              </>
            )}

            <View style={styles.buttonContainer}>
              {item.status !== "accepted" && (
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: "green" }]}
                  onPress={() => handleAccept(item)}
                >
                  <Text style={styles.btnText}>Accept</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: "red" }]}
                onPress={() => handleDelete(item)}
              >
                <Text style={styles.btnText}>Delete</Text>
              </TouchableOpacity>
            </View>

            {item.status === "accepted" && (
              <Text style={styles.acceptedText}>Accepted</Text>
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
  center: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
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
  buttonContainer: {
    flexDirection: "row",
    marginTop: 10,
    justifyContent: "space-between",
  },
  actionButton: {
    flex: 1,
    padding: 10,
    borderRadius: 6,
    marginHorizontal: 5,
  },
  btnText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
  acceptedText: {
    fontWeight: "bold",
    color: "green",
    marginTop: 5,
    fontSize: 16,
  },
});
