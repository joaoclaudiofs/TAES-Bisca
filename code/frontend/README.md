# To start the project
```bash
npm install
npm install @capacitor/core @capacitor/cli
npx cap init
npm install @capacitor/android
npx cap add android
npx cap copy android
```

# To keep running and testing
```bash
npm run build
npx cap copy android
npx cap open android
```

# Get APK
```bash
cd android
./gradlew assembleRelease
```


#Run unit tests
```bash
cd frontend
npx vitest run us'x'.spec.js
```