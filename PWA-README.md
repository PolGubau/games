# 🎮 Pol/Games - PWA Ready

## Progressive Web App Features

This project is now a fully functional **Progressive Web App** with:

### ✅ Implemented Features

1. **📱 Installable on Mobile & Desktop**
   - Shows install prompt automatically after 3 seconds
   - Works on Android, iOS, Windows, macOS, Linux
   - App icon appears on home screen/start menu

2. **🔌 Offline Support**
   - All games work without internet connection
   - Service Worker caches all assets
   - Google Fonts cached for offline use

3. **⚡ Fast Performance**
   - Precached assets (1.3MB total)
   - Instant loading after first visit
   - Optimized with Workbox strategies

4. **🎨 Native App Feel**
   - Standalone display mode (no browser UI)
   - Custom splash screen
   - Theme color integration
   - iOS status bar styling

### 📦 What Was Added

#### Dependencies
- `vite-plugin-pwa` - PWA plugin for Vite
- `workbox-window` - Service worker registration

#### New Files
- `app/components/install-pwa.tsx` - Install prompt component
- `app/hooks/use-service-worker.ts` - SW registration hook
- `build/client/sw.js` - Generated service worker
- `build/client/manifest.webmanifest` - Web app manifest

#### Configuration
- `vite.config.ts` - PWA plugin configured with Workbox
- `app/root.tsx` - PWA meta tags and install component

### 🚀 Testing PWA Features

#### Local Testing
```bash
pnpm build
pnpm preview
```
Then visit http://localhost:4173 and:
- Open DevTools → Application → Service Workers
- Check "Manifest" tab for app info
- Test "Add to Home Screen" in mobile view

#### Production Testing (Vercel)
1. Deploy to Vercel
2. Visit on mobile device
3. Install prompt appears after 3 seconds
4. Tap "Install" → App added to home screen
5. Open app → Works offline! ✨

### 📱 iOS Specific Notes

On iOS/Safari:
1. Tap Share button (⬆️)
2. Scroll down → "Add to Home Screen"
3. App installs with icon
4. Launch from home screen (no browser chrome)

**Note:** iOS doesn't show the automatic install prompt, but the app is still fully installable and works offline.

### 🎯 User Experience Flow

1. **First Visit**
   - App loads normally
   - Service worker installs in background
   - After 3 seconds: Install prompt appears (Android/Desktop)

2. **After Install**
   - App opens in standalone mode
   - No browser UI visible
   - Feels like native app

3. **Offline Mode**
   - Close app, turn off WiFi
   - Open app again → Works perfectly!
   - All games playable offline

### 🔧 Customization

#### Change Install Prompt Delay
Edit `app/components/install-pwa.tsx`:
```tsx
setTimeout(() => setShowInstallPrompt(true), 3000); // Change to desired ms
```

#### Disable Install Prompt Temporarily
User can click "Later" → Won't show again for 7 days

#### Cache Strategy
Configured in `vite.config.ts`:
- **Static assets**: Precached
- **Google Fonts**: Cache-first (1 year)
- **App shell**: Immediate updates

### 📊 Performance

- **Precache Size**: 1.35 MB (82 files)
- **First Load**: ~2-3s
- **Subsequent Loads**: <500ms
- **Offline**: Instant

### 🐛 Troubleshooting

**Service Worker not updating?**
```bash
# Clear cache and rebuild
pnpm run build
```

**Install prompt not showing?**
- Check if already installed (standalone mode)
- Check if dismissed recently (7-day cooldown)
- iOS doesn't show automatic prompt (use Share → Add to Home Screen)

**Offline not working?**
- Check Network tab → Service Worker should be active
- Reload page once after first install
- Check Console for SW errors

---

Made with ❤️ by @polgubau
