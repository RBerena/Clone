import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import {BASE_URL} from '../config/apiConfig';

// const BASE_URL = "http://10.65.43.132:3000/api/users";
// const BASE_URL = "http://192.168.8.157:3000/api/users";

// Language translations
const translations = {
  english: {
    profile: 'Profile',
    plantEnthusiast: '🌿 Plant Enthusiast',
    interests: 'Interests',
    interestsDesc: 'Your Plant-Related Interests',
    creditOverview: 'Credit Overview',
    creditDesc: 'Your Current Credit Balance',
    availableCredits: 'Available Credits',
    redeemed: '-15% Redeemed',
    totalCredits: 'Total Credits Earned',
    quickAccess: 'Quick Access',
    quickAccessDesc: 'Your Settings and Account Tools',
    paymentMethod: 'Payment Method',
    myDevices: 'My Devices',
    faqs: 'FAQs',
    quickLinks: 'Quick Links',
    quickLinksDesc: 'Help and Feedback Options',
    contactSupport: 'Contact Support',
    feedback: 'Feedback',
    settings: 'Settings',
    profilePicture: 'Profile Picture',
    changePassword: 'Change Password',
    notifications: 'Notification Preferences',
    privacy: 'Privacy Settings',
    language: 'Language',
    theme: 'Theme',
    accountSettings: 'Account Settings',
    logout: 'Logout',
    selectLanguage: 'Select Language',
    close: 'Close',
    selectTheme: 'Select Theme',
  },
  hindi: {
    profile: 'प्रोफ़ाइल',
    plantEnthusiast: '🌿 पौधे प्रेमी',
    interests: 'रुचियाँ',
    interestsDesc: 'आपकी पौधा‑संबंधी रुचियाँ',
    creditOverview: 'क्रेडिट अवलोकन',
    creditDesc: 'आपका वर्तमान क्रेडिट बैलेंस',
    availableCredits: 'उपलब्ध क्रेडिट',
    redeemed: '-15% भुनाया गया',
    totalCredits: 'कुल अर्जित क्रेडिट',
    quickAccess: 'त्वरित पहुँच',
    quickAccessDesc: 'आपकी सेटिंग्स और खाते के उपकरण',
    paymentMethod: 'भुगतान विधि',
    myDevices: 'मेरे डिवाइस',
    faqs: 'सामान्य प्रश्न',
    quickLinks: 'त्वरित लिंक',
    quickLinksDesc: 'सहायता और प्रतिक्रिया विकल्प',
    contactSupport: 'सपोर्ट से संपर्क करें',
    feedback: 'प्रतिक्रिया',
    settings: 'सेटिंग्स',
    profilePicture: 'प्रोफ़ाइल तस्वीर',
    changePassword: 'पासवर्ड बदलें',
    notifications: 'सूचना प्राथमिकताएं',
    privacy: 'गोपनीयता सेटिंग्स',
    language: 'भाषा',
    theme: 'थीम',
    accountSettings: 'खाता सेटिंग्स',
    logout: 'लॉग आउट',
    selectLanguage: 'भाषा चुनें',
    close: 'बंद करें',
    selectTheme: 'थीम चुनें',
  },
  punjabi: {
    profile: 'ਪ੍ਰੋਫ਼ਾਈਲ',
    plantEnthusiast: '🌿 ਪੌਦਿਆਂ ਦੇ ਸ਼ੌਕੀਨ',
    interests: 'ਦਿਲਚਸਪੀ',
    interestsDesc: 'ਤੁਹਾਡੀਆਂ ਪੌਦਾ-ਸਬੰਧੀ ਦਿਲਚਸਪੀਆਂ',
    creditOverview: 'ਕ੍ਰੈਡਿਟ ਓਵਰਵਿਊ',
    creditDesc: 'ਤੁਹਾਡਾ ਮੌਜੂਦਾ ਕ੍ਰੈਡਿਟ ਬੈਲੈਂਸ',
    availableCredits: 'ਉਪਲਬਧ ਕ੍ਰੈਡਿਟ',
    redeemed: '-15% ਭੁਗਤਾਨ ਕੀਤਾ',
    totalCredits: 'ਕੁੱਲ ਕਮਾਇਆ ਕ੍ਰੈਡਿਟ',
    quickAccess: 'ਤੁਰੰਤ ਪਹੁੰਚ',
    quickAccessDesc: 'ਤੁਹਾਡੀਆਂ ਸੈਟਿੰਗਾਂ ਅਤੇ ਖਾਤਾ ਸੰਦ',
    paymentMethod: 'ਭੁਗਤਾਨ ਤਰੀਕਾ',
    myDevices: 'ਮੇਰੇ ਡਿਵਾਈਸ',
    faqs: 'ਸਵਾਲ',
    quickLinks: 'ਤੁਰੰਤ ਲਿੰਕ',
    quickLinksDesc: 'ਸਹਾਇਤਾ ਅਤੇ ਫੀਡਬੈਕ ਵਿਕਲਪ',
    contactSupport: 'ਸਹਾਇਤਾ ਨਾਲ ਸੰਪਰਕ ਕਰੋ',
    feedback: 'ਫੀਡਬੈਕ',
    settings: 'ਸੈਟਿੰਗਜ਼',
    profilePicture: 'ਪ੍ਰੋਫ਼ਾਈਲ ਫੋਟੋ',
    changePassword: 'ਪਾਸਵਰਡ ਬਦਲੋ',
    notifications: 'ਸੂਚਨਾ ਪਸੰਦ',
    privacy: 'ਪ੍ਰਾਈਵੇਸੀ ਸੈਟਿੰਗਜ਼',
    language: 'ਭਾਸ਼ਾ',
    theme: 'ਥੀਮ',
    accountSettings: 'ਖਾਤਾ ਸੈਟਿੰਗਜ਼',
    logout: 'ਲਾਗਆਊਟ',
    selectLanguage: 'ਭਾਸ਼ਾ ਚੁਣੋ',
    close: 'ਬੰਦ ਕਰੋ',
    selectTheme: 'ਥੀਮ ਚੁਣੋ',
  },
  french: {
    profile: 'Profil',
    plantEnthusiast: '🌿 Passionné de plantes',
    interests: 'Intérêts',
    interestsDesc: 'Vos intérêts liés aux plantes',
    creditOverview: 'Aperçu des crédits',
    creditDesc: 'Votre solde de crédit actuel',
    availableCredits: 'Crédits disponibles',
    redeemed: '-15 % utilisé',
    totalCredits: 'Crédits totaux gagnés',
    quickAccess: 'Accès rapide',
    quickAccessDesc: 'Vos paramètres et outils de compte',
    paymentMethod: 'Méthode de paiement',
    myDevices: 'Mes appareils',
    faqs: 'FAQ',
    quickLinks: 'Liens rapides',
    quickLinksDesc: "Options d'aide et retours",
    contactSupport: 'Contacter le support',
    feedback: 'Retour',
    settings: 'Paramètres',
    profilePicture: 'Photo de profil',
    changePassword: 'Changer le mot de passe',
    notifications: 'Préférences de notification',
    privacy: 'Paramètres de confidentialité',
    language: 'Langue',
    theme: 'Thème',
    accountSettings: 'Paramètres du compte',
    logout: 'Déconnexion',
    selectLanguage: 'Sélectionner la langue',
    close: 'Fermer',
    selectTheme: 'Sélectionner le thème',
  },
  arabic: {
    profile: 'الملف الشخصي',
    plantEnthusiast: '🌿 عشاق النباتات',
    interests: 'الاهتمامات',
    interestsDesc: 'اهتماماتك المتعلقة بالنباتات',
    creditOverview: 'نظرة عامة على الرصيد',
    creditDesc: 'رصيدك الحالي',
    availableCredits: 'الأرصدة المتاحة',
    redeemed: '-15٪ مستردة',
    totalCredits: 'إجمالي الأرصدة المكتسبة',
    quickAccess: 'وصول سريع',
    quickAccessDesc: 'إعداداتك وأدوات الحساب',
    paymentMethod: 'طريقة الدفع',
    myDevices: 'أجهزتي',
    faqs: 'الأسئلة الشائعة',
    quickLinks: 'روابط سريعة',
    quickLinksDesc: 'خيارات المساعدة والتعليقات',
    contactSupport: 'اتصل بالدعم',
    feedback: 'ملاحظات',
    settings: 'الإعدادات',
    profilePicture: 'صورة الملف الشخصي',
    changePassword: 'تغيير كلمة المرور',
    notifications: 'تفضيلات الإشعارات',
    privacy: 'إعدادات الخصوصية',
    language: 'اللغة',
    theme: 'السمة',
    accountSettings: 'إعدادات الحساب',
    logout: 'تسجيل الخروج',
    selectLanguage: 'اختر اللغة',
    close: 'إغلاق',
    selectTheme: 'اختر السمة',
  },
};
export default function ProfileScreen() {
  const [name, setName] = useState('Loading...');
  const [editing, setEditing] = useState(false);
  const [profileImage, setProfileImage] = useState(require('../assets/images/avatar1.png'));
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [theme, setTheme] = useState('light'); 
  const [showThemeSelector, setShowThemeSelector] = useState(false);
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('english');
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPrivacySettings, setShowPrivacySettings] = useState(false);
  const [profileVisibility, setProfileVisibility] = useState(true); // true = public
  const [dataSharing, setDataSharing] = useState(true);
  const [searchVisibility, setSearchVisibility] = useState(true);
  const [activityStatus, setActivityStatus] = useState(true);
  const [blockedUsers] = useState([]);
  const [showAccountSettings, setShowAccountSettings] = useState(false);
  const navigation = useNavigation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const themes = [
    { name: 'Default', key: 'default' },
    { name: 'Light', key: 'light' },
    { name: 'Dark', key: 'dark' },
  ];

  const colors = {
    default: {
      background: '#FFFFFF', textPrimary: '#000000', textSecondary: 'gray',
      boxBackground: '#fff', boxBorder: '#999', subtitle: 'gray',
      settingsBg: '#fff', settingsBorder: '#ccc',
      settingsText: '#000', closeBtnBg: '#eee', closeBtnText: '#333',
      iconColor: '#000',
    },
    light: {
      background: '#FFFFFF', textPrimary: '#000000', textSecondary: 'gray',
      boxBackground: '#fff', boxBorder: '#999', subtitle: 'gray',
      settingsBg: '#fff', settingsBorder: '#ccc',
      settingsText: '#000', closeBtnBg: '#eee', closeBtnText: '#333',
      iconColor: '#000',
    },
    dark: {
      background: '#000000', textPrimary: '#fff', textSecondary: '#ccc',
      boxBackground: '#222', boxBorder: '#555', subtitle: '#ccc',
      settingsBg: '#000', settingsBorder: '#555',
      settingsText: '#fff', closeBtnBg: '#333', closeBtnText: '#fff',
      iconColor: '#fff',
    }
  };

  const themeColors = colors[theme] || colors.default;
  const dict = translations[selectedLanguage];

  const handleImagePick = async () => {
    const result = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!result.granted) return alert('Permission required');
    const picker = await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, aspect: [1, 1], quality: 1 });
    if (!picker.canceled) setProfileImage({ uri: picker.assets[0].uri });
  };

  const handleNameEdit = async () => {
    try{
      console.log("Attempting to retrieve data")
      const token = await AsyncStorage.getItem("token");
      const user_id = await AsyncStorage.getItem("user_id");

      if(!token || !user_id){
        Alert.alert("Error", "Must be logged in!");
        return;
      }

      console.log("Attempting to append to database..");
      const response = await axios.put(`${BASE_URL}/users/${user_id}`,
        {firstName : name,
         lastName : response.data.data.lastName,
         password : response.data.data.password,
         phoneNumber : response.data.data.phoneNumber,
         countryCode : response.data.data.countryCode
        },
        {headers: {
          Authorization:`${token}`
        }
      }
      );

      console.log("Updated successfully!", response.data);
      Alert.alert("Success!", "Name updated!");
      setEditing(false);
    } catch(error){
      console.error("Error updating name:", error.response.data)
    }
  }

  const handleLogOut = async () => {
    console.log("Logout has been pressed.")
    Alert.alert("Logout", "Would you like to log out?",[
      {text: "Cancel", style:"cancel"},
      {text:"Logout", style:"destructive",
        onPress: async () => {
          try {
            console.log("Clearing data.")
            await AsyncStorage.removeItem("token");
            await AsyncStorage.removeItem("user_id");
            setUser(null);
            setName('');
            console.log("Logging out. Redirecting.")
            navigation.reset({
              index: 0,
              routes: [{name: "Login"}] ,
            });
          } catch (error) {
            console.error("There was a problem trying to log you out.", error);
            Alert.alert("Error", "There was an error logging you out. Please try again.");
          }
        }, 
      },
    ],
    );
  }

  useEffect(() => {
    const getUser = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const user_id = await AsyncStorage.getItem("user_id");

        if(!token || !user_id){
          console.log("Could not find user_id or token.");
          return;
        }

        const response = await axios.get(`${BASE_URL}/users/${user_id}`,
          { headers: {Authorization: `${token}`}
      });

      setUser(response.data.data);
      console.log("Loading name...", response.data.data.first_name)
      setName(response.data.data.first_name +' '+ response.data.data.last_name);
      } catch (error) {
        console.log("There was an error retrieving user profile", error.response.data);
      } finally {
        setLoading(false);
      }
    };
    getUser();
  }, []);

  return (
    <>
      <ScrollView style={[styles.container, { backgroundColor: themeColors.background }]}>
        {/* Top Bar */}
        <View style={styles.header}>
          <Ionicons name="arrow-back" size={24} color={themeColors.iconColor} />
          <Text style={[styles.headerText, { color: themeColors.textPrimary }]}>{dict.profile}</Text>
          <View style={styles.headerIcons}>
            <TouchableOpacity onPress={() => setEditing(true)}>
              <MaterialIcons name="edit" size={22} color={themeColors.iconColor} style={styles.icon} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setSettingsVisible(true)}>
              <Ionicons name="settings-outline" size={22} color={themeColors.iconColor} style={styles.icon} />
            </TouchableOpacity>
          </View>
        </View>

        {/* User Info */}
        <View style={styles.userInfo}>
          <TouchableOpacity onPress={handleImagePick}>
            <Image source={profileImage} style={styles.avatar} />
          </TouchableOpacity>
          {editing ? (
            <TextInput
              style={[styles.nameInput, { color: themeColors.textPrimary, backgroundColor: themeColors.boxBackground, borderColor: themeColors.boxBorder }]}
              value={name}
              onChangeText={setName}
              placeholder="Enter name"
              placeholderTextColor={themeColors.textSecondary}
              autoFocus
              onSubmitEditing={handleNameEdit}
              returnKeyType="done"
            />
          ) : (
            <Text style={[styles.name, { color: themeColors.textPrimary }]}>{name}</Text>
          )}
          <Text style={[styles.subtitle, { color: themeColors.subtitle }]}>{dict.plantEnthusiast}</Text>
        </View>
{/*Interests*/}
<TouchableOpacity onPress={() => navigation.navigate('Interests')}>
  <View style={styles.titleWithIcon}>
    <Image source={require('../assets/images/Interests.png')} style={styles.sectionIcon} />
    <Text style={[styles.sectionTitle, { color: themeColors.textPrimary }]}>{dict.interests}</Text>
  </View>

  <Text style={[styles.sectionDescription, { color: themeColors.textSecondary }]}>
    {dict.interestsDesc}
  </Text>

  <View style={[styles.interestContainer, { backgroundColor: themeColors.boxBackground, borderColor: themeColors.boxBorder }]}>
    {[
      { label: 'Anthophile', image: require('../assets/images/Anthophile.png') },
      { label: 'Floral Arrangement', image: require('../assets/images/Floral.png') },
      { label: 'Botanical Art', image: require('../assets/images/Botanical.png') },
      { label: 'Indoor Gardening', image: require('../assets/images/IndoorGardening.png') },
    ].map((item, i) => (
      <View key={i} style={[styles.interestBox, { backgroundColor: themeColors.boxBackground, borderColor: themeColors.boxBorder }]}>
        <Image source={item.image} style={styles.interestIcon} />
        <Text style={[styles.interestText, { color: themeColors.textPrimary }]}>{item.label}</Text>
      </View>
    ))}
  </View>
