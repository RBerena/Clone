import React, { useState } from 'react';
import {
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

// Static FAQ data organized by categories
const FAQ_DATA = [
  {
    category: 'Plant Identification',
    faqs: [
      {
        question: 'How to identify plants using the app?',
        answer:
          'Use the scan feature or upload a photo to get detailed plant identification.',
      },
      {
        question: 'Care tips for popular plants?',
        answer:
          'Each plant identified will have a care guide with watering, sunlight, and fertilizer tips.',
      },
    ],
  },
  {
    category: 'Troubleshooting',
    faqs: [
      {
        question: 'What if scanning or photo upload fails?',
        answer:
          'Ensure good lighting and clear images. Try restarting the app or updating it.',
      },
    ],
  },
  {
    category: 'Credits & Rewards',
    faqs: [
      {
        question: 'How do credits and rewards work?',
        answer:
          'Credits can be earned by participating in activities and redeemed for benefits within the app.',
      },
    ],
  },
  {
    category: 'Privacy & Settings',
    faqs: [
      {
        question: 'How is my data used?',
        answer:
          'We prioritize your privacy. Data is used only to improve your app experience as described in our policy.',
      },
      {
        question: 'How to change profile settings or theme?',
        answer:
          'Go to the Profile settings to update your info and switch themes between light, dark, and green modes.',
      },
    ],
  },
];

export default function FAQScreen() {
  const [searchText, setSearchText] = useState(''); // Text input for searching questions
  const [expandedIds, setExpandedIds] = useState({}); // Track which FAQ items are expanded

  // Toggles answer visibility for a specific question
  const toggleExpand = (categoryIndex, faqIndex) => {
    const key = `${categoryIndex}-${faqIndex}`;
    setExpandedIds((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Filters FAQs based on search input
  const filteredData = FAQ_DATA.map((category, categoryIndex) => {
    const filteredFaqs = category.faqs.filter(({ question }) =>
      question.toLowerCase().includes(searchText.toLowerCase())
    );
    return { ...category, faqs: filteredFaqs };
  }).filter((category) => category.faqs.length > 0);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Page title */}
      <Text style={styles.header}>Frequently Asked Questions</Text>

      {/* Search input box */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search questions..."
        value={searchText}
        onChangeText={setSearchText}
        placeholderTextColor="#666"
      />

      {/* Render filtered FAQs grouped by category */}
      {filteredData.map((category, categoryIndex) => (
        <View key={category.category} style={styles.categoryContainer}>
          {/* Category Title */}
          <Text style={styles.categoryTitle}>{category.category}</Text>

          {/* Render each FAQ in the category */}
          {category.faqs.map((faq, faqIndex) => {
            const key = `${categoryIndex}-${faqIndex}`;
            const isExpanded = !!expandedIds[key];

            return (
              <View key={key} style={styles.faqItem}>
                {/* Question box with toggle */}
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => toggleExpand(categoryIndex, faqIndex)}
                  style={styles.questionBox}
                >
                  <Text style={styles.questionText}>{faq.question}</Text>
                  <Text style={styles.toggleIcon}>{isExpanded ? '-' : '+'}</Text>
                </TouchableOpacity>

                {/* Conditionally render the answer if expanded */}
                {isExpanded && (
                  <Animated.View style={styles.answerBox}>
                    <Text style={styles.answerText}>{faq.answer}</Text>
                  </Animated.View>
                )}
              </View>
            );
          })}
        </View>
      ))}

      {/* Contact Support Button */}
      <TouchableOpacity
        style={styles.contactButton}
        onPress={() => alert('Contact support clicked!')}
      >
        <Text style={styles.contactButtonText}>Contact Support</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// Styling definitions for layout and elements
const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#ffffff',
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#000000',
    textAlign: 'center',
  },
  searchInput: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    fontSize: 12,
    marginBottom: 20,
    color: '#2e7d32',
    borderWidth: 1,
    borderLeftWidth: 3,
    borderRightWidth: 3,
    borderColor: '#4caf50',
  },
  categoryContainer: {
    marginBottom: 24,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
    color: '#000000',
    borderBottomWidth: 2,
    borderBottomColor: '#81c784',
    paddingBottom: 4,
  },
  faqItem: {
    marginBottom: 12,
  },
  questionBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    borderLeftWidth: 4,
    borderRightWidth: 4,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#4caf50',
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  questionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    flex: 1,
    paddingRight: 10,
  },
  toggleIcon: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4caf50',
  },
  answerBox: {
    marginTop: 8,
    padding: 15,
    backgroundColor: '#e8f5e9',
    borderRadius: 12,
    borderLeftWidth: 4,
    borderRightWidth: 4,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#a5d6a7',
  },
  answerText: {
    fontSize: 15,
    color: '#000000',
  },
  contactButton: {
    marginTop: 30,
    backgroundColor: '#4caf50',
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
    shadowColor: '#4caf50',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  contactButtonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
});
