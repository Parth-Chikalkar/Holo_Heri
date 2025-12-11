# Multi-Language Implementation Guide

## Backend Setup Complete ✅

### What's Been Implemented:

1. **Database Schema Updated** (`Backend/Models/Sites.js`)
   - Added `translations` object with support for 8 languages
   - Each field (title, location, summary, history, etc.) can have translations

2. **API Controller Updated** (`Backend/Controllers/siteController.js`)
   - Automatically returns content in the requested language
   - Falls back to English if translation not available

3. **Localization Helper** (`Backend/Utils/i18nHelper.js`)
   - Handles language selection and fallback logic

4. **Migration Script** (`Backend/migrateTranslations.js`)
   - Adds translation support to existing sites in database

### Supported Languages:
- 🇬🇧 English (en)
- 🇮🇳 Hindi (hi)
- 🇩🇪 German (de)
- 🇫🇷 French (fr)
- 🇮🇳 Marathi (mr)
- 🇮🇳 Tamil (ta)
- 🇮🇳 Telugu (te)
- 🇮🇳 Kannada (kn)

## Frontend Setup Complete ✅

1. **API Integration** (`Frontend/src/API/api.js`)
   - Automatically sends current language with every request

2. **Translation Display** (`Frontend/src/Components/TranslatedContent.jsx`)
   - Shows placeholder indicator when translation not available
   - Displays "Translation Not Available" message in UI

3. **Viewer Component Updated** (`Frontend/src/Components/HaloHero.jsx`)
   - All content sections use TranslatedContent component
   - Handles missing translations gracefully

## How to Run Migration

### Step 1: Update MongoDB Connection
Edit `Backend/migrateTranslations.js` line 141:
```javascript
await mongoose.connect('mongodb://localhost:27017/holoheri', {
```
Change to your MongoDB connection string if different.

### Step 2: Run Migration Script
```powershell
cd Backend
node migrateTranslations.js
```

This will:
- Connect to your database
- Add translation structure to all existing sites
- Add English content to `translations.*.en` fields
- Add placeholder messages for other languages
- Show "Translation Not Available" indicator in frontend

### Step 3: Start Backend
```powershell
cd Backend
node Server.js
```

### Step 4: Start Frontend
```powershell
cd Frontend
npm run dev
```

## How It Works

### Language Selection Flow:
1. User selects language in frontend (globe icon in navbar)
2. Frontend API automatically includes `?lang=XX` in all requests
3. Backend returns content in requested language
4. If translation missing, shows placeholder with indicator

### Example API Response:
```json
{
  "title": "ताज महल",  // Hindi translation
  "location": "आगरा, उत्तर प्रदेश",
  "summary": "...",
  "history": "[HI] Content not yet available in this language",
  "translations": {
    "title": {
      "en": "Taj Mahal",
      "hi": "ताज महल",
      "mr": "ताजमहाल"
    }
  }
}
```

## Adding Real Translations

To add actual translations for a site:

### Option 1: Via Database (MongoDB)
```javascript
db.sites.updateOne(
  { title: "Taj Mahal" },
  {
    $set: {
      "translations.history.hi": "असली हिंदी में इतिहास...",
      "translations.architecture.hi": "असली हिंदी में वास्तुकला..."
    }
  }
)
```

### Option 2: Via API (when creating/updating sites)
Send `translations` object in request body:
```javascript
{
  title: "Taj Mahal",
  translations: {
    title: {
      hi: "ताज महल",
      mr: "ताजमहाल"
    },
    history: {
      hi: "इतिहास की जानकारी..."
    }
  }
}
```

## Frontend Visual Indicators

When translation is missing, users will see:
- ⚠️ Orange indicator bar on the left
- "TRANSLATION NOT AVAILABLE" badge
- Placeholder message explaining content is not yet translated

This makes it clear which content needs translation work!

## Testing

1. Run migration script
2. Start backend and frontend
3. Open browser to `http://localhost:5173`
4. Click globe icon in navbar
5. Switch between languages
6. Notice content changes and placeholder indicators

## Next Steps

- Add real translations to database for your heritage sites
- Translations will automatically display instead of placeholders
- No code changes needed - just update database!