</TouchableOpacity>

{/* Credit Overview Section */}
<TouchableOpacity onPress={() => navigation.navigate('Credits')}>
  <View style={styles.titleWithIcon}>
    <Image source={require('../assets/images/Credits.png')} style={styles.sectionIcon} />
    <Text style={[styles.sectionTitle, { color: themeColors.textPrimary }]}>{dict.creditOverview}</Text>
  </View>
</TouchableOpacity>

<Text style={[styles.sectionDescription, { color: themeColors.textSecondary }]}>{dict.creditDesc}</Text>

<View style={[styles.creditOverviewBox, { backgroundColor: themeColors.boxBackground, borderColor: themeColors.boxBorder }]}>
  {[
    { amt: '1500', label: dict.availableCredits },
    { amt: '300', label: dict.redeemed },
    { amt: '2000', label: dict.totalCredits },
  ].map((item, i) => (
    <TouchableOpacity key={i} onPress={() => navigation.navigate('Credits')} style={[styles.creditCard, { borderColor: themeColors.boxBorder }]}>
      <Text style={[styles.creditAmount, { color: themeColors.textPrimary }]}>{item.amt}</Text>
      <Text style={{ color: themeColors.textSecondary }}>{item.label}</Text>
    </TouchableOpacity>
  ))}
