# JW Study Companion — Mobile build

This folder contains the shared Capacitor app used to build Android and iOS versions. It reuses the current study dashboard, study library, planner, notes, highlights and JW.ORG-only external-link policy.

## Mobile features
- Responsive phone navigation and layout
- Customization Studio: light, dark, AMOLED and system themes; accent colours; text size; compact/comfortable spacing; corner styles; saved appearance profiles
- Local device storage for study data
- Local document import (PDF, TXT, Markdown and DOCX; maximum 20 MB)
- JW.ORG links opened through the native browser
- Android/iOS local notification scheduling (a daily one-hour-before reminder is scheduled when permissions are granted and the app starts or settings are saved)
- JSON backup export

## iPhone option without Apple signing
The `www` folder also includes an installable PWA. Once the built `dist` folder is hosted on an HTTPS website, open that website in Safari on iPhone, tap **Share → Add to Home Screen**. On Android, open it in Chrome and choose **Install app**. The PWA stores notes locally and caches the interface for offline use; native local notifications are available in the Android/iOS Capacitor builds, not in this simple PWA package.

## Build with GitHub Actions (no terminal commands on your PC)
1. Upload the `mobile` folder to your existing GitHub repository, and create `.github/workflows/build-mobile.yml` using the supplied workflow file.
2. Open **Actions**.
3. Select **Build Mobile Apps**.
4. Click **Run workflow**.
5. Download the Android or iOS simulator artifact after the job completes.

### Android
The Android workflow produces a debug APK. It can be installed on a compatible Android phone after downloading and extracting the artifact. Android may ask you to allow installation from the browser/file manager used to open it.

### iPhone / iOS
The iOS workflow produces an **iOS Simulator app**, not a signed iPhone IPA. It is useful for testing in the iOS Simulator on a Mac. Installing a native build on a physical iPhone or distributing through TestFlight/App Store requires Apple code signing and an Apple Developer account. Without that, use the installable PWA option above on iPhone.

## Important limitations
- The mobile version is a first cross-platform conversion of the existing desktop app, not a full native rewrite.
- Customization changes the app interface; it cannot replace iOS/Android system UI or change other apps.
- Local data stays on the device. There is no cloud sync or account system.
- Imported files are stored locally; large documents may use substantial device storage.
- The native mobile app requests notification permission and schedules a repeating daily one-hour-before reminder. The PWA version does not provide native local reminders.
- Official religious information remains restricted to JW.ORG links. Personal notes/highlights are user-created and are not official publication content.
