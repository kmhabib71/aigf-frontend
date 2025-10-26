# Update Homepage to Use Admin Settings

## Manual Edits Required:

Edit `src/app/page.tsx`:

### 1. Background Image (line ~101)

Change from:
```tsx
backgroundImage: 'url("/image.jpg")',
```

To:
```tsx
backgroundImage: `url("${settings.backgroundImage}")`,
```

### 2. Badge Text (line ~156)

Change from:
```tsx
Start Instantly — No Signup Required
```

To:
```tsx
{settings.homePageHeading}
```

### 3. Chat Card Heading (line ~195)

Change from:
```tsx
Romantic Chat
```

To:
```tsx
{settings.chatPageHeading}
```

### 4. Story Card Heading (line ~267)

Change from:
```tsx
Create a Story
```

To:
```tsx
{settings.storyPageHeading}
```

### 5. Main Tagline (line ~534)

Change from:
```tsx
Every love story deserves to be finished
```

To:
```tsx
{settings.homePageTagline}
```

## Already Done:
✅ Import added
✅ Hook initialized