</View>


  {/* Quick Access */}
<View style={styles.titleWithIcon}>
  <Image source={require('../assets/images/Quickacess.png')} style={styles.sectionIcon} />
  <Text style={[styles.sectionTitle, { color: themeColors.textPrimary }]}>{dict.quickAccess}</Text>
</View>
<Text style={[styles.sectionDescription, { color: themeColors.textSecondary }]}>{dict.quickAccessDesc}</Text>
<View style={[styles.quickAccessBox, { backgroundColor: themeColors.boxBackground, borderColor: themeColors.boxBorder }]}>

<TouchableOpacity
  style={[styles.quickSubBox, { borderColor: themeColors.boxBorder, backgroundColor: themeColors.boxBackground }]}
  onPress={() => navigation.navigate('Payment')}
>
  <View style={styles.quickItem}>
    <Image source={require('../assets/images/Paymentmethod.png')} style={styles.quickIcon} />
    <Text style={[styles.quickText, { color: themeColors.textPrimary }]}>{dict.paymentMethod}</Text>
  </View>
</TouchableOpacity>


  {/* My Devices - navigates to MyDevice screen */}
  <View style={[styles.quickSubBox, { borderColor: themeColors.boxBorder, backgroundColor: themeColors.boxBackground }]}>
    <TouchableOpacity style={styles.quickItem} onPress={() => navigation.navigate('MyDevice')}>
      <Text style={[styles.quickIcon, { color: themeColors.textPrimary }]}>📱</Text>
      <Text style={[styles.quickText, { color: themeColors.textPrimary }]}>{dict.myDevices}</Text>
    </TouchableOpacity>
  </View>

  {/* FAQs - navigates to FAQs screen */}
  <View style={[styles.quickSubBox, { borderColor: themeColors.boxBorder, backgroundColor: themeColors.boxBackground }]}>
    <TouchableOpacity style={styles.quickItem} onPress={() => navigation.navigate('FAQs')}>
      <Image source={require('../assets/images/FAQs.png')} style={styles.faqIcon} />
      <Text style={[styles.quickText, { color: themeColors.textPrimary }]}>{dict.faqs}</Text>
    </TouchableOpacity>
  </View>

