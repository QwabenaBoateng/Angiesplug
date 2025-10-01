# Troubleshooting Guide

## Issue: Blank page when running `npm run dev`

### Possible Causes and Solutions:

1. **Missing Dependencies**
   ```bash
   npm install
   ```

2. **Node.js Version Issues**
   - Make sure you're using Node.js 16+ 
   - Check with: `node --version`

3. **Port Already in Use**
   - Try a different port: `npm run dev -- --port 3001`

4. **Browser Cache**
   - Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
   - Or open in incognito/private mode

5. **Check Browser Console**
   - Open Developer Tools (F12)
   - Look for any error messages in the Console tab

6. **Environment Variables**
   - The app should work without Supabase configuration
   - If you see a red banner saying "App is working!", React is running correctly

### Quick Test:

1. Run `npm run dev`
2. Open http://localhost:3000
3. You should see a red banner saying "App is working!"
4. If you see this, the app is working correctly

### If still not working:

1. Check the terminal for any error messages
2. Try clearing node_modules and reinstalling:
   ```bash
   rm -rf node_modules
   npm install
   npm run dev
   ```

3. Check if all files are in the correct locations:
   - `src/main.jsx` should exist
   - `src/App.jsx` should exist
   - `src/pages/Home.jsx` should exist
   - `index.html` should exist in the root directory
