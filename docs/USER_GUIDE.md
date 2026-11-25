# DailyTask User Guide

This guide covers installing DailyTask and using each part of the app. You don't need any technical knowledge to follow it.

**Contents**
1. [Install the app](#1-install-the-app)
2. [First-time setup](#2-first-time-setup)
3. [Home screen](#3-home-screen)
4. [Attendance](#4-attendance)
5. [Tasks](#5-tasks)
6. [Petty Cash](#6-petty-cash)
7. [Reimbursement](#7-reimbursement)
8. [Master Data](#8-master-data)
9. [Settings, security and backup](#9-settings-security-and-backup)
10. [Reminders](#10-reminders)
11. [Moving to a new phone](#11-moving-to-a-new-phone)
12. [Common questions](#12-common-questions)

---

## 1. Install the app

DailyTask runs on Android phones. It is installed from an APK file, not from the Play Store.

1. On your phone, open the **[latest release page](https://github.com/NousathAli/dailytask-expense-tracker/releases/latest)**.
2. Under **Assets**, tap the `.apk` file to download it (about 70 MB).
3. Open the downloaded file from the notification or from the **Files / Downloads** app.
4. If the phone says *"For your security, your phone is not allowed to install unknown apps from this source"*, tap **Settings**, turn on **Allow from this source**, then go back.
5. Tap **Install**. If Google Play Protect shows a warning, tap **More details → Install anyway**. The warning appears because the app is not from the Play Store.
6. Open **DailyTask**.

**Updating:** download the newer APK from the releases page and install it over the old one. Your data stays on the phone. Still, take a backup first (see [section 9](#9-settings-security-and-backup)).

## 2. First-time setup

1. Tap **Get Started** on the welcome screen.
2. Choose one way in:
   - **New User? Sign Up**: create your own username and password. This is the recommended option. Phone and email are optional.
   - **Login** with the default account: username `admin`, password `admin123`. Change the password afterwards in **Settings / Backup → Change Password**.
3. Fill in your profile (name, employee ID, phone, email, designation, department) and tap **Save & Continue**. You can also tap **Continue as Admin** and fill this in later from **Profile**.
4. Allow **notifications** when the phone asks. The reminders need them.

> Each phone has one DailyTask account. Everything you enter is saved **only on that phone**. Nothing is uploaded to a server.

**Forgot your password?** On the login screen, tap **Forgot password?** and confirm with your phone's fingerprint, face or PIN, then set a new password.

## 3. Home screen

The top of the home screen shows today's attendance, with **Clock In** and **Clock Out** buttons, and four summary cards:

| Card | Meaning | Tap to open |
|---|---|---|
| Tasks | Tasks still pending | Tasks |
| Follow Ups | Follow-ups due today | Tasks |
| Petty Cash | Cash currently with you | Petty Cash |
| Transfer | Cash given to someone else and not yet returned | Petty Cash |

Below the cards, the module buttons open each part of the app.

## 4. Attendance

**Daily use**
- Tap **Clock In** when you start work and **Clock Out** when you finish.
- The normal duty time is **08:30 AM – 05:30 PM** with a one-hour break. Time worked beyond that is counted as **Extra**.
- If you clock out at 7 PM or later, the app asks for a short note (**Late Clock Out**).
- If you forgot to clock out, open the day and use **Add Clock-Out Time**.

**Days off, leave and holidays**
- Open **Attendance**, select a date and choose the **Day Type**:
  - *Work Day*
  - Leave: *Normal Day Off, Pending Off Taken, Annual / Sick / Emergency / Unpaid / Other Leave*
  - Public holiday: *PH Off, PH Worked, PH Comp Off Taken*
  - *Off Cancelled*: you worked on your off day
- Tap **Save Attendance**.

**Monthly summary**
- The month view shows records, worked days, off days and extra time.
- **Carry Forward Balance** shows pending offs, PH balance and extra hours. These balances move to the next month automatically.
- **View All Attendance Days** lets you filter by day type and edit any day (**Edit Attendance**).
- **Export Timesheet Excel** creates the month's timesheet. You can then share it on WhatsApp, email, Teams or Drive.

## 5. Tasks

1. Open **Tasks → Add Task**.
2. Enter the title and notes, then choose:
   - **Category**: *Company* or *Personal*
   - **Priority**
   - a due date and a follow-up date
3. Save the task. It now appears under **My Tasks**.
4. Use **Change Status** to set *Pending*, *In Progress* or *Completed*. Completed tasks move to **Completed Tasks**. **Move to Pending** reopens a task.

## 6. Petty Cash

Petty cash is tracked per **open period**. A period runs until you close it with **Month Closing**.

| Action | When to use it |
|---|---|
| **Cash received from office** | When you receive petty cash. Enter the amount and date. |
| **Supplier invoice entry** | For every purchase. Enter the supplier, branch (BC Branch code), invoice no., amount and **VAT Type** (*VAT Included*, *No VAT* or *Manual VAT*). VAT is calculated automatically. |
| **Transfer out or returned cash** | *Transfer Out* when you give cash to a colleague. *Transfer In* when cash comes back to you. |

The top cards show **Received**, **Expenses**, **Transfer Out**, **Transfer In** and **Cash with me** for the open period.

**Reports and export**
- **Petty Cash Report** gives a mobile preview of the period. Use **Search Petty Cash** to search it.
- **Export Excel** creates a workbook with the report, received cash and cash transfers.
- **Export BC Excel** creates the expense lines in the **Business Central** import format, ready for the finance team.

**Closing the month**
- Open **Month Closing → Close Month**.
- The closing balance is carried into the new period. Past periods are kept under **Closing History**.

## 7. Reimbursement

For expenses you paid from your own money.

**Add an expense**
1. Open **Reimbursement**.
2. Choose the type: **Parking**, **Salik**, **Other Transportation** or **Food & Accommodation**.
3. Enter the date, amount and details, then save.

**Submit a claim**
1. **Pending Records to Submit** lists every expense that is not yet claimed.
2. Choose the **Claim Date Range** and check the **Monthly claim preview**.
3. Tap **Submit Claim**. The records are grouped into one claim batch.
4. Use **Export Claim Excel** for the claim form, or **Export Claim BC Excel** for the Business Central import file.

**Track payment**
- Submitted claims appear under **Waiting Payment**.
- When the money arrives, tap **Payment Received** and enter the date. The claim and its records are then marked as reimbursed.
- **Claim History** keeps every past claim.

## 8. Master Data

Master Data holds the lists used in dropdowns. It has four tabs:

| Tab | Contents |
|---|---|
| Company | Companies and entities |
| Branch | Branches under each company |
| BC Branch | Business Central branch and entity codes, used in the *Branch* column of BC exports |
| Supplier | Supplier names for petty cash invoices |

- **Load Built-in Master** fills the BC Branch list with the codes that ship with the app.
- **Import BC Branch Excel** loads codes from your own Excel file instead.
- Use **Add …** and **Save …** to add entries one at a time, and **Search BC Branch Master** to find a code.

## 9. Settings, security and backup

Open **Settings / Backup**.

**Security**
- **Enable Biometric Login** lets you log in with fingerprint or face. You can still use your phone PIN as a fallback.
- **Security Lock** locks the app when you leave it, and asks for biometrics again when you come back.
- **Change Password** updates your local password.

**Backup (important)**

Your data lives only on your phone. If you uninstall the app or lose the phone, the data is gone unless you have a backup.

- **Export Backup JSON** creates one file with all your data. Save or share it to Google Drive, Teams, email or WhatsApp.
- **Import / Restore Backup** picks a backup file and restores everything from it.
- The app reminds you once a week to take a backup.

## 10. Reminders

DailyTask sends local notifications. It doesn't need internet for them.

| Reminder | When |
|---|---|
| Late clock-out | Every hour from 7 PM to 11 PM if you clocked in and haven't clocked out |
| Parking entry | 8:30 PM, to log the day's parking or Salik |
| Backup | Once a week at 1 PM |

Tapping a reminder opens the related screen. If reminders don't appear, check **Phone Settings → Apps → DailyTask → Notifications** (and **Alarms & reminders**, if your phone has it) and make sure they are allowed.

## 11. Moving to a new phone

1. On the old phone, open **Settings / Backup → Export Backup JSON** and save the file to Drive or send it to yourself.
2. Install DailyTask on the new phone ([section 1](#1-install-the-app)) and create your account.
3. Open **Settings / Backup → Import / Restore Backup** and choose the file.

## 12. Common questions

**Does the app need internet?**
No. Internet is only needed to download the APK and to share exported files.

**Can my manager see my data?**
No. Data never leaves your phone. To share it, export an Excel file and send it yourself.

**I exported an Excel file. Where is it?**
After an export, the phone's share menu opens. Choose where to save or send the file, for example Drive, WhatsApp or email.

**Can two people use one phone?**
Each phone has one account. Each person should use DailyTask on their own phone.

**The app says "Sharing Not Available".**
Make sure at least one app that can receive files (Drive, WhatsApp, Gmail) is installed, then try again.
