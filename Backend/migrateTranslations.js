const mongoose = require('mongoose');
const Site = require('./Models/Sites');

// Sample translations for demonstration
const sampleTranslations = {
  // Example for Taj Mahal (you can customize these)
  "Taj Mahal": {
    title: {
      en: "Taj Mahal",
      hi: "ताज महल",
      de: "Tadsch Mahal",
      fr: "Taj Mahal",
      mr: "ताजमहाल",
      ta: "தாஜ் மஹால்",
      te: "తాజ్ మహల్",
      kn: "ತಾಜ್ ಮಹಲ್"
    },
    location: {
      en: "Agra, Uttar Pradesh",
      hi: "आगरा, उत्तर प्रदेश",
      de: "Agra, Uttar Pradesh",
      fr: "Agra, Uttar Pradesh",
      mr: "आग्रा, उत्तर प्रदेश",
      ta: "ஆக்ரா, உத்தரபிரதேசம்",
      te: "ఆగ్రా, உత்தரప్రదేశ్",
      kn: "ಆಗ್ರಾ, ಉತ್ತರ ಪ್ರದೇಶ"
    },
    summary: {
      en: "An ivory-white marble mausoleum on the right bank of the river Yamuna, built by Mughal emperor Shah Jahan in memory of his wife Mumtaz Mahal.",
      hi: "यमुना नदी के दाहिने किनारे पर स्थित हाथीदांत-सफेद संगमरमर का मकबरा, जिसे मुगल सम्राट शाहजहाँ ने अपनी पत्नी मुमताज महल की याद में बनवाया था।",
      de: "Ein elfenbeinweißes Marmor-Mausoleum am rechten Ufer des Flusses Yamuna, erbaut vom Mogul-Kaiser Shah Jahan zum Gedenken an seine Frau Mumtaz Mahal.",
      fr: "Un mausolée en marbre blanc ivoire sur la rive droite de la rivière Yamuna, construit par l'empereur moghol Shah Jahan en mémoire de sa femme Mumtaz Mahal.",
      mr: "यमुना नदीच्या उजव्या काठावरील हस्तिदंती-पांढऱ्या संगमरवराचे समाधी, मुघल सम्राट शाहजहान यांनी आपल्या पत्नी मुमताज महल यांच्या स्मरणार्थ बांधले होते।",
      ta: "யமுனா ஆற்றின் வலது கரையில் உள்ள தந்தம்-வெள்ளை பளிங்கு கல்லறை, முகலாய பேரரசர் ஷாஜஹான் தனது மனைவி மும்தாஜ் மஹாலின் நினைவாக கட்டினார்.",
      te: "యమున నది కుడి ఒడ్డున ఉన్న దంతపు-తెలుపు పాలరాయి సమాధి, మొఘల్ చక్రవర్తి షాజహాన్ తన భార్య ముమ్తాజ్ మహల్ జ్ఞాపకార్థం నిర్మించారు.",
      kn: "ಯಮುನಾ ನದಿಯ ಬಲದಂಡೆಯಲ್ಲಿರುವ ದಂತದ-ಬಿಳಿ ಅಮೃತಶಿಲೆಯ ಸಮಾಧಿ, ಮೊಘಲ್ ಚಕ್ರವರ್ತಿ ಶಾಜಹಾನ್ ತನ್ನ ಹೆಂಡತಿ ಮುಮ್ತಾಜ್ ಮಹಲ್ ಅವರ ನೆನಪಿಗಾಗಿ ನಿರ್ಮಿಸಿದರು."
    },
    history: {
      en: "Construction began in 1632 and was completed in 1653. It employed thousands of artisans and craftsmen and is considered the jewel of Muslim art in India.",
      hi: "निर्माण 1632 में शुरू हुआ और 1653 में पूरा हुआ। इसमें हजारों कारीगरों और शिल्पकारों को लगाया गया था और इसे भारत में मुस्लिम कला का रत्न माना जाता है।",
      de: "Der Bau begann 1632 und wurde 1653 abgeschlossen. Tausende von Handwerkern waren beschäftigt und es gilt als Juwel der muslimischen Kunst in Indien.",
      fr: "La construction a commencé en 1632 et s'est achevée en 1653. Elle a employé des milliers d'artisans et est considérée comme le joyau de l'art musulman en Inde.",
      mr: "बांधकाम 1632 मध्ये सुरू झाले आणि 1653 मध्ये पूर्ण झाले। यात हजारो कारागीर आणि शिल्पकारांना काम दिले गेले आणि भारतातील मुस्लिम कलेचा रत्न मानला जातो।",
      ta: "கட்டுமானம் 1632 இல் தொடங்கி 1653 இல் முடிக்கப்பட்டது. இது ஆயிரக்கணக்கான கைவினைஞர்களை பணியமர்த்தியது மற்றும் இந்தியாவில் முஸ்லீம் கலையின் ரத்தினமாக கருதப்படுகிறது.",
      te: "నిర్మాణం 1632లో ప్రారంభమై 1653లో పూర్తయింది. ఇది వేలాది మంది కళాకారులను మరియు హస్తకళాకారులను నియమించింది మరియు భారతదేశంలో ముస్లిం కళ యొక్క రత్నంగా పరిగణించబడుతుంది.",
      kn: "ನಿರ್ಮಾಣವು 1632 ರಲ್ಲಿ ಪ್ರಾರಂಭವಾಯಿತು ಮತ್ತು 1653 ರಲ್ಲಿ ಪೂರ್ಣಗೊಂಡಿತು. ಇದು ಸಾವಿರಾರು ಕುಶಲಕರ್ಮಿಗಳನ್ನು ನೇಮಿಸಿತು ಮತ್ತು ಭಾರತದಲ್ಲಿ ಮುಸ್ಲಿಂ ಕಲೆಯ ರತ್ನವೆಂದು ಪರಿಗಣಿಸಲಾಗಿದೆ."
    }
  }
};

