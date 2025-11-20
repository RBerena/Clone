import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StripeProvider } from '@stripe/stripe-react-native';
import React from 'react';

import { CartProvider } from './context/CartContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { NotificationProvider } from './context/NotificationContext';
import DrawerNavigator from './navigation/DrawerNavigator';

// Import all screens (ensure all paths and exports are correct)
import AdminDashboardScreen from './screens/AdminDashboardScreen';
import BillingAddressScreen from './screens/BillingAddressScreen';
import CardDetailsScreen from './screens/CardDetailsScreen';
import CheckoutScreen from './screens/CheckoutScreen';
import CO2ReportScreen from './screens/CO2ReportScreen';
import ContactSupport from './screens/ContactSupport';
import CreditsScreen from './screens/CreditsScreen';
import FAQScreen from './screens/FAQScreen';
import Feedback from './screens/Feedback';
import GiftCardScreen from './screens/GiftCardScreen';
import InitialScreen from './screens/InitialScreen';
import InterestsScreen from './screens/InterestsScreen';
import LoginScreen from './screens/LoginScreen';
import MyDeviceScreen from './screens/MyDeviceScreen';
import MyInformationScreen from './screens/MyInformationScreen';
import Notification from './screens/Notification';
import PaymentScreen from './screens/PaymentScreen';
import PaypalScreen from './screens/PayPalScreen';
import ProfileScreen from './screens/ProfileScreen';
import RecentUsersScreen from './screens/RecentUsersScreen';
import ScanScreen from './screens/ScanScreen';
import SignupScreen from './screens/SignupScreen';
import SuccessScreen from './screens/SuccessScreen';
import TwoFactorAuthScreen from './screens/TwoFactorAuthScreen';
import TwoFactorIntroScreen from './screens/TwoFactorIntroScreen';
import TwoFactorMethodScreen from './screens/TwoFactorMethodScreen';
import UserRewardScreen from './screens/UserRewardScreen';
import UserSubscriptionReportScreen from './screens/UserSubscriptionReportScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <StripeProvider publishableKey="pk_test_51Ro4iyQ2evdTCnfsJuWeMSwcUysudZLjz98Uu7K9gpR1I6OdSQyGxl0OFec43A0woOOmSB1yZ4u1331hOe9yiC0000gIRJq8ew">
      <NotificationProvider>
        <CartProvider>
          <FavoritesProvider>
            <NavigationContainer>
              <Stack.Navigator initialRouteName="Initial">
                {/* Auth Flow */}
                <Stack.Screen name="Initial" component={InitialScreen} options={{ headerShown: false }} />
                <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
                <Stack.Screen name="Signup" component={SignupScreen} options={{ headerShown: false }} />
                <Stack.Screen name="TwoFactorAuth" component={TwoFactorAuthScreen} options={{ headerShown: false }} />

                {/* Main App (Drawer) */}
                <Stack.Screen name="MainApp" component={DrawerNavigator} options={{ headerShown: false }} />

                {/* Home & Scan */}
                <Stack.Screen name="Scan" component={ScanScreen} />

                {/* Admin & Reports */}
                <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
                <Stack.Screen name="UserSubscriptionReportScreen" component={UserSubscriptionReportScreen} />

                {/* Profile-Linked */}
                <Stack.Screen name="Profile" component={ProfileScreen} />
                <Stack.Screen name="Interests" component={InterestsScreen} />
                <Stack.Screen name="Credits" component={CreditsScreen} />
                <Stack.Screen name="MyDevice" component={MyDeviceScreen} />
                <Stack.Screen name="FAQs" component={FAQScreen} />
                <Stack.Screen name="ContactSupport" component={ContactSupport} />
                <Stack.Screen name="NotificationPreferences" component={Notification} />
                <Stack.Screen name="Feedback" component={Feedback} />

                {/* Shopping Flow */}
                <Stack.Screen name="Checkout" component={CheckoutScreen} />
                <Stack.Screen name="MyInformation" component={MyInformationScreen} />
                <Stack.Screen name="BillingAddress" component={BillingAddressScreen} />

                {/* Payment Screens */}
                <Stack.Screen name="Payment" component={PaymentScreen} />
                <Stack.Screen name="CardDetails" component={CardDetailsScreen} />
                <Stack.Screen name="Paypal" component={PaypalScreen} />
                <Stack.Screen name="GiftCard" component={GiftCardScreen} />
                <Stack.Screen name="Success" component={SuccessScreen} />

                {/* Admin Dashboard Extras */}
                <Stack.Screen name="CO2ReportScreen" component={CO2ReportScreen} />
                <Stack.Screen name="UserRewardScreen" component={UserRewardScreen} />
                <Stack.Screen name="RecentUsersScreen" component={RecentUsersScreen} />

                {/* Two Factor Auth */}
                <Stack.Screen name="TwoFactorIntro" component={TwoFactorIntroScreen} />
                <Stack.Screen name="TwoFactorMethod" component={TwoFactorMethodScreen} />
              </Stack.Navigator>
            </NavigationContainer>
          </FavoritesProvider>
        </CartProvider>
      </NotificationProvider>
    </StripeProvider>
  );
}
