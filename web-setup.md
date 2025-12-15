# Web Setup Guide

Your Expo app is now configured for web! Here's how to run it:

## Quick Start

1. **Start the web server:**
   ```bash
   npm run web
   ```
   or
   ```bash
   npx expo start --web
   ```

2. **The app will open automatically in your default browser** at `http://localhost:8081` (or the port shown in terminal)

## What's Configured

✅ **react-native-web** - Already installed  
✅ **Web configuration** - Added to `app.json`  
✅ **Web script** - `npm run web` command available  
✅ **AsyncStorage** - Works on web (uses localStorage)  
✅ **SVG Support** - react-native-svg works on web  

## Web-Specific Features

- **AsyncStorage** automatically uses browser's `localStorage` on web
- **Touch events** work as mouse clicks
- **SVG rendering** works natively in browsers
- **Image loading** works with standard web image paths

## Troubleshooting

### If the app doesn't load:
1. Clear browser cache
2. Try a different browser (Chrome, Firefox, Edge)
3. Check console for errors

### If images don't load:
- Make sure image paths are correct
- Check that images are in the project directory

### If you see module errors:
- Run `npm install` again
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`

## Building for Production

To create a production build for web:
```bash
npx expo export:web
```

This creates a `web-build` folder with static files you can deploy to any web server.