// Fallback placeholder text when no translation is available
const getPlaceholderText = (field, lang) => {
  const placeholders = {
    en: "Content not yet available in this language",
    hi: "यह सामग्री अभी इस भाषा में उपलब्ध नहीं है",
    de: "Inhalt ist noch nicht in dieser Sprache verfügbar",
    fr: "Contenu pas encore disponible dans cette langue",
    mr: "ही सामग्री अद्याप या भाषेत उपलब्ध नाही",
    ta: "இந்த மொழியில் உள்ளடக்கம் இன்னும் கிடைக்கவில்லை",
    te: "ఈ భాషలో కంటెంట్ ఇంకా అందుబాటులో లేదు",
    kn: "ಈ ಭಾಷೆಯಲ್ಲಿ ವಿಷಯ ಇನ್ನೂ ಲಭ್ಯವಿಲ್ಲ"
  };
  return placeholders[lang] || placeholders.en;
};

// Function to add translations to existing sites
async function addTranslationsToSites() {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/holoheri', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('Connected to MongoDB');

    // Get all sites
    const sites = await Site.find({});
    console.log(`Found ${sites.length} sites to update`);

    for (const site of sites) {
      console.log(`\nProcessing: ${site.title}`);

      // Check if translations already exist
      if (!site.translations) {
        site.translations = {};
      }

      // Get sample translations if available, otherwise use placeholders
      const siteTranslations = sampleTranslations[site.title];
      
      const languages = ['en', 'hi', 'de', 'fr', 'mr', 'ta', 'te', 'kn'];
      const fields = ['title', 'location', 'summary', 'history', 'architecture', 'conservation', 'modernRelevance', 'oldStructureDesc', 'newStructureDesc'];

      fields.forEach(field => {
        if (!site.translations[field]) {
          site.translations[field] = {};
        }

        languages.forEach(lang => {
          // Use sample translation if available
          if (siteTranslations && siteTranslations[field] && siteTranslations[field][lang]) {
            site.translations[field][lang] = siteTranslations[field][lang];
          } 
          // If it's English, use the original field value
          else if (lang === 'en' && site[field]) {
            site.translations[field][lang] = site[field];
          }
          // Otherwise, use placeholder if field has content in English
          else if (site[field]) {
            site.translations[field][lang] = `[${lang.toUpperCase()}] ${getPlaceholderText(field, lang)}`;
          }
        });
      });

      await site.save();
      console.log(`✓ Updated ${site.title}`);
    }

    console.log('\n✅ Migration completed successfully!');
    console.log('\nNote: Sites now have multi-language support.');
    console.log('Translation placeholders have been added for content not yet translated.');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
  }
}

// Run the migration
if (require.main === module) {
  addTranslationsToSites();
}

module.exports = { addTranslationsToSites };
