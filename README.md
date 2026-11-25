# DailyTask

**Daily work, neatly managed.** DailyTask is an Android app that keeps attendance, tasks, petty cash and reimbursement claims in one place. It produces Excel reports in the Microsoft Dynamics 365 Business Central import format with one tap.

It replaces WhatsApp notes, paper receipts and separate Excel sheets. Everything works offline, and your data stays on your phone.

<p>
  <a href="https://github.com/NousathAli/dailytask-expense-tracker/releases/latest"><b>⬇ Download the latest APK</b></a> &nbsp;·&nbsp;
  <a href="docs/USER_GUIDE.md"><b>📖 User Guide</b></a>
</p>

## Install (2 minutes)

1. Open the **[latest release](https://github.com/NousathAli/dailytask-expense-tracker/releases/latest)** on your Android phone and download the `.apk` under **Assets**.
2. Open the downloaded file. If asked, allow **Install unknown apps** for your browser or Files app.
3. Tap **Install**. If Play Protect warns you, choose **Install anyway**. The app is not from the Play Store, so this warning is normal.
4. Open DailyTask, tap **Get Started → New User? Sign Up** and create your username and password.

For step-by-step instructions for every screen, read the **[User Guide](docs/USER_GUIDE.md)**.

<!-- Screenshots: add images to docs/screenshots/ and uncomment
<p>
  <img src="docs/screenshots/home.jpg" width="200" />
  <img src="docs/screenshots/attendance.jpg" width="200" />
  <img src="docs/screenshots/petty-cash.jpg" width="200" />
  <img src="docs/screenshots/reimbursement.jpg" width="200" />
</p>
-->

## Features

| Module | What it does |
|---|---|
| **Tasks** | Company and personal tasks with follow-up dates. The home screen counts pending tasks and today's follow-ups. |
| **Attendance** | Clock in and out against a fixed duty window (08:30–17:30, one-hour break), overtime, day off, leave types and public-holiday handling. Pending-off, PH and extra-hours balances carry forward month to month. Exports a monthly timesheet to Excel. |
| **Petty Cash** | Records cash received, supplier invoices (VAT, invoice no., branch), and transfers in and out. A month-closing step settles the period. Exports a report workbook plus a journal-line sheet. |
| **Reimbursement** | Parking, Salik (road toll), transport, food and accommodation expenses. Entries are grouped into claim batches and tracked as *not submitted → waiting payment → paid*. |
| **Master Data** | Companies, branches, branch codes and suppliers. Branch codes can be imported from Excel. |
| **Security & Backup** | Local password with fingerprint or face unlock. The full backup and restore is a JSON file shared to Drive, email or WhatsApp. |
| **Reminders** | Hourly late clock-out reminders from 7 PM, an evening parking-entry reminder and a weekly backup reminder, all as local notifications. |

## Technical highlights

- **Offline-first.** No backend, no account, no internet needed. All data lives in on-device storage (AsyncStorage) and survives app updates.
- **Accounting-ready exports.** SheetJS builds `.xlsx` files whose columns match the Microsoft Dynamics 365 Business Central journal-line import (G/L, posting groups, VAT, dimensions). The finance team can import them directly instead of retyping.
- **Excel import.** Branch master data is read from a spreadsheet with header detection, so hundreds of codes don't have to be typed in one by one.
- **Time calculations.** Worked time, overtime and leave balances are calculated per day, including shifts that run past midnight, and carried into the next month.
- **Local notifications.** Scheduled with `expo-notifications` on dedicated Android channels. They are rescheduled each time the app opens, so they stay correct without a server.
- **Biometric lock.** `expo-local-authentication` is used on launch and when the app returns from the background.

## Tech stack

- React Native 0.85 · Expo SDK 56 · JavaScript
- AsyncStorage, Expo FileSystem, Sharing, DocumentPicker, ImagePicker
- expo-notifications, expo-local-authentication
- SheetJS (`xlsx`) for Excel import and export
- EAS Build for the APK

## For developers: run from source

Requirements: Node.js 20+, and an Android phone with a development build, or an emulator.

```bash
git clone https://github.com/NousathAli/dailytask-expense-tracker.git
cd dailytask-expense-tracker
npm install
npx expo start
```

Build an installable APK with EAS:

```bash
npx eas build -p android --profile preview
```

A fresh install also accepts the default login: username `admin`, password `admin123`. Change the password after the first login.

## Project structure

```
App.js          Main app: screens, state, storage, exports
reminders.js    Local notification scheduling
docs/           User guide
app.json        Expo config (permissions, icons, Android package)
eas.json        Build profiles (preview APK, production AAB)
assets/         App icon and splash images
```

## Roadmap

- Split `App.js` into per-module screens and hooks
- Optional cloud sync so data can move between devices
- Charts for monthly spend and overtime

## Author

**Nousath Ali** · IT Support · CCTV · App development
[GitHub](https://github.com/NousathAli)

## License

[MIT](LICENSE)
