# Admin Settings - Quick Setup Guide

I've created the admin customization system. Follow these 3 simple steps to integrate it:

## Files Created:

1. ✅ `src/contexts/SiteSettingsContext.tsx` - Settings context
2. ✅ `src/app/admin/components/SiteSettingsTab.tsx` - Settings UI component

## Setup Steps:

### Step 1: Add Provider to Layout

Edit `src/app/layout.tsx`:

```tsx
// Add this import at the top
import { SiteSettingsProvider } from "../contexts/SiteSettingsContext";

// Wrap children with the provider
<AuthProvider>
  <SocketProvider>
    <SiteSettingsProvider>  {/* ADD THIS */}
      {children}
    </SiteSettingsProvider>  {/* ADD THIS */}
  </SocketProvider>
</AuthProvider>
```

### Step 2: Add Settings Tab to Admin Panel

Edit `src/app/admin/page.tsx`:

```tsx
// Add import at top (around line 6)
import SiteSettingsTab from "./components/SiteSettingsTab";

// Change activeTab type (around line 70)
const [activeTab, setActiveTab] = useState<
  "dashboard" | "users" | "tiers" | "tokens" | "settings"  // ADD "settings"
>("dashboard");

// Add Settings button in tabs section (after line 530, after "Token Usage" button)
<button
  onClick={() => setActiveTab("settings")}
  className={`px-6 py-3 rounded-full font-semibold transition-all ${
    activeTab === "settings"
      ? "bg-white text-purple-700"
      : "bg-white/20 text-white hover:bg-white/30"
  }`}
>
  Site Settings
</button>

// Add Settings tab content (after line 1263, after Token Usage tab closes)
{activeTab === "settings" && <SiteSettingsTab />}
```

### Step 3: Update Homepage to Use Settings

Edit `src/app/page.tsx`:

```tsx
// Add import at top
import { useSiteSettings } from "../contexts/SiteSettingsContext";

// Inside component, get settings
const { settings } = useSiteSettings();

// Replace hardcoded background (line 99)
style={{
  backgroundImage: `url("${settings.backgroundImage}")`,  // USE SETTINGS
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  backgroundAttachment: "fixed",
}}

// Replace badge text (line 154)
<span className="text-sm font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent drop-shadow-sm">
  {settings.homePageHeading}  {/* USE SETTINGS */}
</span>

// Replace chat card heading (line 193)
<h2 className="text-3xl lg:text-4xl font-black text-center mb-4 text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
  {settings.chatPageHeading}  {/* USE SETTINGS */}
</h2>

// Replace story card heading (line 265)
<h2 className="text-3xl lg:text-4xl font-black text-center mb-4 text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
  {settings.storyPageHeading}  {/* USE SETTINGS */}
</h2>

// Replace main tagline (line 532)
<h2 className="text-4xl lg:text-5xl font-black text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] mb-4">
  {settings.homePageTagline}  {/* USE SETTINGS */}
</h2>
```

### Step 4: Update Header to Use Logo

Edit `src/components/layout/Header.tsx`:

```tsx
// Add import
import { useSiteSettings } from "../../contexts/SiteSettingsContext";

// Inside component
const { settings } = useSiteSettings();

// Replace logo section (around line 45-49)
<div className="relative">
  <div className="absolute inset-0 bg-gradient-to-r from-purple-300 to-pink-300 rounded-2xl blur-md opacity-60 group-hover:opacity-100 transition-opacity"></div>
  <div className="relative bg-gradient-to-br from-purple-400 to-pink-400 p-2.5 rounded-2xl shadow-lg transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
    {settings.logoUrl ? (
      <img src={settings.logoUrl} alt="Logo" className="w-8 h-8 object-contain" />
    ) : (
      <span className="text-2xl">💕</span>
    )}
  </div>
</div>
```

## Done!

After these edits:

1. Go to `/admin`
2. Click "Site Settings" tab
3. Upload background, logo, change text
4. Click "Save Changes"
5. Refresh homepage to see changes

## Features:

✅ Change background image
✅ Upload custom logo
✅ Customize homepage badge text
✅ Customize homepage tagline
✅ Customize chat card heading
✅ Customize story card heading
✅ Settings persist in localStorage
✅ Reset to defaults button
