# Deployment Guide

This guide explains how to deploy the RSB Shopping platform to production.

## Backend Deployment (Render/Heroku)

### Prerequisites
- Git repository
- Render/Heroku account
- MongoDB Atlas cluster

### Steps for Render

1. Create a new Web Service
   - Connect your repository
   - Select the `backend` directory
   - Environment: Node.js
   - Build Command: `npm install`
   - Start Command: `npm start`

2. Add Environment Variables:
   ```
   NODE_ENV=production
   PORT=5000
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   RAZORPAY_KEY_ID=your_razorpay_key
   RAZORPAY_KEY_SECRET=your_razorpay_secret
   CLOUDINARY_URL=your_cloudinary_url
   CORS_ORIGIN=https://your-frontend-domain.com
   ```

### Steps for Heroku

1. Install Heroku CLI and login
   ```bash
   heroku login
   ```

2. Create new app
   ```bash
   heroku create rsb-shopping-api
   ```

3. Set environment variables
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set MONGODB_URI=your_mongodb_uri
   heroku config:set JWT_SECRET=your_jwt_secret
   heroku config:set RAZORPAY_KEY_ID=your_razorpay_key
   heroku config:set RAZORPAY_KEY_SECRET=your_razorpay_secret
   heroku config:set CLOUDINARY_URL=your_cloudinary_url
   heroku config:set CORS_ORIGIN=https://your-frontend-domain.com
   ```

4. Deploy
   ```bash
   git subtree push --prefix backend heroku main
   ```

## Frontend Deployment (Vercel/Netlify)

### Vercel Deployment

1. Import your Git repository to Vercel
2. Set the root directory to `/frontend`
3. Build settings:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Add environment variables:
   ```
   VITE_API_URL=https://your-backend-api.com
   VITE_RAZORPAY_KEY_ID=your_razorpay_key
   ```

### Netlify Deployment

1. Connect your Git repository
2. Set build settings:
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `dist`
3. Add environment variables in site settings

## Mobile App Publishing (Expo)

1. Install Expo CLI globally
   ```bash
   npm install -g expo-cli
   ```

2. Configure app.json
   ```json
   {
     "expo": {
       "name": "RSB Shopping",
       "slug": "rsb-shopping",
       "version": "1.0.0",
       "orientation": "portrait",
       "icon": "./assets/icon.png",
       "splash": {
         "image": "./assets/splash.png",
         "resizeMode": "contain",
         "backgroundColor": "#ffffff"
       },
       "updates": {
         "fallbackToCacheTimeout": 0
       },
       "assetBundlePatterns": [
         "**/*"
       ],
       "ios": {
         "supportsTablet": true,
         "bundleIdentifier": "com.yourcompany.rsbshopping"
       },
       "android": {
         "adaptiveIcon": {
           "foregroundImage": "./assets/adaptive-icon.png",
           "backgroundColor": "#FFFFFF"
         },
         "package": "com.yourcompany.rsbshopping"
       }
     }
   }
   ```

3. Create production build
   ```bash
   expo build:android
   # or
   expo build:ios
   ```

4. Submit to app stores
   - Follow the [Android submission guide](https://docs.expo.dev/submit/android/)
   - Follow the [iOS submission guide](https://docs.expo.dev/submit/ios/)

## Post-Deployment Checklist

1. Test all API endpoints with production URLs
2. Verify Razorpay integration in production mode
3. Test pincode validation and delivery checks
4. Verify image uploads to Cloudinary
5. Check mobile app deep linking
6. Monitor error logs and performance
7. Set up monitoring and alerts

## Database Backup

1. Set up automated MongoDB Atlas backups
2. Configure backup retention policy
3. Test backup restoration process

## SSL Certificates

- Ensure SSL is enabled on all domains
- Configure SSL certificates through your hosting provider
- Set up auto-renewal

## Security Considerations

1. Enable rate limiting on API endpoints
2. Set secure cookie policies
3. Configure CORS properly
4. Use environment variables for sensitive data
5. Implement request logging
6. Set up error monitoring (e.g., Sentry)

## Performance Optimization

1. Enable gzip compression
2. Configure caching headers
3. Use CDN for static assets
4. Optimize database queries
5. Implement lazy loading for images

## Monitoring & Maintenance

1. Set up uptime monitoring
2. Configure error tracking
3. Monitor API response times
4. Set up database monitoring
5. Schedule regular security updates

## Troubleshooting

Common issues and solutions:

1. CORS errors
   - Verify CORS_ORIGIN in backend environment
   - Check frontend API URL configuration

2. Payment integration issues
   - Verify Razorpay keys
   - Check webhook configurations
   - Validate order creation flow

3. Image upload failures
   - Verify Cloudinary configuration
   - Check upload folder permissions
   - Validate file size limits

4. Mobile app build issues
   - Update Expo SDK if needed
   - Check native dependencies
   - Verify app signing configuration