</View>


        {/* Quick Links */}
<View style={styles.titleWithIcon}>
  <Image source={require('../assets/images/Quicklinks.png')} style={styles.sectionIcon} />
  <Text style={[styles.sectionTitle, { color: themeColors.textPrimary }]}>{dict.quickLinks}</Text>
</View>
<Text style={[styles.sectionDescription, { color: themeColors.textSecondary }]}>{dict.quickLinksDesc}</Text>
<View style={[styles.quickLinksBox, { backgroundColor: themeColors.boxBackground, borderColor: themeColors.boxBorder }]}>
  {[
    { icon: 'call-outline', label: dict.contactSupport, screen: 'ContactSupport' },
    { icon: 'chatbox-ellipses-outline', label: dict.feedback, screen: 'Feedback' },
  ].map((item, i) => (
    <View
      key={i}
      style={[styles.quickSubBox, { borderColor: themeColors.boxBorder, backgroundColor: themeColors.boxBackground }]}
    >
      <TouchableOpacity
        style={styles.linkItem}
        onPress={() => navigation.navigate(item.screen)}
      >
        <Ionicons name={item.icon} size={20} color={themeColors.textPrimary} />
        <Text style={[styles.linkText, { color: themeColors.textPrimary }]}>{item.label}</Text>
      </TouchableOpacity>
    </View>
  ))}
