import { db } from "@/firebaseConfig";
import { router } from "expo-router";
import { onValue, ref } from "firebase/database";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";

export default function HomeScreen() {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filteredDoctors, setFilteredDoctors] = useState<any[]>([]);
  const { width } = useWindowDimensions();
  const defaultLogo = "https://cdn-icons-png.flaticon.com/512/1077/1077114.png";

  // Number of columns based on screen width
  let numColumns = 1;
  if (width >= 1200) numColumns = 4; // Desktop
  else if (width >= 768) numColumns = 3; // Tablet
  else numColumns = 1; // Mobile

  useEffect(() => {
    const doctorsRef = ref(db, "doctors");
    const unsubscribe = onValue(doctorsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const doctorList = Object.values(data);
        setDoctors(doctorList);
        setFilteredDoctors(doctorList);
      } else {
        setDoctors([]);
        setFilteredDoctors([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (search.trim() === "") {
      setFilteredDoctors(doctors);
    } else {
      const q = search.toLowerCase();
      const result = doctors.filter((item: any) =>
        item.name?.toLowerCase().includes(q)
      );
      setFilteredDoctors(result);
    }
  }, [search, doctors]);

  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text>Loading doctors...</Text>
      </View>
    );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerSection}>
        <Text style={styles.headerText}>Available Doctors</Text>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search by name"
          value={search}
          onChangeText={setSearch}
          placeholderTextColor="#777"
        />
      </View>

      {/* Doctor List */}
      {filteredDoctors.length === 0 ? (
        <Text style={styles.noData}>No doctors found</Text>
      ) : (
        <FlatList
          data={filteredDoctors}
          numColumns={numColumns}
          key={numColumns} // re-render on column change
          keyExtractor={(item: any, index) => item.uid || index.toString()}
          contentContainerStyle={styles.listContainer}
          columnWrapperStyle={
            numColumns > 1 ? { justifyContent: "space-between" } : undefined
          }
          renderItem={({ item }) => (
            <View style={[styles.card, { width: `${100 / numColumns - 2}%` }]}>
              <Image
                source={{ uri: item.photoURL || defaultLogo }}
                style={styles.logo}
              />
              <View style={styles.info}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.text}>🎓 {item.degree}</Text>
                <Text style={styles.text}>🏥 {item.department}</Text>
                <Text style={styles.text}>🏩 {item.hospital}</Text>
              </View>

              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={[styles.btn, { backgroundColor: "#007bff" }]}
                  onPress={() =>
                    router.push({
                      pathname: "/Home/doctorDetails",
                      params: { uid: item.uid },
                    })
                  }
                >
                  <Text style={styles.btnText}>More</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.btn, { backgroundColor: "#28a745" }]}
                  onPress={() =>
                    router.push({
                      pathname: "/Booking/booking",
                      params: {
                        uid: item.uid,
                        name: item.name,
                        hospital: item.hospital,
                        department: item.department,
                      },
                    })
                  }
                >
                  <Text style={styles.btnText}>Booking</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#e0e0e0" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  headerSection: {
    backgroundColor: "#ff00aaff",
    paddingVertical: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    alignItems: "center",
    elevation: 5,
  },
  headerText: { fontSize: 24, fontWeight: "bold", color: "#fff" },
  searchContainer: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 },
  searchBar: {
    backgroundColor: "#22b9ff36",
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ddddddff",
  },
  listContainer: { paddingHorizontal: 16, paddingBottom: 20 },
  card: {
    backgroundColor: "#e6f2ff",
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000000ff",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#cce0ff",
  },
  logo: { width: 80, height: 80, borderRadius: 40, marginBottom: 12 },
  info: { alignItems: "center" },
  name: { fontSize: 16, fontWeight: "bold", marginBottom: 4, color: "#004080" },
  text: { fontSize: 14, color: "#333", marginBottom: 2 },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 10,
    gap: 8,
  },
  btn: { flex: 1, paddingVertical: 8, borderRadius: 8, alignItems: "center" },
  btnText: { color: "#fff", fontWeight: "bold", fontSize: 14 },
  noData: { textAlign: "center", marginTop: 40, fontSize: 16, color: "#666" },
});
