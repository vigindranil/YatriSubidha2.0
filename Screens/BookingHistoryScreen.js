import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  Alert,
} from "react-native";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import getSlotBookingDetails from "../Axios_BaseUrl_Token_SetUp/bookingdetails";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system";
import Modal from 'react-native-modal';
import LottieView from 'lottie-react-native';
// import Constants from "expo-constants";

// Correct helper: show "Not Avaiable" for bad values (even 0 as string except for VisaNo is allowed to show)
function notAvaiable(v) {
  if (v === null || v === undefined) return "Not Available";
  if (typeof v === "string") {
    if (v.trim() === "" || v.trim().toLowerCase() === "null")
      return "Not Available";
  }
  return v;
}

function mapApiDataToBooking(b) {
  return {
    id: notAvaiable(b.BookingID),
    passengerName: notAvaiable(b.PasengerName),
    nationality: notAvaiable(b.Nationality),
    mobileNumber: notAvaiable(b.MobileNo),
    email: notAvaiable(b.EmailID),
    passportNumber: notAvaiable(b.PassportNo),
    passportValidUpto: notAvaiable(b.PassportValidUpto),
    journeyDate: notAvaiable(b.JourneyDate),
    tokenNumber: notAvaiable(b.TokenNo),
    slotName: notAvaiable(b.SlotName),
    slotTime: notAvaiable(b.SlotTime),
    type: notAvaiable(b.BookingTypeName),
    attendanceStatus: notAvaiable(b.Attendancestatus),
    attendanceDate: notAvaiable(b.AttendenceDate),
    visaNo: notAvaiable(b.VisaNo),
    visaValidUpto: notAvaiable(b.VisaValidUpto),
  };
}

function formatDate(date) {
  if (!date) return "";
  return date.toISOString().slice(0, 10);
}

