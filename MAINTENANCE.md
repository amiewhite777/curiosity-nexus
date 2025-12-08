# Maintenance Mode

This project includes a simple maintenance mode system that you can toggle on/off with a single line change.

## 🛠️ How to Enable Maintenance Mode

1. Open `/src/config/maintenance.ts`
2. Change `MAINTENANCE_MODE = false` to `MAINTENANCE_MODE = true`
3. Rebuild and deploy:
   ```bash
   npm run build
   git add -A
   git commit -m "Enable maintenance mode"
   git push
   ```

## ✅ How to Disable Maintenance Mode

1. Open `/src/config/maintenance.ts`
2. Change `MAINTENANCE_MODE = true` to `MAINTENANCE_MODE = false`
3. Rebuild and deploy:
   ```bash
   npm run build
   git add -A
   git commit -m "Disable maintenance mode"
   git push
   ```

## 🎨 Customizing the Maintenance Page

Edit `/src/config/maintenance.ts` to customize:

```typescript
export const MAINTENANCE_CONFIG = {
  title: "Curiosity Nexus",
  message: "We're currently performing maintenance to improve your experience.",
  submessage: "We'll be back shortly. Thank you for your patience.",
  estimatedReturn: "December 9, 2025 at 3:00 PM PST", // or null
};
```

## 🎭 What Users See

When maintenance mode is enabled, users see:
- A dark gradient background
- Animated glowing orb (pulsing)
- Your custom message
- Animated loading dots
- Optional estimated return time

## 📁 Files Involved

- `/src/config/maintenance.ts` - Configuration (toggle here)
- `/src/components/MaintenancePage.tsx` - Maintenance page component
- `/src/app/page.tsx` - Main page that checks for maintenance mode

## 💡 Quick Toggle

**To take site down temporarily:**
```typescript
// In /src/config/maintenance.ts
export const MAINTENANCE_MODE = true;
```

**To bring site back up:**
```typescript
// In /src/config/maintenance.ts
export const MAINTENANCE_MODE = false;
```

Then rebuild and push to deploy the change!
