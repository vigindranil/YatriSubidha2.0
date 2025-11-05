import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView, StyleSheet, Text, View, StatusBar } from 'react-native';
import NavigationRegister from './Navigation/NavigationRegister';
import { Provider } from 'react-redux';
import { store, persistor } from './Redux/Store'; // Import both store and persistor
import { PersistGate } from 'redux-persist/integration/react'; // Import PersistGate

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SafeAreaView style={styles.container}>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <StatusBar barStyle="light-content" backgroundColor="transparent" translucent={true} />
            <NavigationRegister />
          </GestureHandlerRootView>
        </SafeAreaView>
      </PersistGate>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
