import { createContext, useState, useEffect, useContext } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

const TRANSLATIONS = {
  en: {
    // Navigation & Common
    back: "Back",
    save: "Save",
    edit: "Edit",
    logout: "Log Out",
    identifySkinType: "Identify Skin Type 🔍",
    skinTypeLabel: "Skin Type",

    // Onboarding
    onboardingTitle: "Let's get to know your skin",
    knowsSkinTypeQ: "Do you already know your skin type?",
    yesKnow: "Yes, I know it",
    noHelp: "No, help me figure it out",
    whatIsSkinType: "What is your skin type?",
    anyIssues: "Any specific skin issues?",
    selectAllApply: "Select all that apply",
    completeProfile: "Complete Profile",

    // Onboarding expanded questionnaire
    q1: "How does your skin feel in the middle of the day?",
    q1_a1: "Tight, dry, or rough",
    q1_a2: "Shiny and oily all over",
    q1_a3: "Oily on forehead/nose, dry on cheeks",
    q1_a4: "Comfortable, not too dry or oily",
    q1_a5: "Red, itchy, or easily irritated",

    q2: "How does your skin feel 30 minutes after washing it?",
    q2_a1: "Tight, dry, or pulling",
    q2_a2: "Clean, but gets shiny/greasy quickly",
    q2_a3: "Shiny on forehead/nose, tight on cheeks",
    q2_a4: "Smooth, comfortable, and balanced",
    q2_a5: "Red, dry, or slightly stinging",

    q3: "How visible are the pores (tiny dots) on your face?",
    q3_a1: "Barely visible, very small",
    q3_a2: "Large and visible all over my face",
    q3_a3: "Visible mostly on my nose, forehead, and chin",
    q3_a4: "Medium-sized, not very noticeable",
    q3_a5: "Small, but my skin gets red easily",

    q4: "How often do you get dry patches or peeling skin?",
    q4_a1: "Very often, my skin feels rough",
    q4_a2: "Rarely or never, my skin is mostly oily",
    q4_a3: "Only on my cheeks or around my mouth",
    q4_a4: "Almost never, my skin is smooth",
    q4_a5: "Sometimes, especially when the weather changes",

    q5: "How does your skin react to new products or sunlight?",
    q5_a1: "Feels tight or gets extra dry",
    q5_a2: "Doesn't react much, just stays oily",
    q5_a3: "Only reacts in some areas",
    q5_a4: "Rarely gets irritated or red",
    q5_a5: "Gets red, itchy, or warm very easily",

    // Dashboard
    greetingMorning: "Good Morning,",
    greetingAfternoon: "Good Afternoon,",
    greetingEvening: "Good Evening,",
    highUvAlert: "High UV Alert",
    optimalConditions: "Optimal Conditions",
    uvWarning: "Don't forget sunscreen! Apply SPF 50+.",
    uvSafe: "Safe environment right now. Complete your routine!",
    uvIndex: "UV Index",
    temperature: "Temp",
    hydrationTitle: "Moisture Hydration Gauge",
    target: "Target",
    fullyHydrated: "🎉 Fully Hydrated",
    cupsLogged: "Cups Logged",
    plusWater: "+1 Cup Water",
    minusWater: "-1 Cup Water",
    wellnessSuite: "AI Skincare & Wellness Suite",
    activeScanner: "Active Scanner",
    circadianClock: "Circadian Clock",
    skinYoga: "Skin Yoga",
    checkProductSynergy: "Check Product Synergy",
    bioTimeOptimizations: "Bio-Time Optimizations",
    facialAcupressureMap: "Facial Acupressure Map",
    morningRoutine: "Morning Routine",
    nightRoutine: "Night Routine",
    dietInsights: "Diet Insights",
    recommendation: "Recommendation",
    suggestedForYou: "Suggested For You",
    basedOnSkin: "Based on skin",
    aiSkinStyling: "AI Skin Health & Styling",
    seasonalColorPalette: "Seasonal Color Palette",
    bestStylingColors: "Your Best Styling Colors",
    unlockStylingPrompt: "Unlock your AI Skin Health & Styling Analysis! Click here to scan your skin and discover your personal color palette.",
    undertone: "Undertone",

    // Recommendations Portal
    recTitle: "Dermatologist Recommendations Guide",
    recSubtitle: "Clinically approved skincare routines, safety tips, and product guides matching your skin.",
    trustSealTitle: "Clinically Trusted & Formulated",
    trustSealApproved: "Dermatologist Tested",
    trustSealCruelty: "Cruelty-Free Certified",
    trustSealSecure: "HIPAA Secure Data & Privacy",
    trustSealClean: "Clean & Safe Formulas",
    dermatologistQuote: "Clinical Endorsement",
    safetyRules: "Skincare Routine Safety Rules",
    safetyRule1: "Always apply sunscreen (SPF 50+) as the final step in your morning routine. Actives like Retinol and AHA make your skin more sensitive to the sun.",
    safetyRule2: "Never mix Retinol and Vitamin C directly in the same routine layer. Use Vitamin C in the morning and Retinol at night to avoid irritation.",
    safetyRule3: "Introduce exfoliating acids (AHA/BHA) slowly, starting with 2-3 times a week, to prevent stripping your skin's protective shield.",
    whyWorks: "Why This Routine Works",
    viewRecGuide: "👨‍⚕️ Clinically Approved Routines & Products: View customized skincare directions and safety advice.",
    routineDirections: "Application Directions",

    // Circadian Clock
    circadianTitle: "Circadian Clock",
    circadianSubtitle: "Align your skincare application to your skin's biological rhythm",
    biologicalHour: "Local Biological Hour",
    skinPhase: "Chronobiological Skin Phase",
    activeNow: "ACTIVE NOW",
    skinBiology: "Skin Biology",
    biologicalState: "Biological State",
    recommendationTitle: "Circadian Recommendation",

    phase_morning_title: "Morning (06:00 - 10:00)",
    phase_morning_sub: "Skin Waking Up",
    phase_morning_bio: "Your skin is driest when you wake up. It is getting ready to protect itself from dirt, sun, and pollution.",
    phase_morning_action: "Wash gently and use a moisturizer. Apply Vitamin C and sunscreen to keep your skin safe from the sun.",

    phase_midday_title: "Midday (10:00 - 16:00)",
    phase_midday_sub: "Oil Peak Time",
    phase_midday_bio: "Your skin makes the most oil during the middle of the day, making it shiny. The sun is strongest now and can damage your skin.",
    phase_midday_action: "Wipe away oil with a soft tissue. Put on more sunscreen every 2 hours to stay safe.",

    phase_afternoon_title: "Afternoon (16:00 - 18:00)",
    phase_afternoon_sub: "Weak Shield Time",
    phase_afternoon_bio: "Your skin's natural shield gets a bit weak around this time. This makes your skin lose water, look tired, and feel dry.",
    phase_afternoon_action: "Spray a little water mist or put on a light moisturizer to refresh your tired skin.",

    phase_night_title: "Evening (18:00 - 23:00)",
    phase_night_sub: "Skin Cleaning & Healing",
    phase_night_bio: "Your skin stops protecting itself and starts cleaning out dirt, healing damage, and shedding old skin.",
    phase_night_action: "Wash your face twice to clean off all the day's dirt. Use gentle skin-clearing serums or masks.",

    phase_latenight_title: "Late Night (23:00 - 06:00)",
    phase_latenight_sub: "Night Healing Time",
    phase_latenight_bio: "Your skin heals and grows new cells three times faster while you sleep. Overnight creams soak in much deeper now.",
    phase_latenight_action: "Apply your night creams, serums, or masks before sleeping to help your skin heal.",

    // Skin Yoga
    yogaTitle: "Skin Yoga",
    yogaSubtitle: "Holistic acupressure mapping and facial massage timers",
    acupressurePoint: "Acupressure Point",
    benefits: "Benefits",
    technique: "Technique",
    close: "Close",
    massagePaceAssist: "Massage Pace Assist",
    readyMessage: "Ready. Click start and massage this node.",
    activeMessage: "Match your circles to the expanding visual wave...",
    completedMessage: "Ritual complete! Feel the revitalized energy flow.",
    startMassageTimer: "Start Massage Timer",
    stopTimer: "Stop Timer",
    restartRitual: "Restart Ritual",

    point_thirdeye_name: "Yintang (Third Eye)",
    point_thirdeye_benefits: "Calms your mind, reduces forehead wrinkles, and helps blood flow to your forehead.",
    point_thirdeye_action: "Use one finger to press gently between your eyebrows and sweep upwards slowly.",

    point_temple_name: "Taiyang (Temples)",
    point_temple_benefits: "Helps with eye tiredness, reduces puffy eyes, and clears out skin fluids.",
    point_temple_action: "Use two fingers to rub your temples in gentle circles going outwards.",

    point_cheek_name: "Sibai (Under the Eye)",
    point_cheek_benefits: "Reduces dark circles under your eyes, makes your cheeks glow, and relaxes your face.",
    point_cheek_action: "Use your ring fingers to press very gently up and down under your eyes.",

    point_jaw_name: "Jiache (Jawline Corner)",
    point_jaw_benefits: "Relaxes tight jaw muscles and helps slim and firm the jaw area.",
    point_jaw_action: "Press and rub in circular circles going upwards along your jaw corner.",

    point_chin_name: "Chengjiang (Center of Chin)",
    point_chin_benefits: "Relaxes your mouth muscles and helps clear out waste from your chin area.",
    point_chin_action: "Press your thumb gently under your lip and sweep upwards.",

    // Ingredient Scanner
    scannerTitle: "Active Scanner",
    scannerSubtitle: "Decode active ingredient synergy and safety compatibility",
    ingredientA: "First Ingredient (A)",
    ingredientB: "Second Ingredient (B)",
    selectActive: "Select active ingredient...",
    synergyRating: "Synergy Rating",
    selectToScan: "Select Ingredients to Scan",
    selectToScanDesc: "Select two active skincare ingredients from the dropdowns above to check their chemical synergy rating and clash analysis instantly.",
    editScannerDb: "Edit Scanner Database ⚙️",
    customDbTitle: "Custom Ingredients",
    addCustomIng: "Add Custom Ingredient",
    nameLabel: "Ingredient Name",
    descLabel: "Description / Effects",
    saveIng: "Save Ingredient",
    delete: "Delete",
    customIngList: "Your Custom Ingredients"
  },
  hi: {
    // Navigation & Common
    back: "पीछे",
    save: "सुरक्षित करें",
    edit: "बदलाव करें",
    logout: "लॉग आउट",
    identifySkinType: "अपनी त्वचा पहचानें 🔍",
    skinTypeLabel: "त्वचा का प्रकार",

    // Onboarding
    onboardingTitle: "आइए आपकी त्वचा को जानें",
    knowsSkinTypeQ: "क्या आप अपनी त्वचा का प्रकार जानते हैं?",
    yesKnow: "हां, मुझे पता है",
    noHelp: "नहीं, पता लगाने में मदद करें",
    whatIsSkinType: "आपकी त्वचा का प्रकार क्या है?",
    anyIssues: "त्वचा की कोई समस्या?",
    selectAllApply: "सभी लागू विकल्प चुनें",
    completeProfile: "प्रोफाइल पूरी करें",

    // Onboarding expanded questionnaire
    q1: "दोपहर में आपकी त्वचा कैसी महसूस होती है?",
    q1_a1: "खिंची हुई, सूखी या खुरदरी",
    q1_a2: "हर जगह चमकदार और तैलीय",
    q1_a3: "माथे/नाक पर तैलीय, गालों पर सूखी",
    q1_a4: "आरामदायक, न ज्यादा सूखी न तैलीय",
    q1_a5: "लाल, खुजलीदार या जलन वाली",

    q2: "चेहरा धोने के 30 मिनट बाद आपकी त्वचा कैसी महसूस होती है?",
    q2_a1: "बहुत खिंची हुई या सूखी",
    q2_a2: "साफ, लेकिन जल्दी ही तैलीय हो जाती है",
    q2_a3: "माथे/नाक पर तैलीय, गालों पर खिंची हुई",
    q2_a4: "चिकनी, आरामदायक और संतुलित",
    q2_a5: "लाल, सूखी या हल्की जलन महसूस होना",

    q3: "आपके चेहरे पर छोटे छेद (पोर्स) कितने दिखाई देते हैं?",
    q3_a1: "मुश्किल से दिखने वाले, बहुत छोटे",
    q3_a2: "पूरे चेहरे पर बड़े और साफ दिखने वाले",
    q3_a3: "ज्यादातर नाक, माथे और ठुड्डी पर दिखते हैं",
    q3_a4: "मध्यम आकार के, ज्यादा नहीं दिखते",
    q3_a5: "छोटे, लेकिन त्वचा जल्दी लाल हो जाती है",

    q4: "आपको सूखी त्वचा या त्वचा निकलने की समस्या कितनी बार होती है?",
    q4_a1: "बहुत बार, त्वचा खुरदरी लगती है",
    q4_a2: "शायद ही कभी, त्वचा ज्यादातर तैलीय रहती है",
    q4_a3: "केवल मेरे गालों या मुंह के आसपास",
    q4_a4: "लगभग कभी नहीं, त्वचा चिकनी है",
    q4_a5: "कभी-कभी, खासकर जब मौसम बदलता है",

    q5: "नए ब्यूटी प्रोडक्ट्स या धूप पर आपकी त्वचा कैसी प्रतिक्रिया देती है?",
    q5_a1: "खिंची हुई या बहुत सूखी हो जाती है",
    q5_a2: "ज्यादा बदलाव नहीं होता, तैलीय ही रहती है",
    q5_a3: "केवल कुछ जगहों पर असर होता है",
    q5_a4: "शायद ही कभी खुजली या लालिमा होती है",
    q5_a5: "बहुत जल्दी लाल, खुजलीदार या गर्म हो जाती है",

    // Dashboard
    greetingMorning: "शुभ प्रभात (गुड मॉर्निंग),",
    greetingAfternoon: "नमस्कार (गुड आफ्टरनून),",
    greetingEvening: "शुभ संध्या (गुड इवनिंग),",
    highUvAlert: "तेज धूप की चेतावनी",
    optimalConditions: "अनुकूल मौसम",
    uvWarning: "सनस्क्रीन लगाना न भूलें! SPF 50+ लगाएं।",
    uvSafe: "अभी धूप सुरक्षित है। अपनी स्किनकेयर पूरी करें!",
    uvIndex: "धूप का स्तर (UV)",
    temperature: "तापमान",
    hydrationTitle: "पानी पीने का पैमाना",
    target: "लक्ष्य",
    fullyHydrated: "🎉 भरपूर पानी पिया",
    cupsLogged: "कप पानी पिया",
    plusWater: "+1 कप पानी",
    minusWater: "-1 कप पानी",
    wellnessSuite: "स्किनकेयर और स्वास्थ्य केंद्र",
    activeScanner: "उत्पाद स्कैनर",
    circadianClock: "Circadian Clock",
    skinYoga: "फेस योगा",
    checkProductSynergy: "दो क्रीमों का तालमेल जांचें",
    bioTimeOptimizations: "समय के अनुसार त्वचा की देखभाल",
    facialAcupressureMap: "चेहरे की मालिश का नक्शा",
    morningRoutine: "सुबह की स्किनकेयर",
    nightRoutine: "रात की स्किनकेयर",
    dietInsights: "खान-पान की सलाह",
    recommendation: "सलाह",
    suggestedForYou: "आपके लिए खास उत्पाद",
    basedOnSkin: "त्वचा के आधार पर",
    aiSkinStyling: "त्वचा स्वास्थ्य और रंग स्टाइल",
    seasonalColorPalette: "आपके अनुकूल रंग",
    bestStylingColors: "आपके कपड़े/मेकअप के बेहतरीन रंग",
    unlockStylingPrompt: "अपनी त्वचा का विश्लेषण खोलें! कपड़े और मेकअप के सही रंग जानने के लिए यहां क्लिक करें और चेहरा स्कैन करें।",
    undertone: "अंडरटोन",

    // Recommendations Portal
    recTitle: "त्वचा विशेषज्ञ की सलाह",
    recSubtitle: "आपकी त्वचा के अनुसार चिकित्सकीय रूप से स्वीकृत स्किनकेयर रूटीन, सुरक्षा नियम और उत्पाद गाइड।",
    trustSealTitle: "चिकित्सकीय रूप से विश्वसनीय और शुद्ध",
    trustSealApproved: "डॉक्टरों द्वारा परीक्षित",
    trustSealCruelty: "क्रूरता-मुक्त प्रमाणित",
    trustSealSecure: "डेटा सुरक्षा और गोपनीयता",
    trustSealClean: "गैर-विषैले और सुरक्षित फार्मूले",
    dermatologistQuote: "डॉक्टर का चिकित्सकीय समर्थन",
    safetyRules: "स्किनकेयर रूटीन के जरूरी नियम",
    safetyRule1: "सुबह की स्किनकेयर के आखिरी कदम में हमेशा सनस्क्रीन (SPF 50+) लगाएं। रेटिनॉल और AHA जैसी चीजें त्वचा को धूप के प्रति संवेदनशील बनाती हैं।",
    safetyRule2: "एक ही समय में रेटिनॉल और विटामिन सी को सीधे न मिलाएं। जलन से बचने के लिए सुबह विटामिन सी और रात में रेटिनॉल का उपयोग करें।",
    safetyRule3: "त्वचा की सुरक्षात्मक परत को बचाने के लिए एक्सफ़ोलीएटिंग एसिड (AHA/BHA) को धीरे-धीरे सप्ताह में 2-3 बार ही लगाना शुरू करें।",
    whyWorks: "यह रूटीन क्यों काम करता है",
    viewRecGuide: "👨‍⚕️ डॉक्टर द्वारा स्वीकृत रूटीन और उत्पाद: अपनी त्वचा के अनुसार सही उत्पाद निर्देश और सुरक्षा सलाह देखें।",
    routineDirections: "उपयोग करने का सही तरीका",

    // Circadian Clock
    circadianTitle: "स्किन घड़ी",
    circadianSubtitle: "त्वचा के प्राकृतिक चक्र के अनुसार क्रीम और सीरम लगाएं",
    biologicalHour: "स्थानीय जैविक समय",
    skinPhase: "त्वचा का वर्तमान चरण",
    activeNow: "अभी सक्रिय",
    skinBiology: "त्वचा का विज्ञान",
    biologicalState: "त्वचा की स्थिति",
    recommendationTitle: "इस समय की सलाह",

    phase_morning_title: "सुबह (06:00 - 10:00)",
    phase_morning_sub: "त्वचा का जागना",
    phase_morning_bio: "सुबह उठने पर त्वचा सबसे ज्यादा सूखी होती है। यह धूल, धूप और प्रदूषण से खुद को बचाने के लिए तैयार हो रही होती है।",
    phase_morning_action: "हल्के फेसवॉश से धोएं और मॉइस्चराइज़र लगाएं। धूप से बचाने के लिए विटामिन C और सनस्क्रीन लगाएं।",

    phase_midday_title: "दोपहर (10:00 - 16:00)",
    phase_midday_sub: "अधिक तेल बनने का समय",
    phase_midday_bio: "दोपहर में त्वचा सबसे ज्यादा तेल बनाती है, जिससे चेहरा चिपचिपा लगता है। इस समय धूप सबसे तेज होती है जो नुकसान पहुंचा सकती है।",
    phase_midday_action: "मुलायम टिशू से तेल साफ करें। सुरक्षित रहने के लिए हर 2 घंटे में सनस्क्रीन दोबारा लगाएं।",

    phase_afternoon_title: "तीसरा पहर (16:00 - 18:00)",
    phase_afternoon_sub: "कमजोर ढाल का समय",
    phase_afternoon_bio: "इस समय आपकी त्वचा की प्राकृतिक सुरक्षा थोड़ी कमजोर हो जाती है। त्वचा में पानी कम हो जाता है, वह थकी और सूखी लगती है।",
    phase_afternoon_action: "अपनी थकी त्वचा को तरोताजा करने के लिए चेहरे पर पानी का स्प्रे करें या हल्का मॉइस्चराइज़र लगाएं।",

    phase_night_title: "शाम (18:00 - 23:00)",
    phase_night_sub: "सफाई और मरम्मत",
    phase_night_bio: "त्वचा खुद को बचाना बंद कर देती है और धूल-मिट्टी साफ करने, नुकसान की भरपाई करने और पुरानी त्वचा हटाने का काम शुरू करती है।",
    phase_night_action: "दिनभर की धूल साफ करने के लिए चेहरा दो बार धोएं। त्वचा साफ करने वाली क्रीम या मास्क लगाएं।",

    phase_latenight_title: "देर रात (23:00 - 06:00)",
    phase_latenight_sub: "रात की गहरी मरम्मत",
    phase_latenight_bio: "जब आप सोते हैं, तो त्वचा 3 गुना तेजी से ठीक होती है और नई कोशिकाएं बनाती है। रात की क्रीम इस समय सबसे गहराई तक काम करती हैं।",
    phase_latenight_action: "सोने से पहले अपनी रात की क्रीम या सीरम जरूर लगाएं ताकि त्वचा ठीक हो सके।",

    // Skin Yoga
    yogaTitle: "फेस योగా",
    yogaSubtitle: "चेहरे की मालिश और एक्यूप्रेशर पॉइंट टाइमर",
    acupressurePoint: "दबाव बिंदु (एक्यूप्रेशर)",
    benefits: "फायदे",
    technique: "तरीका",
    close: "बंद करें",
    massagePaceAssist: "मालिश की गति",
    readyMessage: "तैयार। शुरू बटन दबाएं और मालिश करें।",
    activeMessage: "गोल चक्रों की गति के साथ अपनी उंगलियों को घुमाएं...",
    completedMessage: "योगा पूरा हुआ! चेहरे पर नई चमक महसूस करें।",
    startMassageTimer: "योगा टाइमर शुरू करें",
    stopTimer: "टाइमर रोकें",
    restartRitual: "दोबारा शुरू करें",

    point_thirdeye_name: "यिनतांग (तीसरी आंख - माथा)",
    point_thirdeye_benefits: "मन शांत करता है, माथे की झुर्रियां कम करता है और माथे में खून का बहाव बढ़ाता है।",
    point_thirdeye_action: "भोहों के बीच अपनी उंगली रखें, धीरे से दबाएं और ऊपर की ओर ले जाएं।",

    point_temple_name: "ताइयांग (कनपटी - साइड)",
    point_temple_benefits: "आंकों की थकान दूर करता है, सूजी आंखों को ठीक करता है और चेहरे का पानी साफ करता है।",
    point_temple_action: "दो उंगलियों से कनपटी को बाहर की तरफ गोल घुमाते हुए धीरे से रगड़ें।",

    point_cheek_name: "सिबाई (आंख के ठीक नीचे)",
    point_cheek_benefits: "आंखों के काले घेरे कम करता है, गालों पर चमक लाता है और चेहरे की थकान मिटाता है।",
    point_cheek_action: "अपनी अनामिका (तीसरी) उंगली से आंखों के नीचे बहुत धीरे-धीरे ऊपर-नीचे दबाएं।",

    point_jaw_name: "जियाचे (जबड़े का कोना)",
    point_jaw_benefits: "जबड़े की जकड़न दूर करता है और जबड़े को सुंदर और सुडौल आकार देता है।",
    point_jaw_action: "जबड़े के कोने पर उंगलियों से ऊपर की ओर गोल चक्रों में दबाते हुए रगड़ें।",

    point_chin_name: "चेंगजियांग (ठुड्डी का केंद्र)",
    point_chin_benefits: "मुंह के आसपास की मांसपेशियों को ढीला करता है और चेहरे की गंदगी साफ करता है।",
    point_chin_action: "अपने अंगूठे को निचले होंठ के नीचे रखें और धीरे से ऊपर की ओर दबाते हुए ले जाएं।",

    // Ingredient Scanner
    scannerTitle: "उत्पाद स्कैनर",
    scannerSubtitle: "क्रीम की सामग्री का मेल और सुरक्षा जांचें",
    ingredientA: "पहली सामग्री (A)",
    ingredientB: "दूसरी सामग्री (B)",
    selectActive: "केमिकल चुनें...",
    synergyRating: "मेल रेटिंग",
    selectToScan: "सामग्री चुनें",
    selectToScanDesc: "दो स्किनकेयर सामग्री चुनें और उनका तालमेल या नुकसान तुरंत जानें।",
    editScannerDb: "स्कैनर में नई सामग्री जोड़ें ⚙️",
    customDbTitle: "अपनी खुद की सामग्री",
    addCustomIng: "नई सामग्री जोड़ें",
    nameLabel: "सामग्री का नाम",
    descLabel: "विवरण / प्रभाव",
    saveIng: "सामग्री सुरक्षित करें",
    delete: "हटाएं",
    customIngList: "आपकी जोड़ी गई सामग्री"
  },
  es: {
    // Navigation & Common
    back: "Atrás",
    save: "Guardar",
    edit: "Editar",
    logout: "Cerrar Sesión",
    identifySkinType: "Identificar Tipo de Piel 🔍",
    skinTypeLabel: "Tipo de Piel",

    // Onboarding
    onboardingTitle: "Conozcamos tu piel",
    knowsSkinTypeQ: "¿Ya conoces tu tipo de piel?",
    yesKnow: "Sí, lo conozco",
    noHelp: "No, ayúdame a descubrirlo",
    whatIsSkinType: "¿Cuál es tu tipo de piel?",
    anyIssues: "¿Algún problema de piel específico?",
    selectAllApply: "Selecciona todos los que apliquen",
    completeProfile: "Completar Perfil",

    // Onboarding expanded questionnaire
    q1: "¿Cómo se siente tu piel a mitad del día?",
    q1_a1: "Tirante, seca o áspera",
    q1_a2: "Brillante y grasosa en toda la cara",
    q1_a3: "Grasosa en frente/nariz, seca en mejillas",
    q1_a4: "Cómoda, ni muy seca ni muy grasosa",
    q1_a5: "Roja, con picazón o irritada",

    q2: "¿Cómo se siente tu piel 30 minutos después de lavarla?",
    q2_a1: "Tirante, muy seca o estirada",
    q2_a2: "Limpia, pero se pone brillante/grasosa rápido",
    q2_a3: "Brillante en frente/nariz, tirante en mejillas",
    q2_a4: "Suave, cómoda y equilibrada",
    q2_a5: "Roja, seca o con un leve ardor",

    q3: "¿Qué tan visibles son los poros (puntos) en tu cara?",
    q3_a1: "Casi invisibles, muy pequeños",
    q3_a2: "Grandes y visibles en toda la cara",
    q3_a3: "Visibles sobre todo en nariz, frente y barbilla",
    q3_a4: "Medianos, no se notan mucho",
    q3_a5: "Pequeños, pero mi piel se enrojece fácil",

    q4: "¿Qué tan seguido tienes zonas secas o piel pelada?",
    q4_a1: "Muy seguido, mi piel se siente áspera",
    q4_a2: "Casi nunca, mi piel es mayormente grasosa",
    q4_a3: "Solo en mis mejillas o alrededor de la boca",
    q4_a4: "Casi nunca, mi piel es suave",
    q4_a5: "A veces, especialmente cuando cambia el clima",

    q5: "¿Cómo reacciona tu piel a productos nuevos o al sol?",
    q5_a1: "Se siente tirante o se seca de más",
    q5_a2: "No reacciona mucho, solo sigue grasosa",
    q5_a3: "Solo reacciona en algunas zonas",
    q5_a4: "Casi nunca se irrita o enrojece",
    q5_a5: "Se pone roja, con picazón o caliente muy fácil",

    // Dashboard
    greetingMorning: "Buenos Días,",
    greetingAfternoon: "Buenas Tardes,",
    greetingEvening: "Buenas Noches,",
    highUvAlert: "Alerta de Sol Fuerte (UV)",
    optimalConditions: "Clima Favorable",
    uvWarning: "¡No olvides el bloqueador! Usa SPF 50+.",
    uvSafe: "El sol es seguro ahora. ¡Haz tu rutina!",
    uvIndex: "Índice UV",
    temperature: "Temp",
    hydrationTitle: "Medidor de Hidratación",
    target: "Meta",
    fullyHydrated: "🎉 Totalmente Hidratado",
    cupsLogged: "Vasos Registrados",
    plusWater: "+1 Vaso Agua",
    minusWater: "-1 Vaso Agua",
    wellnessSuite: "Centro de Cuidado y Bienestar",
    activeScanner: "Escáner de Productos",
    circadianClock: "Reloj de la Piel",
    skinYoga: "Yoga Facial",
    checkProductSynergy: "Ver Compatibilidad de Cremas",
    bioTimeOptimizations: "Cuidado Según la Hora",
    facialAcupressureMap: "Mapa de Masaje Facial",
    morningRoutine: "Rutina de Mañana",
    nightRoutine: "Rutina de Noche",
    dietInsights: "Consejos de Comida",
    recommendation: "Consejo",
    suggestedForYou: "Sugerido Para Ti",
    basedOnSkin: "Para piel tipo",
    aiSkinStyling: "Salud y Estilo de Piel IA",
    seasonalColorPalette: "Tus Colores Ideales",
    bestStylingColors: "Tus mejores colores de ropa y maquillaje",
    unlockStylingPrompt: "¡Mira el análisis de tu piel! Haz clic aquí para escanear tu cara y descubrir tus colores ideales.",
    undertone: "Subtono",

    // Recommendations Portal
    recTitle: "Recomendaciones del Dermatólogo",
    recSubtitle: "Rutinas clínicamente aprobadas, consejos de seguridad y sugerencias para tu tipo de piel.",
    trustSealTitle: "Clínicamente Seguro y Confiable",
    trustSealApproved: "Probado por Dermatólogos",
    trustSealCruelty: "Certificado Libre de Crueldad",
    trustSealSecure: "Datos Privados y Seguros",
    trustSealClean: "Fórmulas Limpias y Seguras",
    dermatologistQuote: "Soporte Clínico Profesional",
    safetyRules: "Reglas de Seguridad para tu Piel",
    safetyRule1: "Ponte bloqueador solar (SPF 50+) como último paso por la mañana. Productos como Retinol y AHA hacen tu piel sensible al sol.",
    safetyRule2: "Nunca mezcles Retinol y Vitamina C juntos al mismo tiempo. Usa Vitamina C en la mañana y Retinol en la noche para no irritarte.",
    safetyRule3: "Usa los exfoliantes ácidos (AHA/BHA) poco a poco, solo 2 o 3 veces por semana para cuidar el escudo de tu piel.",
    whyWorks: "Por Qué Funciona Esta Rutina",
    viewRecGuide: "👨‍⚕️ Rutinas y Productos Clínicamente Aprobados: Mira las instrucciones correctas y consejos de seguridad para ti.",
    routineDirections: "Instrucciones de Uso Correcto",

    // Circadian Clock
    circadianTitle: "Reloj de la Piel",
    circadianSubtitle: "Aplica tus cremas según el reloj natural de tu piel",
    biologicalHour: "Hora Biológica Local",
    skinPhase: "Fase Actual de la Piel",
    activeNow: "ACTIVO AHORA",
    skinBiology: "Biología de la Piel",
    biologicalState: "Estado de la Piel",
    recommendationTitle: "Consejo para esta hora",

    phase_morning_title: "Mañana (06:00 - 10:00)",
    phase_morning_sub: "Piel Despertando",
    phase_morning_bio: "Tu piel está más seca al despertar. Se está preparando para protegerse de la tierra, el sol y el aire sucio.",
    phase_morning_action: "Lava suavemente y usa crema hidratante. Usa Vitamina C y protector solar para cuidarte del sol.",

    phase_midday_title: "Mediodía (10:00 - 16:00)",
    phase_midday_sub: "Hora de Más Grasa",
    phase_midday_bio: "Tu piel produce más grasa a mitad del día, dejándola brillante. El sol es muy fuerte ahora y puede dañarte.",
    phase_midday_action: "Limpia la grasa con un papel suave. Ponte más protector solar cada 2 horas para estar a salvo.",

    phase_afternoon_title: "Tarde (16:00 - 18:00)",
    phase_afternoon_sub: "Escudo Débil",
    phase_afternoon_bio: "El escudo natural de tu piel se debilita un poco a esta hora. Esto hace que pierda agua y se sienta cansada y seca.",
    phase_afternoon_action: "Rocía un poco de agua o ponte una crema ligera para refrescar tu piel cansada.",

    phase_night_title: "Noche (18:00 - 23:00)",
    phase_night_sub: "Limpieza y Reparación",
    phase_night_bio: "Tu piel deja de protegerse y empieza a limpiar la suciedad, curar daños y tirar la piel vieja.",
    phase_night_action: "Lava tu cara dos veces para quitar la suciedad del día. Usa cremas o mascarillas de limpieza.",

    phase_latenight_title: "Madrugada (23:00 - 06:00)",
    phase_latenight_sub: "Reparación Profunda",
    phase_latenight_bio: "Tu piel se cura y hace células nuevas 3 veces más rápido mientras duermes. Las cremas de noche entran más profundo ahora.",
    phase_latenight_action: "Ponte tus cremas o sueros de noche antes de dormir para ayudar a curar tu piel.",

    // Skin Yoga
    yogaTitle: "Yoga Facial",
    yogaSubtitle: "Mapa de masaje y cronómetro de puntos de presión",
    acupressurePoint: "Punto de Presión",
    benefits: "Beneficios",
    technique: "Técnica",
    close: "Cerrar",
    massagePaceAssist: "Ritmo de Masaje",
    readyMessage: "Listo. Haz clic en iniciar y masajea este punto.",
    activeMessage: "Sigue los círculos en pantalla con tus dedos...",
    completedMessage: "¡Yoga completado! Siente tu rostro fresco y brillante.",
    startMassageTimer: "Iniciar Masaje",
    stopTimer: "Detener",
    restartRitual: "Reiniciar Masaje",

    point_thirdeye_name: "Yintang (Tercer Ojo - Frente)",
    point_thirdeye_benefits: "Calma tu mente, reduce arrugas de la frente y ayuda a que la sangre corra por tu frente.",
    point_thirdeye_action: "Usa un dedo para presionar suavemente entre tus cejas y desliza hacia arriba despacio.",

    point_temple_name: "Taiyang (Sienes)",
    point_temple_benefits: "Ayuda con el cansancio de ojos, deshincha los ojos y drena líquidos de la cara.",
    point_temple_action: "Usa dos dedos para dar masajes en círculos hacia afuera en tus sienes.",

    point_cheek_name: "Sibai (Debajo del Ojo)",
    point_cheek_benefits: "Reduce las ojeras, hace brillar tus mejillas y relaja la cara cansada.",
    point_cheek_action: "Usa tus dedos anulares para presionar muy suave hacia arriba y abajo bajo los ojos.",

    point_jaw_name: "Jiache (Esquina de Mandíbula)",
    point_jaw_benefits: "Relaja la mandíbula apretada y ayuda a perfilar y reafirmar la zona.",
    point_jaw_action: "Presiona y da masajes en círculos hacia arriba en la esquina de la mandíbula.",

    point_chin_name: "Chengjiang (Centro de Barbilla)",
    point_chin_benefits: "Relaja los músculos de la boca y ayuda a limpiar impurezas de la barbilla.",
    point_chin_action: "Presiona tu pulgar suave bajo el labio y desliza hacia arriba.",

    // Ingredient Scanner
    scannerTitle: "Escáner de Cremas",
    scannerSubtitle: "Revisa si dos cremas se llevan bien o se dañan juntas",
    ingredientA: "Primer Ingrediente (A)",
    ingredientB: "Segundo Ingrediente (B)",
    selectActive: "Selecciona activo...",
    synergyRating: "Nivel de Compatibilidad",
    selectToScan: "Elige ingredientes",
    selectToScanDesc: "Elige dos ingredientes de cremas arriba para ver si funcionan bien juntos o causan irritación.",
    editScannerDb: "Agregar ingrediente al escáner ⚙️",
    customDbTitle: "Ingredientes Propios",
    addCustomIng: "Agregar ingrediente",
    nameLabel: "Nombre del ingrediente",
    descLabel: "Descripción / Efectos",
    saveIng: "Guardar ingrediente",
    delete: "Eliminar",
    customIngList: "Tus ingredientes agregados"
  },
  te: {
    // Navigation & Common
    back: "వెనుకకు",
    save: "సేవ్ చేయి",
    edit: "మార్చు",
    logout: "లాగ్ అవుట్",
    identifySkinType: "మీ చర్మ రకాన్ని గుర్తించండి 🔍",
    skinTypeLabel: "చర్మ రకం",

    // Onboarding
    onboardingTitle: "మీ చర్మాన్ని గురించి తెలుసుకుందాం",
    knowsSkinTypeQ: "మీకు మీ చర్మ రకం ముందే తెలుసా?",
    yesKnow: "అవును, నాకు తెలుసు",
    noHelp: "తెలియదు, కనుగొనడానికి సహాయం చేయండి",
    whatIsSkinType: "మీ చర్మ రకం ఏమిటి?",
    anyIssues: "ఏదైనా చర్మ సమస్యలు ఉన్నాయా?",
    selectAllApply: "వర్తించేవన్నీ ఎంచుకోండి",
    completeProfile: "ప్రొఫైల్ పూర్తి చేయి",

    // Onboarding expanded questionnaire
    q1: "మధ్యాహ్నం సమయంలో మీ చర్మం ఎలా అనిపిస్తుంది?",
    q1_a1: "బిగుతుగా, పొడిగా లేదా గరుకుగా",
    q1_a2: "ముఖమంతా మెరుస్తూ మరియు జిడ్డుగా",
    q1_a3: "నుదురు/ముక్కు జిడ్డుగా, బుగ్గలు పొడిగా",
    q1_a4: "సౌకర్యవంతంగా, పొడిగా లేదా జిడ్డుగా లేకుండా",
    q1_a5: "ఎర్రగా, దురదగా లేదా త్వరగా మంటగా",

    q2: "ముఖం కడుక్కున్న 30 నిమిషాల తర్వాత మీ చర్మం ఎలా అనిపిస్తుంది?",
    q2_a1: "చాలా పొడిగా లేదా బిగుతుగా లాగుతున్నట్లు",
    q2_a2: "శుభ్రంగా ఉండి, త్వరగానే జిడ్డుగా మారుతుంది",
    q2_a3: "నుదురు/ముక్కు జిడ్డుగా, బుగ్గలు బిగుతుగా",
    q2_a4: "సున్నితంగా, సౌకర్యవంతంగా మరియు సమతుల్యంగా",
    q2_a5: "ఎరుపుగా, పొడిగా లేదా కొద్దిగా మంటగా",

    q3: "మీ ముఖం మీద రంధ్రాలు (పోర్స్) ఎంత స్పష్టంగా కనిపిస్తాయి?",
    q3_a1: "అస్సలు కనిపించవు, చాలా చిన్నవి",
    q3_a2: "ముఖమంతా పెద్దవిగా మరియు స్పష్టంగా కనిపిస్తాయి",
    q3_a3: "ఎక్కువగా ముక్కు, నుదురు, గడ్డం మీద కనిపిస్తాయి",
    q3_a4: "మధ్యస్థంగా ఉండి, అంతగా తెలియవు",
    q3_a5: "చిన్నవి, కానీ చర్మం త్వరగా ఎర్రబడుతుంది",

    q4: "మీకు పొడి చర్మం లేదా చర్మం ఊడిపోవడం ఎంత తరచుగా జరుగుతుంది?",
    q4_a1: "చాలా తరచుగా, చర్మం గరుకుగా అనిపిస్తుంది",
    q4_a2: "చాలా అరుదుగా లేదా అస్సలు జరగదు, చర్మం ఎక్కువగా జిడ్డుగా ఉంటుంది",
    q4_a3: "బుగ్గలు లేదా నోటి చుట్టూ మాత్రమే",
    q4_a4: "దాదాపు ఎప్పుడూ జరగదు, చర్మం సున్నితంగా ఉంటుంది",
    q4_a5: "కొన్నిసార్లు, ముఖ్యంగా వాతావరణం మారినప్పుడు",

    q5: "కొత్త ఉత్పత్తులు లేదా ఎండకు మీ చర్మం ఎలా స్పందిస్తుంది?",
    q5_a1: "బిగుతుగా లేదా చాలా పొడిగా మారుతుంది",
    q5_a2: "అంతగా మారదు, జిడ్డుగానే ఉంటుంది",
    q5_a3: "కొన్ని ప్రాంతాలలో మాత్రమే మారుతుంది",
    q5_a4: "అరుదుగా దురద లేదా ఎరుపు వస్తుంది",
    q5_a5: "చాలా త్వరగా ఎర్రగా, దురదగా లేదా వేడిగా మారుతుంది",

    // Dashboard
    greetingMorning: "శుభోదయం,",
    greetingAfternoon: "శుభ మధ్యాహ్నం,",
    greetingEvening: "శుభ సాయంత్రం,",
    highUvAlert: "ఎండ తీవ్రత హెచ్చరిక",
    optimalConditions: "అనుకూలమైన వాతావరణం",
    uvWarning: "సన్‌స్క్రీన్ రాయడం మర్చిపోకండి! SPF 50+ వాడండి.",
    uvSafe: "ప్రస్తుతం వాతావరణం బాగుంది. మీ స్కిన్‌కేర్ పూర్తి చేయండి!",
    uvIndex: "ఎండ తీవ్రత (UV)",
    temperature: "ఉష్ణోగ్రత",
    hydrationTitle: "నీటి లభ్యత కొలత",
    target: "లక్ష్యం",
    fullyHydrated: "🎉 పుష్కలంగా నీరు తాగారు",
    cupsLogged: "కప్పుల నీరు తాగారు",
    plusWater: "+1 కప్పు నీరు",
    minusWater: "-1 కప్పు నీరు",
    wellnessSuite: "స్కిన్‌కేర్ & వెల్‌నెస్ సేవలు",
    activeScanner: "ఉత్పత్తుల స్కానర్",
    circadianClock: "స్కిన్ క్లాక్ (బయో టైమ్)",
    skinYoga: "ఫేస్ యోగా",
    checkProductSynergy: "రెండు క్రీముల కలయికను తనిఖీ చేయండి",
    bioTimeOptimizations: "సమయం ప్రకారం చర్మ సంరక్షణ",
    facialAcupressureMap: "ముఖ మసాజ్ పటము",
    morningRoutine: "ఉదయం స్కిన్‌కేర్",
    nightRoutine: "రాత్రి స్కిన్‌కేర్",
    dietInsights: "ఆహార సలహాలు",
    recommendation: "సలహా",
    suggestedForYou: "మీ కోసం ప్రత్యేక ఉత్పత్తులు",
    basedOnSkin: "చర్మ రకాన్ని బట్టి",
    aiSkinStyling: "AI చర్మ శైలి",
    seasonalColorPalette: "మీకు సరిపోయే రంగులు",
    bestStylingColors: "మీ దుస్తులు మరియు మేకప్ రంగులు",
    unlockStylingPrompt: "మీ చర్మ విశ్లేషణను తెరవండి! మీకు సరిపోయే రంగులు తెలుసుకోవడానికి ఇక్కడ క్లిక్ చేసి ముఖాన్ని స్కాన్ చేయండి.",
    undertone: "అండర్టోన్",

    // Recommendations Portal
    recTitle: "చర్మ నిపుణుల సలహాలు",
    recSubtitle: "మీ చర్మ రకానికి సరిపోయే వైద్య నిపుణులు ఆమోదించిన స్కిన్‌కేర్ రూటీన్లు, భద్రతా నియమాలు మరియు ఉత్పత్తులు.",
    trustSealTitle: "వైద్యపరంగా నమ్మదగినది & సురక్షితమైనది",
    trustSealApproved: "డాక్టర్లచే పరీక్షించబడింది",
    trustSealCruelty: "క్రూరత్వం లేనిదిగా ధృవీకరించబడింది",
    trustSealSecure: "డేటా భద్రత & గోప్యత",
    trustSealClean: "రసాయన రహిత & సురక్షితమైనది",
    dermatologistQuote: "డాక్టర్ క్లినికల్ ఆమోదం",
    safetyRules: "స్కిన్‌కేర్ రూటీన్ భద్రతా నియమాలు",
    safetyRule1: "ఉదయం స్కిన్‌కేర్ చివరలో ఎల్లప్పుడూ సన్‌స్క్రీన్ (SPF 50+) రాయండి. రెటినాల్ మరియు AHA చర్మాన్ని ఎండకు సున్నితంగా మారుస్తాయి.",
    safetyRule2: "రెటినాల్ మరియు విటమిన్ సిలను ఒకే సమయంలో నేరుగా కలపకండి. మంటను నివారించడానికి ఉదయం విటమిన్ సి మరియు రాత్రి రెటినాల్ ఉపయోగించండి.",
    safetyRule3: "చర్మ రక్షణ పొరను కాపాడుకోవడానికి ఎక్స్‌ఫోలియేటింగ్ యాసిడ్లను (AHA/BHA) నెమ్మదిగా వారానికి 2-3 సార్లు మాత్రమే ఉపయోగించడం ప్రారంభించండి.",
    whyWorks: "ఈ రూటీన్ ఎందుకు పనిచేస్తుంది",
    viewRecGuide: "👨‍⚕️ డాక్టర్ ఆమోదించిన రూటీన్ & ఉత్పత్తులు: మీ చర్మానికి సరిపోయే ఉపయోగ నిబంధనలు మరియు భద్రతా సలహాలు చూడండి.",
    routineDirections: "ఉపయోగించే విధానం",

    // Circadian Clock
    circadianTitle: "స్కిన్ క్లాక్",
    circadianSubtitle: "చర్మం యొక్క సహజ చక్రానికి అనుగుణంగా క్రీములు మరియు సిరమ్‌లు రాయండి",
    biologicalHour: "సహజ జైవిక సమయం",
    skinPhase: "చర్మం యొక్క ప్రస్తుత సంరక్షణ దశ",
    activeNow: "ప్రస్తుతం సక్రియంగా ఉంది",
    skinBiology: "చర్మ జీవశాస్త్రం",
    biologicalState: "చర్మం యొక్క స్థితి",
    recommendationTitle: "ఈ సమయం యొక్క సలహా",

    phase_morning_title: "ఉదయం (06:00 - 10:00)",
    phase_morning_sub: "చర్మం మేల్కొనడం",
    phase_morning_bio: "ఉదయం నిద్ర లేచినప్పుడు చర్మం చాలా పొడిగా ఉంటుంది. ఇది ధూళి, ఎండ మరియు కాలుష్యం నుండి తనను తాను రక్షించుకోవడానికి సిద్ధమవుతుంది.",
    phase_morning_action: "సున్నితమైన ఫేస్ వాష్‌తో కడిగి, మాయిశ్చరైజర్ రాయండి. ఎండ నుండి రక్షణ కోసం విటమిన్ సి మరియు సన్‌స్క్రీన్ వాడండి.",

    phase_midday_title: "మధ్యాహ్నం (10:00 - 16:00)",
    phase_midday_sub: "ఎక్కువ జిడ్డు వచ్చే సమయం",
    phase_midday_bio: "మధ్యాహ్నం వేళల్లో చర్మం ఎక్కువగా జిడ్డును విడుదల చేస్తుంది, దీనివల్ల ముఖం జిడ్డుగా కనిపిస్తుంది. ఈ సమయంలో ఎండ తీవ్రత ఎక్కువగా ఉండి హాని కలిగిస్తుంది.",
    phase_midday_action: "మెత్తటి టిష్యూతో జిడ్డును శుభ్రం చేయండి. సురక్షితంగా ఉండటానికి ప్రతి 2 గంటలకు సన్‌స్క్రీన్ మళ్లీ రాయండి.",

    phase_afternoon_title: "మధ్యాహ్నం తర్వాత (16:00 - 18:00)",
    phase_afternoon_sub: "బలహీనమైన రక్షణ సమయం",
    phase_afternoon_bio: "ఈ సమయంలో మీ చర్మం యొక్క సహజ రక్షణ పొర కొద్దిగా బలహీనపడుతుంది. చర్మంలో నీటి శాతం తగ్గి, అలసిపోయినట్లు మరియు పొడిగా కనిపిస్తుంది.",
    phase_afternoon_action: "అలసిపోయిన మీ చర్మాన్ని ఉత్తేజపరచడానికి ముఖంపై నీటిని స్ప్రే చేయండి లేదా తేలికపాటి మాయిశ్చరైజర్ రాయండి.",

    phase_night_title: "సాయంత్రం (18:00 - 23:00)",
    phase_night_sub: "శుభ్రత మరియు పునరుద్ధరణ",
    phase_night_bio: "చర్మం తనను తాను రక్షించుకోవడం ఆపిвеసి, ధూళిని శుభ్రం చేయడం, దెబ్బతిన్న కణాలను బాగు చేయడం మరియు పాత చర్మాన్ని తొలగించే పనిని ప్రారంభిస్తుంది.",
    phase_night_action: "రోజంతా పేరుకుపోయిన ధూళిని తొలగించడానికి ముఖాన్ని రెండుసార్లు కడగండి. చర్మాన్ని క్లియర్ చేసే క్రీమ్ లేదా మాస్క్ రాయండి.",

    phase_latenight_title: "అర్ధరాత్రి (23:00 - 06:00)",
    phase_latenight_sub: "రాత్రి వేళల లోతైన మరమ్మత్తు",
    phase_latenight_bio: "మీరు నిద్రపోతున్నప్పుడు చర్మం 3 రెట్లు వేగంగా కోలుకుంటుంది మరియు కొత్త కణాలను తయారు చేస్తుంది. రాత్రి క్రీములు ఈ సమయంలో చర్మంలోనికి లోతుగా చొచ్చుకుపోతాయి.",
    phase_latenight_action: "చర్మం కోలుకోవడానికి పడుకునే ముందు మీ రాత్రి క్రీమ్ లేదా సిరమ్ తప్పకుండా రాయండి.",

    // Skin Yoga
    yogaTitle: "ఫేస్ యోగా",
    yogaSubtitle: "ముఖ మసాజ్ మరియు ఒక్యుప్రెషర్ పాయింట్ టైమర్",
    acupressurePoint: "ఒక్యుప్రెషర్ పాయింట్",
    benefits: "ప్రయోజనాలు",
    technique: "విధానం",
    close: "మూసివేయి",
    massagePaceAssist: "మసాజ్ వేగం",
    readyMessage: "సిద్ధం. స్టార్ట్ బటన్ నొక్కి మసాజ్ చేయండి.",
    activeMessage: "స్క్రీన్ పై ఉన్న వృత్తాల వేగంతో మీ వేళ్లను తిప్పండి...",
    completedMessage: "ఫేస్ యోగా పూర్తయింది! ముఖంలో సరికొత్త కాంతిని పొందండి.",
    startMassageTimer: "యోగా టైమర్ ప్రారంభించు",
    stopTimer: "టైమర్ ఆపు",
    restartRitual: "మళ్లీ ప్రారంభించు",

    point_thirdeye_name: "యింతాంగ్ (మూడవ కన్ను - నుదురు)",
    point_thirdeye_benefits: "మనస్సును ప్రశాంతపరుస్తుంది, నుదుటిపై ముడతలను తగ్గిస్తుంది మరియు నుదుటి భాగంలో రక్త ప్రసరణను పెంచుతుంది.",
    point_thirdeye_action: "భూబొమ్మల మధ్య మీ వేలిని ఉంచి, మెల్లగా నొక్కుతూ పైకి లాగండి.",

    point_temple_name: "తైయాంగ్ (కనతలు - సైడ్)",
    point_temple_benefits: "కళ్ల అలసటను తగ్గిస్తుంది, వాచిన కళ్లను నయం చేస్తుంది మరియు ముఖంలో పేరుకుపోయిన నీటిని తొలగిస్తుంది.",
    point_temple_action: "రెండు వేళ్లతో కనతలపై బయటి వైపుగా గుండ్రంగా తిప్పుతూ మెల్లగా రుద్దండి.",

    point_cheek_name: "సిబాయి (కంటికి కింద భాగంలో)",
    point_cheek_benefits: "కళ్ల కింద నల్లటి వలయాలను తగ్గిస్తుంది, బుగ్గలపై కాంతిని తెస్తుంది మరియు ముఖ అలసటను పోగొడుతుంది.",
    point_cheek_action: "మీ ఉంగరపు వేలితో కళ్ల కింద చాలా నెమ్మదిగా పైకి కిందికి నొక్కండి.",

    point_jaw_name: "ジయాచే (దవడ మూల)",
    point_jaw_benefits: "దవడల బిగుతును తొలగిస్తుంది మరియు దవడకు చక్కని ఆకృతిని ఇస్తుంది.",
    point_jaw_action: "దవడ మూలల వద్ద వేళ్లతో పైకి గుండ్రంగా తిప్పుతూ రుద్దండి.",

    point_chin_name: "చెంగ్‌జియాంగ్ (గడ్డం మధ్య భాగం)",
    point_chin_benefits: "నోటి చుట్టూ ఉన్న కండరాలను सడలిస్తుంది మరియు గడ్డం నుండి వ్యర్థాలను శుభ్రపరుస్తుంది.",
    point_chin_action: "మీ బొటనవేలిని పెదవి కింద ఉంచి మెల్లగా పైకి నొక్కుతూ లాగండి.",

    // Ingredient Scanner
    scannerTitle: "ఉత్పత్తుల స్కానర్",
    scannerSubtitle: "క్రీముల యొక్క పదార్థాల కలయిక మరియు సురక్షితత్వాన్ని పరీక్షించండి",
    ingredientA: "మొదటి పదార్థం (A)",
    ingredientB: "రెండవ పదార్థం (B)",
    selectActive: "కెమికల్ ఎంచుకోండి...",
    synergyRating: "కలయిక రేటింగ్",
    selectToScan: "పదార్థాలను ఎంచుకోండి",
    selectToScanDesc: "రెండు స్కిన్‌కేర్ పదార్థాలను ఎంచుకుని వాటి కలయిక లేదా నష్టాన్ని వెంటనే తెలుసుకోండి.",
    editScannerDb: "స్కానర్‌లో కొత్త పదార్థం చేర్చండి ⚙️",
    customDbTitle: "స్వంత పదార్థాలు",
    addCustomIng: "కొత్త పదార్థాన్ని చేర్చు",
    nameLabel: "పదార్థం పేరు",
    descLabel: "వివరణ / ప్రభావం",
    saveIng: "పదార్థాన్ని సేవ్ చేయి",
    delete: "హటావు",
    customIngList: "మీరు చేర్చిన పదార్థాలు"
  }
};

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => {
    const saved = localStorage.getItem('cuitsCare_lang');
    return saved || 'en';
  });

  const changeLanguage = (newLang) => {
    setLang(newLang);
    localStorage.setItem('cuitsCare_lang', newLang);
  };

  const t = (key) => {
    return TRANSLATIONS[lang]?.[key] || TRANSLATIONS['en']?.[key] || key;
  };

  const currentLang = lang;

  return (
    <LanguageContext.Provider value={{ currentLang, changeLanguage, t }}>
      {children}
      {/* Floating Language Switcher Widget */}
      <div className="floating-lang-switcher">
        <select 
          value={lang} 
          onChange={(e) => changeLanguage(e.target.value)}
          className="lang-select-dropdown"
          aria-label="Select Language"
        >
          <option value="en">English (Simple)</option>
          <option value="hi">हिंदी (Hindi)</option>
          <option value="es">Español (Spanish)</option>
          <option value="te">తెలుగు (Telugu)</option>
        </select>
      </div>
    </LanguageContext.Provider>
  );
};