</View>
</ScrollView>

{/* Settings Overlay */}
{settingsVisible && (
  <TouchableWithoutFeedback
    onPress={() => {
      setShowThemeSelector(false);
      setShowLanguageSelector(false);
      setShowPrivacySettings(false);
      setShowAccountSettings(false);
      setSettingsVisible(false);
    }}
  >
    <View style={styles.settingsOverlay}>
      <TouchableWithoutFeedback>
        <View style={[styles.settingsMenu, { backgroundColor: themeColors.settingsBg, borderColor: themeColors.settingsBorder }]}>
          {!showThemeSelector && !showLanguageSelector && !showPrivacySettings && !showAccountSettings ? (
            <>
              <Text style={[styles.settingsTitle, { color: themeColors.settingsText }]}>{dict.settings}</Text>
              <ScrollView style={{ maxHeight: 300 }}>
                <TouchableOpacity style={styles.settingsOption} onPress={handleImagePick}>
                  <Text style={[styles.settingsOptionText, { color: themeColors.settingsText }]}>{dict.profilePicture}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.settingsOption} onPress={() => setShowChangePassword(true)}>
                  <Text style={[styles.settingsOptionText, { color: themeColors.settingsText }]}>{dict.changePassword}</Text>
                </TouchableOpacity>
                
                    <TouchableOpacity
  style={styles.settingsOption}
  onPress={() => navigation.navigate('NotificationPreferences')}
>
  <Text style={[styles.settingsOptionText, { color: themeColors.settingsText }]}>
    {dict.notifications}
  </Text>
</TouchableOpacity>


                <TouchableOpacity style={styles.settingsOption} onPress={() => setShowPrivacySettings(true)}>
                  <Text style={[styles.settingsOptionText, { color: themeColors.settingsText }]}>{dict.privacy}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.settingsOption} onPress={() => setShowLanguageSelector(true)}>
                  <Text style={[styles.settingsOptionText, { color: themeColors.settingsText }]}>
                    {dict.language} ({selectedLanguage.charAt(0).toUpperCase() + selectedLanguage.slice(1)})
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.settingsOption} onPress={() => setShowThemeSelector(true)}>
                  <Text style={[styles.settingsOptionText, { color: themeColors.settingsText }]}>{dict.theme}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.settingsOption} onPress={() => setShowAccountSettings(true)}>
                  <Text style={[styles.settingsOptionText, { color: themeColors.settingsText }]}>{dict.accountSettings}</Text>
                </TouchableOpacity>
<TouchableOpacity
  style={styles.settingsOption}
  onPress={handleLogOut}
>
  <Text style={[styles.settingsOptionText, { color: 'red' }]}>{dict.logout}</Text>
