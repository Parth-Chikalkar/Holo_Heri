// Helper to get localized content from a site document
const getLocalizedSite = (site, lang = 'en') => {
  if (!site) return null;

  const siteObj = site.toObject ? site.toObject() : site;
  const translations = siteObj.translations || {};

  // Helper function to get translated field or fallback
  const getTranslatedField = (fieldName, defaultValue = "") => {
    const transField = translations[fieldName];
    if (transField && transField[lang]) {
      return transField[lang];
    }
    // Fallback to English
    if (transField && transField.en) {
      return transField.en;
    }
    // Fallback to default field value
    return siteObj[fieldName] || defaultValue;
  };

  return {
    ...siteObj,
    title: getTranslatedField('title', siteObj.title),
    location: getTranslatedField('location', siteObj.location),
    summary: getTranslatedField('summary', siteObj.summary),
    history: getTranslatedField('history', siteObj.history),
    architecture: getTranslatedField('architecture', siteObj.architecture),
    conservation: getTranslatedField('conservation', siteObj.conservation),
    modernRelevance: getTranslatedField('modernRelevance', siteObj.modernRelevance),
    oldStructureDesc: getTranslatedField('oldStructureDesc', siteObj.oldStructureDesc),
    newStructureDesc: getTranslatedField('newStructureDesc', siteObj.newStructureDesc),
    // Keep original translations object for admin/editing purposes
    translations: siteObj.translations
  };
};

// Middleware to extract language from request
const languageMiddleware = (req, res, next) => {
  // Get language from query param, header, or default to 'en'
  req.userLang = req.query.lang || req.headers['accept-language']?.split(',')[0]?.split('-')[0] || 'en';
  
  // Validate language code
  const supportedLangs = ['en', 'hi', 'de', 'fr', 'mr', 'ta', 'te', 'kn'];
  if (!supportedLangs.includes(req.userLang)) {
    req.userLang = 'en';
  }
  
  next();
};

module.exports = {
  getLocalizedSite,
  languageMiddleware
};