const BookingHistoryScreen = () => {
  const [bookings, setBookings] = useState([]);
  const [showCount, setShowCount] = useState(7);
  const [loading, setLoading] = useState(false);
  const [noData, setNoData] = useState(false);
  const [error, setError] = useState(null);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);
  const [finalResponse, setFinalResponse] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);

  // Per-item loading
  const [loadingTickets, setLoadingTickets] = useState({});
  
  const [nextId, setNextId] = useState(2);
  const [errors, setErrors] = useState({});
  const today = new Date();

  //   const { apiBaseUrl } = Constants.expoConfig.extra;
  //   console.log("api",apiBaseUrl)

  const buildAllTicketsHTML = (tickets) => {
    const ticketHTMLs = tickets
      .map((d) => {
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(
          d.QRCodeData.split('|')[0]
        )}`;
        return `
        <div class="ticket-wrapper">
          <div class="ticket">
            <div class="left">
              <div class="slot">${d.Slot}</div>
              <div class="qr"><img src="${qrUrl}" alt="QR Code" /></div>
            </div>
            <div class="right">
              <div class="ticket-id">${d.TicketID}</div>
              <div class="name">${d.PassengerName}</div>
              <div class="row">
                <div><span class="label">📅 Date</span> <span>${d.JourneyDate}</span></div>
                <div><span class="label">⏰ Time</span> <span>${d.Time}</span></div>
              </div>
              <div class="row">
                <div><span class="label">🛂 Passport No.</span> <span class="muted">${d.PassportNo}</span></div>
              </div>
              <div class="divider"></div>
              <div class="note">${d.NotesEn}</div>
              <div class="note" style="margin-top: 6px;">${d.NotesBn}</div>
            </div>
          </div>
        </div>`;
      })
      .join("");
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8" />
        <title>All Tickets</title>
        <style>
          @page { size: A4; margin: 20mm; }
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
          .ticket-wrapper { page-break-inside: avoid; margin-bottom: 20mm; }
          .ticket-wrapper:last-child { margin-bottom: 0; }
          .ticket { border: 2px dashed #D7DCE3; border-radius: 16px; display: flex; overflow: hidden; width: 100%; }
          .left { width: 180px; background: linear-gradient(180deg, #a076f1, #7c4dff); padding: 20px 16px; color: #fff; display: flex; flex-direction: column; align-items: center; gap: 12px; }
          .slot { font-weight: 800; font-size: 16px; }
          .qr { width: 130px; height: 130px; background: #fff; border-radius: 10px; display: flex; align-items: center; justify-content: center; padding: 8px; }
          .qr img { width: 100%; height: 100%; }
          .right { flex: 1; padding: 24px 28px; }
          .ticket-id { color: #7b83a1; font-weight: 700; font-size: 16px; margin-bottom: 6px; }
          .name { font-size: 28px; font-weight: 800; color: #2b2f3a; margin: 6px 0 14px; }
          .row { display: flex; gap: 28px; margin: 8px 0 2px; color: #4b5363; }
          .label { font-weight: 700; margin-right: 8px; }
          .muted { color: #9aa2b1; }
          .divider { border-bottom: 1px solid #eceff4; margin: 16px 0; }
          .note { color: #4b5363; font-size: 12.5px; }
        </style>
      </head>
      <body>${ticketHTMLs}</body>
      </html>`;
  };

  const generateAndShareTicketsPDF = async (allTicketsData) => {
    if (!allTicketsData || allTicketsData.length === 0) {
      Alert.alert("Error", "No ticket data found to generate PDF.");
      return;
    }
    try {
      const html = buildAllTicketsHTML(allTicketsData);
      const { uri } = await Print.printToFileAsync({ html });
      const filename = `YatriTickets_${allTicketsData[0].TicketID}.pdf`;
      const dest = FileSystem.documentDirectory + filename;

      await FileSystem.moveAsync({ from: uri, to: dest });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(dest, { dialogTitle: "Share your tickets" });
      } else {
        Alert.alert("Tickets Saved", `File saved to: ${dest}`);
      }
    } catch (e) {
      console.log("PDF error:", e);
      Alert.alert("Error", "Failed to generate tickets PDF.");
    }
  };

  const mockFetchTicketDetails = async ({ slotId, bookingDate,passengerNam,tokenNo,SlotTime,PassportNo }) => {
    await new Promise(r => setTimeout(r, 200)); 
    const ticketId = tokenNo;
    const slotLabel = String(slotId);
    const passengerName = passengerNam;
    const passportNum = PassportNo;
    return {
      TicketID: ticketId,
      PassengerName: passengerName,
      Slot: slotLabel,
      JourneyDate: bookingDate ,
      Time: SlotTime,
      PassportNo: passportNum,
      QRCodeData: `TICKET:${ticketId}|NAME:${passengerName}|DATE:${bookingDate }|SLOT:${slotLabel}`,
      NotesEn: 'N.B: This facility is provided free of cost as of now.',
      NotesBn: 'সতর্কীকরণঃ এই সুবিধাটি বর্তমানে বিনামূল্যে প্রদান করা হয়।'
    };
  };

  // Modified to accept tokenNo,
  // and control loading state per booking item rather than global isLoading.
  const generateTicket = async (tokenNo) => {
    if (!tokenNo) return;
    setLoadingTickets((prev) => ({ ...prev, [tokenNo]: true }));
    try {
      const authtoken = await AsyncStorage.getItem("user_login_token");
      if (!authtoken) {
        setFinalResponse({
          success: false,
          message: "Authentication token not found. Please log in again.",
        });
        setLoadingTickets((prev) => ({ ...prev, [tokenNo]: false }));
        setModalVisible(true);
        return;
      }
      const myHeaders = new Headers();
      myHeaders.append("Authorization",authtoken);

      const formdata = new FormData();
      formdata.append("TokenNo", tokenNo);
      formdata.append("AuthInfo", JSON.stringify({}));

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: formdata,
        redirect: "follow",
      };

      const response = await fetch(
        "https://yatrisubidha.wb.gov.in/service/GetBookingDetailsByTokenNumber",
        requestOptions
      );
      const resultText = await response.text();

      let resultJson;
      try {
        resultJson = JSON.parse(resultText);
      } catch (e) {
        throw new Error("Server returned an invalid response.");
      }

      if (resultJson.status === 0) {
        setFinalResponse({
          success: true,
          message:
            resultJson.message ||
            "Booking saved successfully! Generating tickets...",
        });

        const ticketDetailsPromises = resultJson.data?.map(
          ({ SlotName, PasengerName, TokenNo, SlotTime, PassportNo,JourneyDate }) => {
            return mockFetchTicketDetails({
              slotId: SlotName,
              bookingDate: JourneyDate,
              passengerNam: PasengerName,
              tokenNo: TokenNo,
              SlotTime: SlotTime,
              PassportNo: PassportNo,
            });
          }
        );

        const allTicketDetails = await Promise.all(ticketDetailsPromises);

        await generateAndShareTicketsPDF(allTicketDetails);
        setNextId(2);
        setErrors({});
      } else if (
        resultText.includes("INVALID_TOKEN") ||
        resultText.includes("expire")
      ) {
        setFinalResponse({
          success: false,
          message: "Session expired. Please log in again.",
        });
      } else {
        setFinalResponse({
          success: false,
          message: resultJson.message || "Failed to save booking.",
        });
      }
    } catch (error) {
      setFinalResponse({
        success: false,
        message: "An error occurred. Please check your internet connection.",
      });
    } finally {
      setLoadingTickets((prev) => ({ ...prev, [tokenNo]: false }));
      setModalVisible(true);
    }
  };

  const fetchBookings = async () => {
    if (!fromDate || !toDate) {
      Alert.alert(
        "Select Date Range",
        'Please select at least a "From Date" or "To Date" to found your booking history.'
      );
      return;
    }

    console.log(fromDate ,toDate )
    setLoading(true);
    setNoData(false);
    setError(null);
    setBookings([]);

    try {
      const userDataRaw = await AsyncStorage.getItem("user_data");
      let userId;
      if (userDataRaw) {
        try {
          const userDataParsed = JSON.parse(userDataRaw);
          userId = userDataParsed?.userid;
        } catch (parseErr) {}
      }
      const startDate = formatDate(fromDate);
      const endDate = formatDate(toDate);

    //   const result = await getSlotBookingDetails();
      const result = await getSlotBookingDetails(userId, startDate, endDate);

      if (result && Array.isArray(result.data)) {
        if (result.data.length > 0) {
          setBookings(result.data.map(mapApiDataToBooking));
          setNoData(false);
        } else {
          setBookings([]);
          setNoData(true);
        }
      } else {
        setError(
          result && result.message ? result.message : "Unable to found data."
        );
        setNoData(true);
      }
      setShowCount(7);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError("Failed to found booking data. Please try again.");
      Alert.alert("Error", err.message || "Unable to found data.");
    }
  };

  const onChangeFrom = (event, selectedDate) => {
    setShowFromPicker(Platform.OS === "ios");
    if (selectedDate) setFromDate(selectedDate);
  };

  const onChangeTo = (event, selectedDate) => {
    setShowToPicker(Platform.OS === "ios");
    if (selectedDate) setToDate(selectedDate);
  };

  const openFromPicker = () => setShowFromPicker(true);
  const openToPicker = () => setShowToPicker(true);

  // --- Enhanced Clear Button Handler ---
  const clearDateAndResults = () => {
    setFromDate(null);
    setToDate(null);
    setBookings([]);
    setNoData(false);
    setError(null);
    setShowCount(7);
  };

  const renderAttendanceStatus = (status) => {
    let color = "#737373", bg = "#E5E7EB";
    if (status === "NOT ATTENDED") {
      color = "#D97706";
      bg = "#FFF7ED";
    } else if (status === "ATTENDED") {
      color = "#10B981";
      bg = "#E8FAF1";
    }
    return (
      <Text style={[styles.status, { color, backgroundColor: bg }]}>
        {notAvaiable(status)}
      </Text>
    );
  };

  const renderBooking = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.bookingId}>
          <AntDesign name="idcard" size={15} color="#4123d0" />{" "}
          {notAvaiable(item.id)}
        </Text>
        {renderAttendanceStatus(item.attendanceStatus)}
      </View>
      <View style={styles.dataRow}>
        <Text style={styles.fieldLabel}>Passenger:</Text>
        <Text style={styles.valueText}>{notAvaiable(item.passengerName)}</Text>
      </View>
      <View style={styles.dataRow}>
        <Text style={styles.fieldLabel}>Nationality:</Text>
        <Text style={styles.valueText}>{notAvaiable(item.nationality)}</Text>
      </View>
      <View style={styles.dataRow}>
        <Text style={styles.fieldLabel}>Mobile:</Text>
        <Text style={styles.valueText}>{notAvaiable(item.mobileNumber)}</Text>
      </View>
      <View style={styles.dataRow}>
        <Text style={styles.fieldLabel}>Email:</Text>
        <Text style={styles.valueText}>{notAvaiable(item.email)}</Text>
      </View>
      <View style={styles.dataRow}>
        <Text style={styles.fieldLabel}>Passport No:</Text>
        <Text style={styles.valueText}>{notAvaiable(item.passportNumber)}</Text>
      </View>
      <View style={styles.dataRow}>
        <Text style={styles.fieldLabel}>Passport Valid Upto:</Text>
        <Text style={styles.valueText}>
          {notAvaiable(item.passportValidUpto)}
        </Text>
      </View>
      <View style={styles.dataRow}>
        <Text style={styles.fieldLabel}>Journey Date:</Text>
        <Text style={styles.valueText}>{notAvaiable(item.journeyDate)}</Text>
      </View>
      <View style={styles.dataRow}>
        <Text style={styles.fieldLabel}>Token Number:</Text>
        <Text style={styles.valueText}>{notAvaiable(item.tokenNumber)}</Text>
      </View>
      <View style={styles.dataRow}>
        <Text style={styles.fieldLabel}>Slot Name:</Text>
        <Text style={styles.valueText}>{notAvaiable(item.slotName)}</Text>
      </View>
      <View style={styles.dataRow}>
        <Text style={styles.fieldLabel}>Slot Time:</Text>
        <Text style={styles.valueText}>{notAvaiable(item.slotTime)}</Text>
      </View>
      <View style={styles.dataRow}>
        <Text style={styles.fieldLabel}>Type:</Text>
        <Text style={styles.valueText}>{notAvaiable(item.type)}</Text>
      </View>
      <View style={styles.dataRow}>
        <Text style={styles.fieldLabel}>Visa No:</Text>
        <Text style={styles.valueText}>{notAvaiable(item.visaNo)}</Text>
      </View>
      <View style={styles.dataRow}>
        <Text style={styles.fieldLabel}>Visa Valid Upto:</Text>
        <Text style={styles.valueText}>{notAvaiable(item.visaValidUpto)}</Text>
      </View>
      <View style={styles.dataRow}>
        <Text style={styles.fieldLabel}>Attendance Date:</Text>
        <Text style={styles.valueText}>{notAvaiable(item.attendanceDate)}</Text>
      </View>
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.bookingActionBtn}
          onPress={() => generateTicket(item.tokenNumber)}
          activeOpacity={0.8}
          disabled={!!loadingTickets[item.tokenNumber]}
        >
          {!loadingTickets[item.tokenNumber] && (
            <Text style={styles.bookingActionBtnText}>Download Ticket</Text>
          )}
          {loadingTickets[item.tokenNumber] && (
            <ActivityIndicator
              size="small"
              color="#fff"
              style={{ marginLeft: 0 }}
            />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );

  console.log(bookings.length);

  return (
    <SafeAreaView style={styles.safeContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#4325da" />
      <View style={styles.container}>
        {/* Header row with title and clear button */}
        <View style={styles.headerRowHistory}>
          <Text style={styles.headerText}>Booking History</Text>
          {bookings.length > 0 && <TouchableOpacity
            style={styles.clearBtn}
            onPress={clearDateAndResults}
            activeOpacity={0.88}
            accessibilityLabel="Clear filters and results"
          >
            <MaterialIcons name="cleaning-services" size={22} color="#fff" />
            <Text style={styles.clearBtnText}>Clear</Text>
          </TouchableOpacity>}
        </View>
        <View style={styles.dateInputContainer}>
          <TouchableOpacity
            style={styles.dateFieldContainer}
            onPress={openFromPicker}
            activeOpacity={0.8}
          >
            <Text style={styles.inputLabel}>From Date</Text>
            <View style={styles.dateDisplay}>
              <AntDesign
                name="calendar"
                size={18}
                color="#4325da"
                style={{ marginRight: 4 }}
              />
              <Text style={styles.dateText}>
                {fromDate ? formatDate(fromDate) : "Select From Date"}
              </Text>
            </View>
            {showFromPicker && (
              <DateTimePicker
                testID="fromDate"
                value={fromDate || today}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={onChangeFrom}
                maximumDate={toDate || null}
              />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.dateFieldContainer, { marginLeft: 12 }]}
            onPress={openToPicker}
            activeOpacity={0.8}
          >
            <Text style={styles.inputLabel}>To Date</Text>
            <View style={styles.dateDisplay}>
              <AntDesign
                name="calendar"
                size={18}
                color="#4325da"
                style={{ marginRight: 4 }}
              />
              <Text style={styles.dateText}>
                {toDate ? formatDate(toDate) : "Select End Date"}
              </Text>
            </View>
            {showToPicker && (
              <DateTimePicker
                testID="toDate"
                value={toDate || fromDate || today}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={onChangeTo}
                minimumDate={fromDate || undefined}
              />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.searchBtn}
            onPress={fetchBookings}
            disabled={loading}
          >
            <AntDesign name="search1" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
        {loading && (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#4325da" />
            <Text style={styles.loadingText}>Fetching your bookings...</Text>
          </View>
        )}
        {!loading && error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}
        {!loading && !error && noData && (
          <View style={{ alignItems: "center", marginTop: 30 }}>
            <Text style={styles.emptyText}>
              You have no booking history in this range.
            </Text>
          </View>
        )}
        {!loading && !error && !noData && bookings.length > 0 && (
          <FlatList
            data={bookings.slice(0, showCount)}
            keyExtractor={(item) => String(item.id)}
            renderItem={renderBooking}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <Text style={styles.emptyText}>
                You have no booking history yet.
              </Text>
            }
          />
        )}
        {!loading && !error && bookings.length > showCount && (
          <View
            style={styles.showMoreBtnAbsoluteContainer}
            pointerEvents="box-none"
          >
            <TouchableOpacity
              onPress={() => setShowCount((s) => s + 7)}
              style={styles.showMoreBtnAbsolute}
              activeOpacity={0.8}
            >
              <Text style={styles.showMoreBtnText}>Show More</Text>
            </TouchableOpacity>
          </View>
        )}

        <Modal
          isVisible={isModalVisible}
          animationIn="zoomIn"
          animationOut="zoomOut"
          backdropOpacity={0.5}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              {finalResponse?.success ? (
                <>
                  <View style={styles.lottieContainer}>
                    <LottieView
                      source={require("../Lottie/sucess.json")}
                      autoPlay
                      loop={false}
                      style={styles.lottie}
                    />
                  </View>
                  <Text style={styles.modalTitleSuccess}>
                    Generate Ticket Successfull!
                  </Text>
                  <Text style={styles.modalMessage}>
                    {"Fetch Succesfully"}
                  </Text>
                </>
              ) : (
                <>
                  <View style={styles.lottieContainer}>
                    <LottieView
                      source={require("../Lottie/failed.json")}
                      autoPlay
                      loop={false}
                      style={styles.lottie}
                    />
                  </View>
                  <Text style={styles.modalTitleError}>Generate Ticket Unsuccessfull</Text>
                  <Text style={styles.modalMessage}>
                    {"Something went wrong while generating your ticket. Please try again or contact support if the issue persists."}
                  </Text>
                </>
              )}
              <TouchableOpacity
                style={[
                  styles.closeButton,
                  finalResponse?.success
                    ? styles.closeButtonSuccess
                    : styles.closeButtonError,
                ]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
              
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

export default BookingHistoryScreen;

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  container: {
    flex: 1,
    paddingHorizontal: 14,
    paddingTop: 8,
    backgroundColor: "#f8fafc",
  },
  headerText: {
    fontSize: 22,
    fontWeight: "700",
    color: "#4123d0",
    alignSelf: "flex-start",
  },
  headerRowHistory: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
    marginTop: 5,
  },
  clearBtn: {
    flexDirection: "row",
    backgroundColor: "#4325da",
    borderRadius: 8,
    paddingHorizontal: 14,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 6,
    elevation: 2,
    shadowColor: "#4325da",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.13,
    shadowRadius: 6,
  },
  clearBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
    marginLeft: 8,
    letterSpacing: 0.15,
  },
  dateInputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 12,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 8,
    elevation: 1,
    shadowColor: "#cfcfcf",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  dateFieldContainer: {
    flex: 1,
    paddingRight: 2,
  },
  inputLabel: {
    color: "#6366F1",
    fontWeight: "600",
    fontSize: 13,
    marginBottom: 2,
    marginLeft: 3,
  },
  dateDisplay: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    height: 36,
    backgroundColor: "#f9fafb",
    paddingHorizontal: 9,
  },
  dateText: {
    fontSize: 10,
    color: "#22223b",
    fontWeight: "500",
    letterSpacing: 0.1,
  },
  searchBtn: {
    marginLeft: 10,
    backgroundColor: "#4325da",
    justifyContent: "center",
    alignItems: "center",
    height: 36,
    width: 40,
    borderRadius: 8,
    marginBottom: 2,
    elevation: 1,
  },
  // More visually appealing Floating Clear Button
  fabClearBtnBetter: {
    position: "absolute",
    bottom: 60,
    left: 10,
    flexDirection: "row",
    backgroundColor: "#6C47DE",
    borderRadius: 26,
    paddingVertical: 10,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
    elevation: 7,
    shadowColor: "#422EA5",
    shadowRadius: 14,
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 7 },
    zIndex: 200,
    
  },
  fabClearBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 17,
    marginLeft: 12,
    letterSpacing: 0.3,
    marginRight: 2,
    textShadowColor: "rgba(30,30,30,0.07)",
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 3,
  },
  listContent: {
    paddingTop: 6,
    paddingBottom: 36,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 13,
    padding: 15,
    elevation: 2,
    shadowColor: "#595959",
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.09,
    shadowRadius: 6,
    borderWidth: 1.1,
    borderColor: "#ececff",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  bookingId: {
    fontSize: 15,
    fontWeight: "700",
    color: "#4123d0",
    flexShrink: 1,
  },
  status: {
    fontSize: 12,
    fontWeight: "bold",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 5,
    overflow: "hidden",
    alignSelf: "flex-start",
    textAlign: "center",
  },
  dataRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 1,
    marginTop: 1,
  },
  fieldLabel: {
    minWidth: 130,
    fontSize: 13,
    color: "#6b7280",
    fontWeight: "700",
    letterSpacing: 0.07,
  },
  valueText: {
    fontSize: 13.5,
    color: "#22223b",
    fontWeight: "500",
    flexShrink: 1,
  },
  emptyText: {
    marginTop: 20,
    color: "#737373",
    fontSize: 16,
    textAlign: "center",
  },
  loaderContainer: {
    alignItems: "center",
    marginTop: 38,
    marginBottom: 8,
    flexDirection: "column",
    justifyContent: "center",
    minHeight: 80,
  },
  loadingText: {
    marginTop: 12,
    color: "#4123d0",
    fontSize: 16.5,
    fontWeight: "700",
  },
  errorContainer: {
    alignItems: "center",
    marginTop: 34,
    marginHorizontal: 25,
    minHeight: 60,
    padding: 10,
    backgroundColor: "#FDE8E8",
    borderRadius: 9,
    borderColor: "#FCA5A5",
    borderWidth: 1,
  },
  errorText: {
    color: "#EF4444",
    fontWeight: "bold",
    fontSize: 15,
    textAlign: "center",
  },
  showMoreBtnAbsoluteContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 12,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
    pointerEvents: "box-none",
    paddingBottom: Platform.OS === "ios" ? 15 : 0,
  },
  showMoreBtnAbsolute: {
    backgroundColor: "#4123d0",
    borderRadius: 10,
    paddingVertical: 11,
    paddingHorizontal: 42,
    minWidth: 120,
    elevation: 3,
  },
  showMoreBtnText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.05,
    textAlign: "center",
  },
  buttonRow: {
    marginTop: 12,
    alignItems: "flex-end",
  },
  bookingActionBtn: {
    backgroundColor: "#6366F1",
    borderRadius: 6,
    paddingHorizontal: 22,
    paddingVertical: 12,
    alignSelf: "flex-end",
    marginTop: 0,
    marginBottom: 0,
    elevation: 1,
    minHeight: 42,
    minWidth: 140,
    justifyContent: "center",
    alignItems: "center",
  },
  bookingActionBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 13.5,
    letterSpacing: 0.1,
  },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '90%', backgroundColor: '#FFFFFF', borderRadius: 24, padding: 30, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.2, shadowRadius: 20, elevation: 10 },
  lottieContainer: { alignItems: 'center', marginBottom: 15 },
  lottie: { height: 140, width: 140 },
  modalTitleSuccess: { fontSize: 24, fontWeight: '700', color: '#00B894', marginBottom: 12, textAlign: "center" },
  modalTitleError: { fontSize: 24, fontWeight: '700', color: '#FF3B3B', marginBottom: 12 },
  modalMessage: { fontSize: 15, color: '#636E72', textAlign: 'center', lineHeight: 22, marginBottom: 25 },
  closeButton: { paddingVertical: 14, paddingHorizontal: 50, borderRadius: 12, minWidth: 150 },
  closeButtonSuccess: { backgroundColor: '#00B894' },
  closeButtonError: { backgroundColor: '#FF3B3B' },
  closeButtonText: { color: '#FFFFFF', fontWeight: '700', fontSize: 16, textAlign: 'center' },
});