</TouchableOpacity>



              </ScrollView>

              <TouchableOpacity
                style={[styles.settingsCloseButton, { backgroundColor: themeColors.closeBtnBg }]}
                onPress={() => setSettingsVisible(false)}
              >
                <Text style={[styles.settingsCloseText, { color: themeColors.closeBtnText }]}>{dict.close}</Text>
              </TouchableOpacity>
            </>
          ) : showThemeSelector ? (
            <>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                <TouchableOpacity onPress={() => setShowThemeSelector(false)} style={{ paddingRight: 10 }}>
                  <Ionicons name="arrow-back" size={24} color={themeColors.settingsText} />
                </TouchableOpacity>
                <Text style={[styles.settingsTitle, { color: themeColors.settingsText, marginLeft: 0 }]}>{dict.selectTheme}</Text>
              </View>
              <ScrollView style={{ maxHeight: 300 }}>
                {themes.map(item => (
                  <TouchableOpacity
                    key={item.key}
                    onPress={() => setTheme(item.key)}
                    style={{
                      padding: 12,
                      borderRadius: 6,
                      backgroundColor: colors[item.key].background,
                      marginVertical: 6,
                      borderWidth: 1,
                      borderColor: theme === item.key ? '#007AFF' : themeColors.boxBorder,
                    }}
                  >
                    <Text style={{ color: item.key === 'dark' ? '#fff' : '#000', fontWeight: 'bold' }}>{item.name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </>
          ) : showLanguageSelector ? (
            <>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                <TouchableOpacity onPress={() => setShowLanguageSelector(false)} style={{ paddingRight: 10 }}>
                  <Ionicons name="arrow-back" size={24} color={themeColors.settingsText} />
                </TouchableOpacity>
                <Text style={[styles.settingsTitle, { color: themeColors.settingsText, marginLeft: 0 }]}>{dict.selectLanguage}</Text>
              </View>
              <ScrollView style={{ maxHeight: 300 }}>
                {['english', 'hindi', 'punjabi', 'french', 'arabic'].map(lang => (
                  <TouchableOpacity
                    key={lang}
                    onPress={() => {
                      setSelectedLanguage(lang);
                      setShowLanguageSelector(false);
                    }}
                    style={{
                      padding: 12,
                      borderRadius: 6,
                      backgroundColor: themeColors.boxBackground,
                      marginVertical: 6,
                      borderWidth: 1,
                      borderColor: selectedLanguage === lang ? '#007AFF' : themeColors.boxBorder,
                    }}
                  >
                    <Text style={{ color: themeColors.textPrimary, fontWeight: 'bold' }}>
                      {lang.charAt(0).toUpperCase() + lang.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </>
          ) : showPrivacySettings ? (
            <>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                <TouchableOpacity onPress={() => setShowPrivacySettings(false)} style={{ paddingRight: 10 }}>
                  <Ionicons name="arrow-back" size={24} color={themeColors.settingsText} />
                </TouchableOpacity>
                <Text style={[styles.settingsTitle, { color: themeColors.settingsText, marginLeft: 0 }]}>
                  {dict.privacy}
                </Text>
              </View>
              <ScrollView style={{ maxHeight: 300 }}>
                {/* Profile Visibility */}
                <View style={{ marginVertical: 8 }}>
                  <Text style={{ color: themeColors.settingsText, fontSize: 16, marginBottom: 6 }}>
                    Profile Visibility
                  </Text>
                  <TouchableOpacity
                    onPress={() => setProfileVisibility(!profileVisibility)}
                    style={{
                      padding: 10,
                      borderRadius: 8,
                      backgroundColor: profileVisibility ? '#4cd137' : '#ccc',
                      alignItems: 'center',
                    }}
                  >
                    <Text style={{ color: profileVisibility ? '#fff' : '#000' }}>
                      {profileVisibility ? 'Public' : 'Private'}
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Data Sharing */}
                <View style={{ marginVertical: 8 }}>
                  <Text style={{ color: themeColors.settingsText, fontSize: 16, marginBottom: 6 }}>
                    Data Sharing
                  </Text>
                  <TouchableOpacity
                    onPress={() => setDataSharing(!dataSharing)}
                    style={{
                      padding: 10,
                      borderRadius: 8,
                      backgroundColor: dataSharing ? '#4cd137' : '#ccc',
                      alignItems: 'center',
                    }}
                  >
                    <Text style={{ color: dataSharing ? '#fff' : '#000' }}>
                      {dataSharing ? 'Enabled' : 'Disabled'}
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Search Visibility */}
                <View style={{ marginVertical: 8 }}>
                  <Text style={{ color: themeColors.settingsText, fontSize: 16, marginBottom: 6 }}>
                    Search Visibility
                  </Text>
                  <TouchableOpacity
                    onPress={() => setSearchVisibility(!searchVisibility)}
                    style={{
                      padding: 10,
                      borderRadius: 8,
                      backgroundColor: searchVisibility ? '#4cd137' : '#ccc',
                      alignItems: 'center',
                    }}
                  >
                    <Text style={{ color: searchVisibility ? '#fff' : '#000' }}>
                      {searchVisibility ? 'Visible' : 'Hidden'}
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Blocked Users */}
                <View style={{ marginVertical: 8 }}>
                  <Text style={{ color: themeColors.settingsText, fontSize: 16, marginBottom: 6 }}>
                    Blocked Users
                  </Text>
                  {blockedUsers.length === 0 ? (
                    <Text style={{ color: themeColors.settingsText, fontStyle: 'italic' }}>No blocked users</Text>
                  ) : (
                    blockedUsers.map((user, i) => (
                      <Text key={i} style={{ color: themeColors.settingsText, paddingLeft: 10 }}>
                        • {user}
                      </Text>
                    ))
                  )}
                  <TouchableOpacity
                    onPress={() => alert('Manage Blocked Users - Add/Remove functionality')}
                    style={{
                      marginTop: 6,
                      padding: 8,
                      backgroundColor: '#007AFF',
                      borderRadius: 8,
                      alignItems: 'center',
                    }}
                  >
                    <Text style={{ color: '#fff' }}>Manage Blocked Users</Text>
                  </TouchableOpacity>
                </View>

                {/* App Permissions */}
                <TouchableOpacity
                  onPress={() => alert('App Permissions clicked')}
                  style={{
                    paddingVertical: 12,
                    borderBottomWidth: 1,
                    borderColor: themeColors.settingsBorder,
                  }}
                >
                  <Text style={{ color: themeColors.settingsText, fontSize: 16 }}>App Permissions</Text>
                </TouchableOpacity>

                {/* Activity Status */}
                <View style={{ marginVertical: 8 }}>
                  <Text style={{ color: themeColors.settingsText, fontSize: 16, marginBottom: 6 }}>
                    Activity Status
                  </Text>
                  <TouchableOpacity
                    onPress={() => setActivityStatus(!activityStatus)}
                    style={{
                      padding: 10,
                      borderRadius: 8,
                      backgroundColor: activityStatus ? '#4cd137' : '#ccc',
                      alignItems: 'center',
                    }}
                  >
                    <Text style={{ color: activityStatus ? '#fff' : '#000' }}>
                      {activityStatus ? 'On' : 'Off'}
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Download/Delete My Data */}
                <View style={{ marginVertical: 8 }}>
                  <Text style={{ color: themeColors.settingsText, fontSize: 16, marginBottom: 6 }}>
                    Download / Delete My Data
                  </Text>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <TouchableOpacity
                      onPress={() => alert('Download data initiated')}
                      style={{
                        flex: 1,
                        padding: 10,
                        backgroundColor: '#007AFF',
                        borderRadius: 8,
                        alignItems: 'center',
                        marginRight: 8,
                      }}
                    >
                      <Text style={{ color: '#fff' }}>Download Data</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => alert('Delete data initiated')}
                      style={{
                        flex: 1,
                        padding: 10,
                        backgroundColor: '#FF3B30',
                        borderRadius: 8,
                        alignItems: 'center',
                        marginLeft: 8,
                      }}
                    >
                      <Text style={{ color: '#fff' }}>Delete Data</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </ScrollView>
            </>
          ) : showAccountSettings ? (
            <>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                <TouchableOpacity onPress={() => setShowAccountSettings(false)} style={{ paddingRight: 10 }}>
                  <Ionicons name="arrow-back" size={24} color={themeColors.settingsText} />
                </TouchableOpacity>
                <Text style={[styles.settingsTitle, { color: themeColors.settingsText, marginLeft: 0 }]}>
                  {dict.accountSettings}
                </Text>
              </View>

              <ScrollView style={{ maxHeight: 300 }}>
                <TouchableOpacity onPress={() => alert('Edit Email')}>
                  <Text style={[styles.settingsOptionText, { color: themeColors.settingsText, marginVertical: 10 }]}>
                    Edit Email
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => alert('Manage Phone Number')}>
                  <Text style={[styles.settingsOptionText, { color: themeColors.settingsText, marginVertical: 10 }]}>
                    Manage Phone Number
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => alert('Link Social Media')}>
                  <Text style={[styles.settingsOptionText, { color: themeColors.settingsText, marginVertical: 10 }]}>
                    Link Social Media
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => alert('Deactivate Account')}>
                  <Text style={[styles.settingsOptionText, { color: 'red', marginVertical: 10 }]}>
                    Deactivate Account
                  </Text>
                </TouchableOpacity>
              </ScrollView>
            </>
          ) : null}
        </View>
      </TouchableWithoutFeedback>
    </View>
  </TouchableWithoutFeedback>
)}


      {/* Change Password Modal */}
      {showChangePassword && (
        <TouchableWithoutFeedback onPress={() => setShowChangePassword(false)}>
          <View style={styles.settingsOverlay}>
            <TouchableWithoutFeedback>
              <View style={[styles.settingsMenu, { backgroundColor: themeColors.settingsBg, borderColor: themeColors.settingsBorder }]}>
                <Text style={[styles.settingsTitle, { color: themeColors.settingsText }]}>{dict.changePassword}</Text>

                <TextInput
                  placeholder="Current Password"
                  placeholderTextColor={themeColors.textSecondary}
                  secureTextEntry
                  style={[
                    styles.nameInput,
                    {
                      color: themeColors.textPrimary,
                      backgroundColor: themeColors.boxBackground,
                      borderColor: themeColors.boxBorder,
                      fontSize: 14,
                      marginTop: 8,
                    },
                  ]}
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                />

                <TextInput
                  placeholder="New Password"
                  placeholderTextColor={themeColors.textSecondary}
                  secureTextEntry
                                  style={[
                  styles.nameInput,
                  {
                    color: themeColors.textPrimary,
                    backgroundColor: themeColors.boxBackground,
                    borderColor: themeColors.boxBorder,
                    fontSize: 14,
                    marginTop: 8,
                  },
                ]}
                value={newPassword}
                onChangeText={setNewPassword}
              />

              <TextInput
                placeholder="Confirm Password"
                placeholderTextColor={themeColors.textSecondary}
                secureTextEntry
                style={[
                  styles.nameInput,
                  {
                    color: themeColors.textPrimary,
                    backgroundColor: themeColors.boxBackground,
                    borderColor: themeColors.boxBorder,
                    marginTop: 8,
                    fontSize: 14,
                    marginBottom: 16,
                  },
                ]}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />

              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <TouchableOpacity
                  style={[
                    styles.settingsCloseButton,
                    { backgroundColor: themeColors.closeBtnBg, flex: 1, marginRight: 8 },
                  ]}
                  onPress={() => setShowChangePassword(false)}
                >
                  <Text style={[styles.settingsCloseText, { color: themeColors.closeBtnText }]}>
                    Cancel
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.settingsCloseButton,
                    { backgroundColor: '#007AFF', flex: 1, marginLeft: 8 },
                  ]}
                  onPress={() => {
                    // Simple password validation example:
                    if (!currentPassword || !newPassword || !confirmPassword) {
                      alert('Please fill all fields');
                      return;
                    }
                    if (newPassword !== confirmPassword) {
                      alert('New passwords do not match');
                      return;
                    }
                    alert('Password changed successfully!');
                    // Here you can add real password update logic
                    setShowChangePassword(false);
                    setCurrentPassword('');
                    setNewPassword('');
                    setConfirmPassword('');
                  }}
                >
                  <Text style={[styles.settingsCloseText, { color: '#fff' }]}>Submit</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    )}
  </>
  );
}
const greenTheme = {
  border: '#4CAF50',       // vibrant green
  background: '#E8F5E9',   // very light green
  text: '#1B5E20',
  };
