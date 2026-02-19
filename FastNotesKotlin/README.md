# Fast Notes Kotlin
## Building and Running

To build the project, run the following command in your terminal:

```
./gradlew :app:assembleDebug
```

To run the application, you can either use Android Studio's "Run 'app'" configuration or deploy the application from the command line after building it.

After a successful build, you can find the APK in `app/build/outputs/apk/debug/app-debug.apk`.

To install the app on a connected device or emulator, use the following command:
```
adb install app/build/outputs/apk/debug/app-debug.apk
```
