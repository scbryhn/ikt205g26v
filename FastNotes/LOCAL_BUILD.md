# Local Android Build Guide (Windows)

This guide explains how to build a local APK for FastNotes on Windows and install it on a phone.

## Prerequisites

- Node.js and npm installed
- Android Studio installed
- Android SDK installed (Platform + Build tools)
- JDK 21 installed (recommended for this project)

Expected JDK path used below:

- `C:\Program Files\Java\jdk-21.0.10`

## 1) Install dependencies

From project root:

```powershell
npm install
```

## 2) Generate Android project files

From project root:

```powershell
npx expo prebuild -p android
```

## 3) Build release APK locally

From `android` folder, force Java 21 and build arm64 only:

```powershell
$env:JAVA_HOME="C:\Program Files\Java\jdk-21.0.10"
$env:Path="$env:JAVA_HOME\bin;" + $env:Path
.\gradlew.bat --no-daemon -PreactNativeArchitectures=arm64-v8a assembleRelease
```

Why `arm64-v8a` only:

- Avoids Windows path-length failures seen with all ABIs.
- Works for most modern Android phones.

## 4) APK output

Generated file:

- `android\app\build\outputs\apk\release\app-release.apk`

## 5) Install on phone

### Option A: USB copy + manual install

1. Connect phone via USB.
2. Copy `app-release.apk` to phone (for example `Downloads`).
3. Open file on phone and install.
4. If prompted, allow "Install unknown apps" for your file manager/browser.

### Option B: ADB install

From project root:

```powershell
adb devices
adb install -r android/app/build/outputs/apk/release/app-release.apk
```

## Troubleshooting

### Error: `Error resolving plugin [id: 'com.facebook.react.settings'] > 25.0.2`

Cause:

- Build is using Java 25.

Fix:

- Force Java 21 in the same terminal before running Gradle (commands in Step 3).

### Error: `Filename longer than 260 characters`

Cause:

- Windows path-length issue during native build for multiple ABIs.

Fix:

- Build with `-PreactNativeArchitectures=arm64-v8a`.

### `expo-notifications` plugin cannot be resolved

Cause:

- Missing/incomplete `node_modules` install.

Fix:

```powershell
npm install
npx expo install expo-notifications
npx expo prebuild -p android
```

## Optional: Make Java 21 permanent for Gradle

Add this line to `android\gradle.properties`:

```properties
org.gradle.java.home=C:\\Program Files\\Java\\jdk-21.0.10
```