// StyleSheet  
const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative',
    paddingBottom: 10,
    marginTop:50
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
  },
  headerIcons: { flexDirection: 'row' ,},
  icon: { marginLeft: 10 },
  userInfo: { alignItems: 'center', marginVertical: 20 },
  avatar: { width: 90, height: 90, borderRadius: 45, marginBottom: 8 },
  name: { fontSize: 18, fontWeight: 'bold' },
  nameInput: {
    fontSize: 18,
    fontWeight: 'bold',
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    textAlign: 'center',
    width: 160,
    marginTop: 4,
  },
  subtitle: { color: 'gray' },
  titleWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 20,
  },
  sectionIcon: {
    width: 20,
    height: 20,
    marginRight: 6,
  },
  sectionTitle: { fontSize: 16, fontWeight: 'bold' },
  sectionDescription: {
    fontSize: 13,
    marginTop: 4,
    marginBottom: 10,
  },
  interestContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 12,
    marginVertical: 12,
    borderWidth: 1.5,
    borderRadius: 10,
  },
  interestBox: {
    width: '48%',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginVertical: 6,
    alignItems: 'center',
  },
  interestIcon: {
    width: 30,
    height: 30,
    marginBottom: 6,
  },
  interestText: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  creditOverviewBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 12,
    borderWidth: 1.5,
    borderRadius: 10,
    padding: 12,
  },
  creditCard: {
    flex: 1,
    padding: 12,
    marginHorizontal: 4,
    borderWidth: 1.5,
    borderRadius: 10,
    alignItems: 'flex-start',
  },
  creditAmount: { fontSize: 18, fontWeight: 'bold' },
  quickAccessBox: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginVertical: 20,
    borderWidth: 1.5,
    borderRadius: 10,
    padding: 12,
  },
 quickSubBox: {
  flex: 1,                   
  borderWidth: 1,
  borderRadius: 8,
  marginHorizontal: 4,       
  paddingVertical: 12,
  alignItems: 'center',
},

  quickItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickIcon: {
    width: 24,
    height: 24,
    marginBottom: 4,
  },
  quickText: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 4,
  },
  faqIcon: {
    width: 24,
    height: 24,
    marginBottom: 4,
  },
 quickAccessBox: {
  flexDirection: 'row',
  flexWrap: 'wrap',         
  justifyContent: 'space-between', 
  marginVertical: 20,
  borderWidth: 1.5,
  borderRadius: 10,
  padding: 12,
},

  quickLinksBox: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 0,
    marginVertical: 10,
    borderWidth: 1.5,
    borderRadius: 10,
    paddingVertical: 12,
  },
  linkItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  linkText: { fontSize: 14 },
  settingsOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  settingsMenu: {
    position: 'absolute',
    top: 50,
    right: 16,
    width: 250,
    borderRadius: 12,
    padding: 12,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    borderWidth: 1,

  },
  settingsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  settingsOption: {
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  settingsOptionText: {
    fontSize: 16,
  },
  settingsCloseButton: {
    marginTop: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  settingsCloseText: {
    fontSize: 16,
    textAlign: 'center',
  },
});