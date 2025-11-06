import React, { useState, useEffect } from 'react'; // Added useEffect
import { View, Text, TextInput, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import Modal from 'react-native-modal';
import LottieView from 'lottie-react-native';
import RNPickerSelect from 'react-native-picker-select';
import { LinearGradient } from 'expo-linear-gradient';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';

export default function DynamicFormTemplate({ email, slotId, bookingDate, journeyType }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [finalResponse, setFinalResponse] = useState(null);
  const [errors, setErrors] = useState({});

  // --- State to hold the logged-in user's email ---
  const [loggedInUserEmail, setLoggedInUserEmail] = useState('');

  const getInitialFields = () => [
    { key: 'name', placeholder: 'Enter Name', label: 'Name', value: '', icon: '👤' },
    { key: 'mobile', placeholder: 'Mobile Number', label: 'Mobile Number', prefix: '+91', value: '', icon: '📱' },
    { key: 'email', placeholder: 'Email Address', label: 'Email Address', value: '', icon: '✉️' },
    { key: 'nationality', placeholder: 'Select Nationality', label: 'Nationality', value: '', icon: '🌍' },
    { key: 'passportNumber', placeholder: 'Passport Number', label: 'Passport Number', value: '', icon: '🛂' },
    { key: 'address', placeholder: 'Address', label: 'Address', multiline: true, numberOfLines: 4, value: '', icon: '📍' },
  ];

  const [sections, setSections] = useState([{ id: 1, fields: getInitialFields() }]);
  const [nextId, setNextId] = useState(2);

  // --- Load user's email from AsyncStorage when component mounts ---
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userDataString = await AsyncStorage.getItem('user_data');
        if (userDataString) {
          const userData = JSON.parse(userDataString);
          const userEmail = userData.username; // Get the email from stored data

          if (userEmail) {
            setLoggedInUserEmail(userEmail); // Store email for later use
            
            // Update the email field of the first section
            setSections(currentSections => {
              const newSections = [...currentSections];
              if (newSections.length > 0) {
                newSections[0] = {
                  ...newSections[0],
                  fields: newSections[0].fields.map(field => {
                    if (field.key === 'email') {
                      return { ...field, value: userEmail };
                    }
                    return field;
                  })
                };
              }
              return newSections;
            });
          }
        }
      } catch (error) {
        console.error("Failed to load user data into form:", error);
      }
    };

    loadUserData();
  }, []); // Empty array ensures this runs only once

  const nationalityOptions = [
    { label: 'Indian', value: 'Indian' },
    { label: 'Bangladeshi', value: 'Bangladeshi' },
    { label: 'Nepali', value: 'Nepali' },
    { label: 'Sri Lankan', value: 'Sri Lankan' },
    { label: 'Pakistani', value: 'Pakistani' },
    { label: 'Bhutani', value: 'Bhutani' },
    { label: 'Afghan', value: 'Afghan' },
    { label: 'Burmese', value: 'Burmese' },
    { label: 'Chinese', value: 'Chinese' },
  ];

  // --- Modified addSection to pre-fill email ---
  const addSection = () => {
    const newFields = getInitialFields();
    
    // Find the email field and set its value from the stored email state
    const emailField = newFields.find(field => field.key === 'email');
    if (emailField && loggedInUserEmail) {
        emailField.value = loggedInUserEmail;
    }

    setSections([...sections, { id: nextId, fields: newFields }]);
    setNextId(nextId + 1);
  };

  const removeSection = (id) => {
    if (sections.length > 1) {
      setSections(sections.filter(section => section.id !== id));
      setErrors(prevErrors => {
        const updatedErrors = { ...prevErrors };
        delete updatedErrors[id];
        return updatedErrors;
      });
    }
  };

  const handleInputChange = (text, sectionId, fieldKey) => {
    setSections(sections.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          fields: section.fields.map(field => {
            if (field.key === fieldKey) {
              return { ...field, value: text };
            }
            return field;
          })
        };
      }
      return section;
    }));

    const newErrors = { ...errors };
    if (!newErrors[sectionId]) newErrors[sectionId] = {};

    if (fieldKey === 'name') {
      if (!text) newErrors[sectionId].name = 'Name is required';
      else delete newErrors[sectionId].name;
    } else if (fieldKey === 'email') {
      if (!text) newErrors[sectionId].email = 'Email Address is required';
      else if (!/\S+@\S+\.\S+/.test(text)) newErrors[sectionId].email = 'Invalid email address';
      else delete newErrors[sectionId].email;
    } else if (fieldKey === 'mobile') {
      if (!text) newErrors[sectionId].mobile = 'Mobile number is required';
      else if (!/^\d{10}$/.test(text)) newErrors[sectionId].mobile = 'Mobile number must be 10 digits';
      else delete newErrors[sectionId].mobile;
    } else {
      if (!text && ['nationality', 'passportNumber', 'address'].includes(fieldKey)) {
        newErrors[sectionId][fieldKey] = `${fieldKey.charAt(0).toUpperCase() + fieldKey.slice(1)} is required`;
      } else if (newErrors[sectionId][fieldKey]) {
        delete newErrors[sectionId][fieldKey];
      }
    }

    if (Object.keys(newErrors[sectionId]).length === 0) {
      delete newErrors[sectionId];
    }

    setErrors(newErrors);
  };

  const validate = () => {
    const newErrors = {};
    sections.forEach(section => {
      const sectionErrors = {};
      section.fields.forEach(field => {
        if (!field.value) {
          sectionErrors[field.key] = `${field.label} is required`;
        } else if (field.key === 'email' && !/\S+@\S+\.\S+/.test(field.value)) {
          sectionErrors[field.key] = 'Invalid email address';
        } else if (field.key === 'mobile' && !/^\d{10}$/.test(field.value)) {
          sectionErrors[field.key] = 'Mobile number must be 10 digits';
        }
      });
      if (Object.keys(sectionErrors).length > 0) {
        newErrors[section.id] = sectionErrors;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const mockFetchTicketDetails = async ({ slotId, bookingDate, passenger }) => {
    await new Promise(r => setTimeout(r, 600));
    const ticketId = '20230816-02-000003';
    const slotLabel = `SLOT-${String(slotId || 2)}`;
    return {
      TicketID: ticketId,
      PassengerName: passenger?.FullName || 'Akash Singh',
      Slot: slotLabel,
      JourneyDate: bookingDate || '2023-08-16',
      Time: '07:00 AM - 08:00 AM',
      PassportNo: passenger?.PassportNo || 'A5DFLK454',
      QRCodeData: `TICKET:${ticketId}|NAME:${passenger?.FullName || 'Akash Singh'}|DATE:${bookingDate || '2023-08-16'}|SLOT:${slotLabel}`,
      NotesEn: 'N.B: This facility is provided free of cost as of now.',
      NotesBn: 'সতর্কীকরণঃ এই সুবিধাটি বর্তমানে বিনামূল্যে প্রদান করা হয়।'
    };
  };

  const buildTicketHTML = (d) => {
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(d.QRCodeData)}`;

    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <title>Ticket</title>
      <style>
        @page { size: A4; margin: 24mm; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', 'Noto Sans Bengali', 'Bangla Sangam MN', sans-serif; }
        .ticket {
          border: 2px dashed #D7DCE3;
          border-radius: 16px;
          display: flex;
          overflow: hidden;
          width: 100%;
        }
        .left {
          width: 180px;
          background: linear-gradient(180deg, #a076f1, #7c4dff);
          padding: 20px 16px;
          color: #fff;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }
        .slot {
          font-weight: 800;
          font-size: 16px;
          letter-spacing: 0.5px;
        }
        .qr {
          width: 130px;
          height: 130px;
          background: #fff;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 8px;
        }
        .qr img { width: 100%; height: 100%; }
        .right {
          flex: 1;
          padding: 24px 28px;
        }
        .ticket-id {
          color: #7b83a1;
          font-weight: 700;
          font-size: 16px;
          margin-bottom: 6px;
        }
        .name {
          font-size: 28px;
          font-weight: 800;
          color: #2b2f3a;
          margin: 6px 0 14px;
        }
        .row { display: flex; gap: 28px; margin: 8px 0 2px; color: #4b5363; }
        .label { font-weight: 700; margin-right: 8px; }
        .muted { color: #9aa2b1; }
        .divider { border-bottom: 1px solid #eceff4; margin: 16px 0; }
        .note { color: #4b5363; font-size: 12.5px; }
      </style>
    </head>
    <body>
      <div class="ticket">
        <div class="left">
          <div class="slot">${d.Slot}</div>
          <div class="qr">
            <img src="${qrUrl}" />
          </div>
        </div>
        <div class="right">
          <div class="ticket-id">${d.TicketID}</div>
          <div class="name">${d.PassengerName}</div>

          <div class="row">
            <div><span class="label">📅 Date</span> <span>${d.JourneyDate}</span></div>
            <div><span class="label">⏰ Time</span> <span>${d.Time}</span></div>
          </div>

          <div class="row">
            <div><span class="label">🛂 Passport Number</span> <span class="muted">${d.PassportNo}</span></div>
          </div>

          <div class="divider"></div>

          <div class="note">${d.NotesEn}</div>
          <div class="note" style="margin-top: 6px;">${d.NotesBn}</div>
        </div>
      </div>
    </body>
    </html>`;
  };

  const generateTicketPDF = async (ticketData) => {
    try {
      const html = buildTicketHTML(ticketData);
      const { uri } = await Print.printToFileAsync({ html });
      const filename = `YatriTicket_${ticketData.TicketID}.pdf`;
      const dest = FileSystem.documentDirectory + filename;
      await FileSystem.moveAsync({ from: uri, to: dest });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(dest);
      } else {
        Alert.alert('Ticket Saved', `File saved to: ${dest}`);
      }
    } catch (e) {
      console.log('PDF error:', e);
      Alert.alert('Error', 'Failed to generate ticket PDF.');
    }
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setIsLoading(true);

    try {
      const token = await AsyncStorage.getItem("user_login_token");
      if (!token) {
        setFinalResponse({ success: false, message: "Authentication token not found. Please log in again." });
        setIsLoading(false);
        setModalVisible(true);
        return;
      }

      const passengerInformation = sections.map(section => {
        const passenger = {};
        section.fields.forEach(field => {
          if (field.key === 'name') passenger.FullName = field.value;
          if (field.key === 'address') passenger.Address = field.value;
          if (field.key === 'nationality') passenger.Nationality = field.value;
          if (field.key === 'mobile') passenger.MobileNo = field.value;
          if (field.key === 'email') passenger.EmailID = field.value;
          if (field.key === 'passportNumber') passenger.PassportNo = field.value;
        });
        passenger.DOB = "1995-06-15";
        passenger.Gender = "M";
        passenger.PassportValidUpto = "2028-01-12";
        passenger.VisaNo = "N/A";
        passenger.VisaValidUpto = "2028-07-29";
        return passenger;
      });

      const formdata = new FormData();
      formdata.append("PassengerInformation", JSON.stringify(passengerInformation));
      formdata.append("PrefferedSlotID", slotId);
      formdata.append("JourneyDate", bookingDate);
      formdata.append("AuthInfo", JSON.stringify({
        SessionID: "123", IPaddress: "192.168.1.1", MACAddress: "123456", OSversion: "MAC"
      }));
      formdata.append("Type", "2");

      const myHeaders = new Headers();
      myHeaders.append("Authorization", token);

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: formdata,
        redirect: "follow",
      };

      const response = await fetch("https://yatrisubidha.wb.gov.in/service/savePassengerSlotBooking", requestOptions);
      const resultText = await response.text();
      console.log("Booking Save Result:", resultText);

      let resultJson;
      try {
        resultJson = JSON.parse(resultText);
      } catch (e) {
        throw new Error("Server returned an invalid response.");
      }

      if (resultJson.status === 0) {
        setFinalResponse({ success: true, message: resultJson.message || "Booking saved successfully!" });
        setSections([{ id: 1, fields: getInitialFields() }]);
        setNextId(2);
        setErrors({});

        const firstPassenger = passengerInformation[0] || {};
        const ticketDetails = await mockFetchTicketDetails({
          slotId: slotId || 2,
          bookingDate,
          passenger: firstPassenger
        });
        await generateTicketPDF(ticketDetails);

      } else if (resultText.includes("INVALID_TOKEN") || resultText.includes("expire")) {
        setFinalResponse({ success: false, message: "Session expired. Please log in again." });
      } else {
        setFinalResponse({ success: false, message: resultJson.message || "Failed to save booking." });
      }

    } catch (error) {
      console.error('Error in saving booking:', error);
      setFinalResponse({ success: false, message: "An error occurred. Please check your internet connection." });
    } finally {
      setIsLoading(false);
      setModalVisible(true);
    }
  };

  return (
    <View style={styles.mainContainer}>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6C5CE7" />
          <Text style={styles.loadingText}>Processing your booking...</Text>
        </View>
      ) : (
        <ScrollView 
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Passenger Information</Text>
            <Text style={styles.headerSubtitle}>Fill in the details for all passengers</Text>
          </View>

          {sections.map((section, index) => (
            <View key={section.id} style={styles.sectionCard}>
              <View style={styles.sectionHeader}>
                <View style={styles.passengerBadge}>
                  <Text style={styles.passengerBadgeText}>Passenger {index + 1}</Text>
                </View>
                {section.id !== 1 && (
                  <TouchableOpacity
                    onPress={() => removeSection(section.id)}
                    style={styles.removeButton}
                  >
                    <Text style={styles.removeButtonText}>✕ Remove</Text>
                  </TouchableOpacity>
                )}
              </View>

              <View style={styles.fieldContainer}>
                <Text style={styles.label}>
                  <Text style={styles.icon}>👤</Text> Name
                  <Text style={styles.required}> *</Text>
                </Text>
                <View style={[styles.inputContainer, errors[section.id]?.name && styles.inputError]}>
                  <TextInput
                    placeholder='Enter full name'
                    placeholderTextColor="#999"
                    style={styles.input}
                    value={section.fields.find(field => field.key === 'name').value}
                    onChangeText={(text) => handleInputChange(text, section.id, 'name')}
                  />
                </View>
                {errors[section.id]?.name && (
                  <Text style={styles.error}>⚠️ {errors[section.id].name}</Text>
                )}
              </View>

              <View style={styles.fieldContainer}>
                <Text style={styles.label}>
                  <Text style={styles.icon}>📱</Text> Mobile
                  <Text style={styles.required}> *</Text>
                </Text>
                <View style={[styles.inputContainer, errors[section.id]?.mobile && styles.inputError]}>
                  <Text style={styles.prefix}>+91</Text>
                  <TextInput
                    placeholder='10 digit number'
                    placeholderTextColor="#999"
                    style={styles.input}
                    value={section.fields.find(field => field.key === 'mobile').value}
                    onChangeText={(text) => handleInputChange(text, section.id, 'mobile')}
                    keyboardType="numeric"
                    maxLength={10}
                  />
                </View>
                {errors[section.id]?.mobile && (
                  <Text style={styles.error}>⚠️ {errors[section.id].mobile}</Text>
                )}
              </View>

              <View style={styles.fieldContainer}>
                <Text style={styles.label}>
                  <Text style={styles.icon}>✉️</Text> Email
                  <Text style={styles.required}> *</Text>
                </Text>
                <View style={[styles.inputContainer, errors[section.id]?.email && styles.inputError]}>
                  <TextInput
                    placeholder='email@example.com'
                    placeholderTextColor="#999"
                    style={styles.input}
                    value={section.fields.find(field => field.key === 'email').value}
                    onChangeText={(text) => handleInputChange(text, section.id, 'email')}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
                {errors[section.id]?.email && (
                  <Text style={styles.error}>⚠️ {errors[section.id].email}</Text>
                )}
              </View>

              <View style={styles.rowContainer}>
                <View style={styles.halfField}>
                  <Text style={styles.label}>
                    <Text style={styles.icon}>🌍</Text> Nationality
                    <Text style={styles.required}> *</Text>
                  </Text>
                  <View style={[styles.pickerContainer, errors[section.id]?.nationality && styles.inputError]}>
                    <RNPickerSelect
                      onValueChange={(value) => handleInputChange(value, section.id, 'nationality')}
                      items={nationalityOptions}
                      style={pickerSelectStyles}
                      value={section.fields.find(f => f.key === 'nationality').value}
                      placeholder={{ label: 'Select Nationality', value: '' }}
                      useNativeAndroidPickerStyle={false}
                    />
                  </View>
                  {errors[section.id]?.nationality && (
                    <Text style={styles.error}>⚠️ {errors[section.id].nationality}</Text>
                  )}
                </View>

                <View style={styles.halfField}>
                  <Text style={styles.label}>
                    <Text style={styles.icon}>🛂</Text> Passport No.
                    <Text style={styles.required}> *</Text>
                  </Text>
                  <View style={[styles.inputContainer, errors[section.id]?.passportNumber && styles.inputError]}>
                    <TextInput
                      placeholder='Enter passport number'
                      placeholderTextColor="#999"
                      style={styles.input}
                      value={section.fields.find(field => field.key === 'passportNumber').value}
                      onChangeText={(text) => handleInputChange(text, section.id, 'passportNumber')}
                    />
                  </View>
                  {errors[section.id]?.passportNumber && (
                    <Text style={styles.error}>⚠️ {errors[section.id].passportNumber}</Text>
                  )}
                </View>
              </View>

              <View style={styles.fieldContainer}>
                <Text style={styles.label}>
                  <Text style={styles.icon}>📍</Text> Address
                  <Text style={styles.required}> *</Text>
                </Text>
                <View style={[styles.textAreaContainer, errors[section.id]?.address && styles.inputError]}>
                  <TextInput
                    multiline={true}
                    numberOfLines={4}
                    style={styles.textArea}
                    placeholder='Enter complete address'
                    placeholderTextColor="#999"
                    textAlignVertical='top'
                    value={section.fields.find(field => field.key === 'address').value}
                    onChangeText={(text) => handleInputChange(text, section.id, 'address')}
                  />
                </View>
                {errors[section.id]?.address && (
                  <Text style={styles.error}>⚠️ {errors[section.id].address}</Text>
                )}
              </View>
            </View>
          ))}

          <TouchableOpacity style={styles.addButton} onPress={addSection}>
            <Text style={styles.addButtonText}>+ Add Another Passenger</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <LinearGradient
              colors={['#6C5CE7', '#5849D4']}
              style={styles.submitGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.submitButtonText}>Submit Booking</Text>
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
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
                    source={require('../Lottie/sucess.json')}
                    autoPlay
                    loop={false}
                    style={styles.lottie}
                  />
                </View>
                <Text style={styles.modalTitleSuccess}>Booking Successful!</Text>
                <Text style={styles.modalMessage}>{finalResponse?.message}</Text>
              </>
            ) : (
              <>
                <View style={styles.lottieContainer}>
                  <LottieView
                    source={require('../Lottie/failed.json')}
                    autoPlay
                    loop={false}
                    style={styles.lottie}
                  />
                </View>
                <Text style={styles.modalTitleError}>Booking Failed</Text>
                <Text style={styles.modalMessage}>{finalResponse?.message}</Text>
              </>
            )}
            <TouchableOpacity
              style={[styles.closeButton, finalResponse?.success ? styles.closeButtonSuccess : styles.closeButtonError]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: 'transparent' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent'},
  loadingText: { marginTop: 15, fontSize: 16, color: '#6C5CE7', fontWeight: '600' },
  container: { paddingHorizontal: 20, paddingBottom: 30 },
  header: { marginTop: 20, marginBottom: 25 },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#2D3436', marginBottom: 5 },
  headerSubtitle: { fontSize: 15, color: '#636E72' },
  sectionCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 20, marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, paddingBottom: 15, borderBottomWidth: 1, borderBottomColor: '#E8E8E8' },
  passengerBadge: { backgroundColor: '#6C5CE7', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  passengerBadgeText: { color: '#FFFFFF', fontWeight: '700', fontSize: 14 },
  removeButton: { backgroundColor: '#FFE5E5', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 15 },
  removeButtonText: { color: '#FF3B3B', fontWeight: '600', fontSize: 13 },
  fieldContainer: { marginBottom: 18 },
  rowContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 18 },
  halfField: { width: '48%' },
  label: { fontSize: 15, fontWeight: '600', color: '#2D3436', marginBottom: 8 },
  icon: { fontSize: 16, marginRight: 5 },
  required: { color: '#FF3B3B', fontWeight: 'bold' },
  inputContainer: { height: 50, borderWidth: 1.5, borderColor: '#DFE6E9', borderRadius: 12, flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', paddingHorizontal: 15 },
  inputError: { borderColor: '#FF3B3B', backgroundColor: '#FFF5F5' },
  input: { flex: 1, fontSize: 15, color: '#2D3436' },
  prefix: { fontWeight: '700', color: '#2D3436', marginRight: 8, fontSize: 15 },
  pickerContainer: { height: 50, borderWidth: 1.5, borderColor: '#DFE6E9', borderRadius: 12, justifyContent: 'center', backgroundColor: '#FFFFFF', paddingHorizontal: 10 },
  textAreaContainer: { borderWidth: 1.5, borderColor: '#DFE6E9', borderRadius: 12, padding: 15, height: 100, backgroundColor: '#FFFFFF' },
  textArea: { flex: 1, fontSize: 15, color: '#2D3436' },
  error: { color: '#FF3B3B', fontSize: 12, marginTop: 6, fontWeight: '500' },
  addButton: { backgroundColor: '#FFFFFF', borderWidth: 2, borderColor: '#6C5CE7', borderStyle: 'dashed', borderRadius: 12, paddingVertical: 16, alignItems: 'center', marginBottom: 20 },
  addButtonText: { color: '#6C5CE7', fontSize: 16, fontWeight: '700' },
  submitButton: { borderRadius: 12, overflow: 'hidden', marginBottom: 10, shadowColor: '#6C5CE7', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5 },
  submitGradient: { paddingVertical: 18, alignItems: 'center' },
  submitButtonText: { color: '#FFFFFF', fontSize: 18, fontWeight: '700', letterSpacing: 0.5 },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '90%', backgroundColor: '#FFFFFF', borderRadius: 24, padding: 30, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.2, shadowRadius: 20, elevation: 10 },
  lottieContainer: { alignItems: 'center', marginBottom: 15 },
  lottie: { height: 140, width: 140 },
  modalTitleSuccess: { fontSize: 24, fontWeight: '700', color: '#00B894', marginBottom: 12 },
  modalTitleError: { fontSize: 24, fontWeight: '700', color: '#FF3B3B', marginBottom: 12 },
  modalMessage: { fontSize: 15, color: '#636E72', textAlign: 'center', lineHeight: 22, marginBottom: 25 },
  closeButton: { paddingVertical: 14, paddingHorizontal: 50, borderRadius: 12, minWidth: 150 },
  closeButtonSuccess: { backgroundColor: '#00B894' },
  closeButtonError: { backgroundColor: '#FF3B3B' },
  closeButtonText: { color: '#FFFFFF', fontWeight: '700', fontSize: 16, textAlign: 'center' },
});

// Styles specifically for RNPickerSelect
const pickerSelectStyles = StyleSheet.create({
  inputIOS: { fontSize: 15, paddingVertical: 12, paddingHorizontal: 10, color: '#2D3436' },
  inputAndroid: { fontSize: 15, paddingHorizontal: 10, paddingVertical: 12, color: '#2D3436' },
  placeholder: { color: '#999', fontSize: 15 },
});