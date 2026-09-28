import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const messages = {
  hinglish: {
    language: "Bhasha", tagline: "Empowering skilled women with nearby work opportunities",
    name: "Name", email: "Email", password: "Password", enterName: "Enter your name",
    chooseRole: "Aap kya karna chahti hain?", needWork: "Mujhe kaam chahiye", hireWork: "Mujhe kaam karwana hai",
    login: "Login", createAccount: "Create Account", pleaseWait: "Please wait...",
    newHere: "New to Saheli Network?", alreadyAccount: "Already have an account?",
    forgotPassword: "Password bhool gayi?", resetPassword: "Password Reset Karein",
    resetHelp: "Apna registered email daalein. Hum password badalne ka link bhejenge.",
    sendResetLink: "Reset Link Bhejein", backToLogin: "Login par wapas jaayein",
    resetSent: "Agar is email ka account hai, password reset link bhej diya gaya hai. Inbox aur spam folder check karein.",
    enterResetEmail: "Pehle apna registered email daalein.", emailInUse: "Yeh email pehle se registered hai.",
    wrongLogin: "Email ya password sahi nahi hai.", weakPassword: "Password kam se kam 6 characters ka hona chahiye.",
    invalidEmail: "Sahi email address daalein.", genericError: "Kuch galat hua. Dobara try karein.",
    profile: "My Profile", dashboard: "Dashboard", opportunities: "Opportunities", orders: "Orders",
    earnings: "Earnings", advice: "Saheli ki Salah", welcome: "Welcome", member: "Trusted Saheli · Active Member",
    myOrders: "Mere Orders", completed: "Completed", pending: "Pending", recovery: "Recovery Support",
    recoveryActive: "Recovery Support Active", verified: "VERIFIED PARTNER", morning: "Good Morning",
    afternoon: "Good Afternoon", evening: "Good Evening", newOpportunities: "You have {count} New Opportunities Today",
    todayEarnings: "Today's Earnings", thisWeek: "This Week", communityLove: "Community Love",
    jobsCompleted: "{count} Jobs Completed", hireSaheli: "Switch to Hire a Saheli", findWork: "Switch to Kaam Chahiye",
    todaysWork: "Aaj ke Kaam", viewAll: "View All", noWork: "Abhi koi naya kaam nahi hai.", getReady: "Get Ready",
    findNearby: "Find and hire skilled Sahelis near you.", hireAction: "+ Hire a Saheli", jobsPosted: "{count} Jobs Posted",
    applicationsCount: "{count} Applications", paymentDue: "Payment Due", activeOrders: "Active Orders",
    hireCardText: "Mehndi, tailoring, cooking aur other services ke liye nearby Saheli find karein.",
    applicationsReceived: "{count} Applications Received", postJob: "Post a Job",
    workOpportunities: "Kaam ke Mauke", availableWork: "Aaj {count} kaam available hain", within5: "Within 5 km",
    noCategoryWork: "Abhi is category mein koi posted kaam available nahi hai.", apply: "Apply Karo", applied: "Applied",
    applyTitle: "Kaam ke liye Apply Karein", service: "Service", distance: "Distance", payment: "Payment",
    time: "Time", availability: "Availability", cancel: "Cancel", applyNow: "Apply Now", urgent: "Jaldi",
    ordersTitle: "Mere Orders", ordersSubtitle: "Aapke sab kaam yahan hain", all: "Sab", ongoing: "Chal Raha",
    done: "Ho Gaya", noOrders: "Abhi is section mein koi order nahi hai.", earningsTitle: "Meri Kamai",
    earningsSubtitle: "Is saal ka pura hisaab", thisMonth: "Is Mahine", today: "Aaj", thisYear: "Is Saal",
    monthlyGoal: "Monthly Goal", recentWork: "Haal ke Kaam", noPayments: "Abhi koi confirmed payment nahi hai.",
    postWork: "Kaam Post Karein", postWorkHelp: "Job details add karein aur applicants mein se Saheli select karein",
    myPostedJobs: "Mere Posted Jobs", waitingApplications: "Applications ka intezaar hai.", selectWorker: "Select Worker",
    profileEdit: "Profile Edit Karo", myInfo: "Meri Jaankari", phone: "Phone Number", preferredLanguage: "Pasand ki Bhasha",
    location: "Gaon / Jagah", mySkills: "Meri Skills", add: "Add", workPreference: "Kaam ki Pasand",
    aboutMe: "Mere Baare Mein", ratingsReviews: "Ratings aur Reviews", portfolio: "Mera Kaam (Photos)", settings: "Settings",
    jobName: "Kaam ka naam", skill: "Skill", amount: "Payment (₹)", visibleArea: "Gaon / Area (workers ko dikhega)",
    fullAddress: "Full address (sirf selected worker)", contactPhone: "Phone (sirf selected worker)", date: "Date",
    workDetails: "Work details", urgentQuestion: "Urgent?", yes: "Yes", no: "No", cancelJob: "Cancel Job",
    adviceSubtitle: "Aapki apni advisor", namaste: "Namaste", saheliIntro: "Main hoon aapki Saheli", askAnything: "Kuch bhi poochho...",
  },
  hi: {
    language: "भाषा", tagline: "कुशल महिलाओं को आस-पास काम के अवसर दिलाना",
    name: "नाम", email: "ईमेल", password: "पासवर्ड", enterName: "अपना नाम लिखें",
    chooseRole: "आप क्या करना चाहती हैं?", needWork: "मुझे काम चाहिए", hireWork: "मुझे काम करवाना है",
    login: "लॉग इन", createAccount: "खाता बनाएँ", pleaseWait: "कृपया प्रतीक्षा करें...",
    newHere: "सहेली नेटवर्क पर नई हैं?", alreadyAccount: "पहले से खाता है?",
    forgotPassword: "पासवर्ड भूल गईं?", resetPassword: "पासवर्ड बदलें",
    resetHelp: "अपना पंजीकृत ईमेल लिखें। हम पासवर्ड बदलने का लिंक भेजेंगे।",
    sendResetLink: "रीसेट लिंक भेजें", backToLogin: "लॉग इन पर वापस जाएँ",
    resetSent: "अगर इस ईमेल से खाता बना है, तो पासवर्ड बदलने का लिंक भेज दिया गया है। इनबॉक्स और स्पैम फ़ोल्डर देखें।",
    enterResetEmail: "पहले अपना पंजीकृत ईमेल लिखें।", emailInUse: "यह ईमेल पहले से पंजीकृत है।",
    wrongLogin: "ईमेल या पासवर्ड सही नहीं है।", weakPassword: "पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।",
    invalidEmail: "सही ईमेल पता लिखें।", genericError: "कुछ गलत हुआ। दोबारा कोशिश करें।",
    profile: "मेरी प्रोफ़ाइल", dashboard: "मुख्य पृष्ठ", opportunities: "काम के अवसर", orders: "मेरे काम",
    earnings: "मेरी कमाई", advice: "सहेली की सलाह", welcome: "स्वागत है", member: "विश्वसनीय सहेली · सक्रिय सदस्य",
    myOrders: "मेरे काम", completed: "पूरे हुए", pending: "बाकी", recovery: "सहायता सेवा",
    recoveryActive: "सहायता सेवा चालू है", verified: "सत्यापित सहेली", morning: "सुप्रभात",
    afternoon: "नमस्ते", evening: "शुभ संध्या", newOpportunities: "आज आपके लिए {count} नए काम हैं",
    todayEarnings: "आज की कमाई", thisWeek: "इस हफ्ते", communityLove: "समुदाय का भरोसा",
    jobsCompleted: "{count} काम पूरे किए", hireSaheli: "काम के लिए सहेली चुनें", findWork: "काम ढूँढने वाला पृष्ठ खोलें",
    todaysWork: "आज के काम", viewAll: "सभी देखें", noWork: "अभी कोई नया काम नहीं है।", getReady: "तैयार हों",
    findNearby: "अपने आस-पास की कुशल सहेली चुनें।", hireAction: "+ सहेली चुनें", jobsPosted: "{count} काम पोस्ट किए",
    applicationsCount: "{count} आवेदन", paymentDue: "बाकी भुगतान", activeOrders: "चल रहे काम",
    hireCardText: "मेहंदी, सिलाई, खाना बनाने और दूसरी सेवाओं के लिए पास की सहेली चुनें।",
    applicationsReceived: "{count} आवेदन मिले", postJob: "काम पोस्ट करें",
    workOpportunities: "काम के अवसर", availableWork: "आज {count} काम उपलब्ध हैं", within5: "5 किमी के अंदर",
    noCategoryWork: "इस श्रेणी में अभी कोई काम उपलब्ध नहीं है।", apply: "आवेदन करें", applied: "आवेदन किया",
    applyTitle: "काम के लिए आवेदन करें", service: "सेवा", distance: "दूरी", payment: "भुगतान",
    time: "समय", availability: "उपलब्धता", cancel: "रद्द करें", applyNow: "अभी आवेदन करें", urgent: "ज़रूरी",
    ordersTitle: "मेरे काम", ordersSubtitle: "आपके सभी काम यहाँ हैं", all: "सभी", ongoing: "चल रहा है",
    done: "पूरा हुआ", noOrders: "इस भाग में अभी कोई काम नहीं है।", earningsTitle: "मेरी कमाई",
    earningsSubtitle: "इस साल का पूरा हिसाब", thisMonth: "इस महीने", today: "आज", thisYear: "इस साल",
    monthlyGoal: "मासिक लक्ष्य", recentWork: "हाल के काम", noPayments: "अभी कोई भुगतान पक्का नहीं हुआ है।",
    postWork: "काम पोस्ट करें", postWorkHelp: "काम की जानकारी जोड़ें और आवेदकों में से सहेली चुनें",
    myPostedJobs: "मेरे पोस्ट किए काम", waitingApplications: "आवेदनों की प्रतीक्षा है।", selectWorker: "सहेली चुनें",
    profileEdit: "प्रोफ़ाइल बदलें", myInfo: "मेरी जानकारी", phone: "फ़ोन नंबर", preferredLanguage: "पसंद की भाषा",
    location: "गाँव / स्थान", mySkills: "मेरे कौशल", add: "जोड़ें", workPreference: "काम की पसंद",
    aboutMe: "मेरे बारे में", ratingsReviews: "रेटिंग और समीक्षाएँ", portfolio: "मेरे काम की तस्वीरें", settings: "सेटिंग्स",
    jobName: "काम का नाम", skill: "कौशल", amount: "भुगतान (₹)", visibleArea: "गाँव / क्षेत्र (काम करने वाली को दिखेगा)",
    fullAddress: "पूरा पता (केवल चुनी हुई सहेली को)", contactPhone: "फ़ोन (केवल चुनी हुई सहेली को)", date: "तारीख",
    workDetails: "काम की जानकारी", urgentQuestion: "क्या काम ज़रूरी है?", yes: "हाँ", no: "नहीं", cancelJob: "काम रद्द करें",
    adviceSubtitle: "आपकी अपनी सलाहकार", namaste: "नमस्ते", saheliIntro: "मैं हूँ आपकी सहेली", askAnything: "कुछ भी पूछें...",
  },
  en: {
    language: "Language", tagline: "Empowering skilled women with nearby work opportunities",
    name: "Name", email: "Email", password: "Password", enterName: "Enter your name",
    chooseRole: "How would you like to use Saheli?", needWork: "I want to find work", hireWork: "I want to hire a Saheli",
    login: "Log in", createAccount: "Create account", pleaseWait: "Please wait...",
    newHere: "New to Saheli Network?", alreadyAccount: "Already have an account?",
    forgotPassword: "Forgot password?", resetPassword: "Reset your password",
    resetHelp: "Enter your registered email and we will send you a link to create a new password.",
    sendResetLink: "Send reset link", backToLogin: "Back to login",
    resetSent: "If an account exists for this email, a password-reset link has been sent. Check your inbox and spam folder.",
    enterResetEmail: "Enter your registered email first.", emailInUse: "This email is already registered.",
    wrongLogin: "The email or password is incorrect.", weakPassword: "The password must contain at least 6 characters.",
    invalidEmail: "Enter a valid email address.", genericError: "Something went wrong. Please try again.",
    profile: "My Profile", dashboard: "Dashboard", opportunities: "Opportunities", orders: "Orders",
    earnings: "Earnings", advice: "Saheli Advice", welcome: "Welcome", member: "Trusted Saheli · Active Member",
    myOrders: "My Orders", completed: "Completed", pending: "Pending", recovery: "Recovery Support",
    recoveryActive: "Recovery Support Active", verified: "VERIFIED PARTNER", morning: "Good Morning",
    afternoon: "Good Afternoon", evening: "Good Evening", newOpportunities: "You have {count} new opportunities today",
    todayEarnings: "Today's Earnings", thisWeek: "This Week", communityLove: "Community Love",
    jobsCompleted: "{count} Jobs Completed", hireSaheli: "Switch to Hire a Saheli", findWork: "Switch to Find Work",
    todaysWork: "Today's Work", viewAll: "View All", noWork: "No new work is available yet.", getReady: "Get Ready",
    findNearby: "Find and hire skilled Sahelis near you.", hireAction: "+ Hire a Saheli", jobsPosted: "{count} Jobs Posted",
    applicationsCount: "{count} Applications", paymentDue: "Payment Due", activeOrders: "Active Orders",
    hireCardText: "Find a nearby Saheli for mehndi, tailoring, cooking and other services.",
    applicationsReceived: "{count} Applications Received", postJob: "Post a Job",
    workOpportunities: "Work Opportunities", availableWork: "{count} jobs available today", within5: "Within 5 km",
    noCategoryWork: "No posted work is available in this category yet.", apply: "Apply", applied: "Applied",
    applyTitle: "Apply for Work", service: "Service", distance: "Distance", payment: "Payment",
    time: "Time", availability: "Availability", cancel: "Cancel", applyNow: "Apply Now", urgent: "Urgent",
    ordersTitle: "My Orders", ordersSubtitle: "All your work is available here", all: "All", ongoing: "Ongoing",
    done: "Completed", noOrders: "There are no orders in this section.", earningsTitle: "My Earnings",
    earningsSubtitle: "Your complete yearly record", thisMonth: "This Month", today: "Today", thisYear: "This Year",
    monthlyGoal: "Monthly Goal", recentWork: "Recent Work", noPayments: "There are no confirmed payments yet.",
    postWork: "Post Work", postWorkHelp: "Add job details and select a Saheli from the applicants",
    myPostedJobs: "My Posted Jobs", waitingApplications: "Waiting for applications.", selectWorker: "Select Worker",
    profileEdit: "Edit Profile", myInfo: "My Information", phone: "Phone Number", preferredLanguage: "Preferred Language",
    location: "Village / Location", mySkills: "My Skills", add: "Add", workPreference: "Work Preferences",
    aboutMe: "About Me", ratingsReviews: "Ratings and Reviews", portfolio: "My Work (Photos)", settings: "Settings",
    jobName: "Job title", skill: "Skill", amount: "Payment (₹)", visibleArea: "Village / Area (visible to workers)",
    fullAddress: "Full address (selected worker only)", contactPhone: "Phone (selected worker only)", date: "Date",
    workDetails: "Work details", urgentQuestion: "Urgent?", yes: "Yes", no: "No", cancelJob: "Cancel Job",
    adviceSubtitle: "Your personal advisor", namaste: "Hello", saheliIntro: "I am your Saheli", askAnything: "Ask anything...",
  },
};

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => localStorage.getItem("saheli-language") || "hinglish");
  useEffect(() => {
    document.documentElement.lang = language === "hi" ? "hi" : "en";
  }, [language]);
  const setLanguage = (value) => {
    const next = messages[value] ? value : "hinglish";
    localStorage.setItem("saheli-language", next);
    setLanguageState(next);
  };
  const value = useMemo(() => ({
    language,
    setLanguage,
    t(key, values = {}) {
      let text = messages[language]?.[key] || messages.hinglish[key] || key;
      Object.entries(values).forEach(([name, replacement]) => { text = text.replace(`{${name}}`, replacement); });
      return text;
    },
  }), [language]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  return useContext(LanguageContext);
}
