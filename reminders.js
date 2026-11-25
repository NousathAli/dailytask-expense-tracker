// Phone reminders (Android / iOS only; the browser preview skips them).
// 1. Late clock-out: 7, 8, 9, 10 and 11 PM after Clock In, until Clock Out.
// 2. Parking / reimbursement: every evening at 8:30 PM, "Did you pay parking today?".
//    Skipped on days that already have a reimbursement entry. Tapping it opens Add Reimbursement.
import { Platform } from "react-native";
import * as Notifications from "expo-notifications";

export const LATE_CLOCK_OUT_START_HOUR = 19; // 7 PM: clock out at or after this asks for a note
export const LATE_REMINDER_HOURS = [19, 20, 21, 22, 23];
export const PARKING_REMINDER_TIME = { hour: 20, minute: 30 };
const PARKING_REMINDER_DAYS_AHEAD = 30; // refreshed every time the app opens

const CLOCK_CHANNEL_ID = "clock-out-reminder";
const PARKING_CHANNEL_ID = "parking-reminder";
const LATE_ID_PREFIX = "late-clockout-";
const PARKING_ID_PREFIX = "parking-reminder-";
const isPhone = Platform.OS === "android" || Platform.OS === "ios";

let setupDone = false;

async function setupNotifications() {
  if (!isPhone) return false;
  if (!setupDone) {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });
    if (Platform.OS === "android") {
      // Android 13+ shows the permission prompt only after a channel exists.
      await Notifications.setNotificationChannelAsync(CLOCK_CHANNEL_ID, {
        name: "Clock-out reminders",
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
      });
      await Notifications.setNotificationChannelAsync(PARKING_CHANNEL_ID, {
        name: "Parking and backup reminders",
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
      });
    }
    setupDone = true;
  }
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;
  if (!current.canAskAgain) return false;
  const asked = await Notifications.requestPermissionsAsync();
  return Boolean(asked.granted);
}

async function cancelByPrefix(prefix) {
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  await Promise.all(
    scheduled
      .filter((item) => String(item.identifier || "").startsWith(prefix))
      .map((item) => Notifications.cancelScheduledNotificationAsync(item.identifier))
  );
}

function dateKeyToParts(dateKey) {
  const [year, month, day] = String(dateKey).split("-").map(Number);
  return { year, monthIndex: month - 1, day };
}

function toDateKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

// ---------- Late clock-out ----------

export async function cancelLateClockOutReminders() {
  if (!isPhone) return;
  try {
    await cancelByPrefix(LATE_ID_PREFIX);
  } catch (error) {
    console.log("Cancel reminder error:", error);
  }
}

// dateKey: "YYYY-MM-DD" of the work day. Only future reminder times are scheduled.
export async function scheduleLateClockOutReminders(dateKey, checkInTime) {
  if (!isPhone) return;
  try {
    const allowed = await setupNotifications();
    await cancelByPrefix(LATE_ID_PREFIX);
    if (!allowed) return;

    const { year, monthIndex, day } = dateKeyToParts(dateKey);
    const now = Date.now();
    for (const hour of LATE_REMINDER_HOURS) {
      const at = new Date(year, monthIndex, day, hour, 0, 0);
      if (at.getTime() <= now) continue;
      const label = hour > 12 ? `${hour - 12}:00 PM` : `${hour}:00`;
      await Notifications.scheduleNotificationAsync({
        identifier: `${LATE_ID_PREFIX}${dateKey}-${hour}`,
        content: {
          title: "Still working? Clock out",
          body: `It is ${label} and you have not clocked out (in at ${checkInTime || "--"}). Clock out and add a note for the extra time.`,
          data: { screen: "dashboard" },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: at,
          channelId: CLOCK_CHANNEL_ID,
        },
      });
    }
  } catch (error) {
    console.log("Schedule reminder error:", error);
  }
}

// True when the time "HH:mm" is 7 PM or later.
export function isLateClockOutTime(time24) {
  const hour = Number(String(time24 || "").split(":")[0]);
  return !Number.isNaN(hour) && hour >= LATE_CLOCK_OUT_START_HOUR;
}

// ---------- Parking / reimbursement ----------

// datesWithEntries: Set of "YYYY-MM-DD" that already have a reimbursement entry (no reminder those days).
export async function scheduleParkingReminders(datesWithEntries) {
  if (!isPhone) return;
  try {
    const allowed = await setupNotifications();
    await cancelByPrefix(PARKING_ID_PREFIX);
    if (!allowed) return;

    const now = new Date();
    for (let offset = 0; offset < PARKING_REMINDER_DAYS_AHEAD; offset += 1) {
      const at = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + offset,
        PARKING_REMINDER_TIME.hour,
        PARKING_REMINDER_TIME.minute,
        0
      );
      if (at.getTime() <= now.getTime()) continue;
      const dateKey = toDateKey(at);
      if (datesWithEntries && datesWithEntries.has(dateKey)) continue;
      await Notifications.scheduleNotificationAsync({
        identifier: `${PARKING_ID_PREFIX}${dateKey}`,
        content: {
          title: "Parking or Salik today?",
          body: "Did you pay parking, Salik, transport or a food bill today? Tap to add it to Reimbursement.",
          data: { screen: "addReimbursement" },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: at,
          channelId: PARKING_CHANNEL_ID,
        },
      });
    }
  } catch (error) {
    console.log("Schedule parking reminder error:", error);
  }
}

// ---------- Tapping a notification ----------

// Calls onOpen(screenName) when the user taps one of our notifications,
// including the tap that started the app. Returns an unsubscribe function.
export function listenForReminderTaps(onOpen) {
  if (!isPhone) return () => {};
  const handle = (response) => {
    const screen = response?.notification?.request?.content?.data?.screen;
    if (screen) onOpen(String(screen));
  };
  Notifications.getLastNotificationResponseAsync()
    .then((response) => {
      if (response) {
        handle(response);
        if (typeof Notifications.clearLastNotificationResponseAsync === "function") {
          Notifications.clearLastNotificationResponseAsync();
        }
      }
    })
    .catch(() => {});
  const subscription = Notifications.addNotificationResponseReceivedListener(handle);
  return () => subscription.remove();
}

// ---------- Weekly backup ----------

const BACKUP_ID_PREFIX = "backup-reminder-";
const BACKUP_REMINDER_HOUR = 13; // 1 PM, away from the evening reminders
const BACKUP_REMINDER_WEEKS = 4; // refreshed every time the app opens

// lastBackupDateKey: "YYYY-MM-DD" of the last backup export, or "" if none yet.
// Reminds 7 days after the last backup, then every 7 days until a new backup is taken.
export async function scheduleBackupReminders(lastBackupDateKey) {
  if (!isPhone) return;
  try {
    const allowed = await setupNotifications();
    await cancelByPrefix(BACKUP_ID_PREFIX);
    if (!allowed) return;

    const base = lastBackupDateKey ? dateKeyToParts(lastBackupDateKey) : null;
    const now = new Date();
    const start = base
      ? new Date(base.year, base.monthIndex, base.day)
      : new Date(now.getFullYear(), now.getMonth(), now.getDate());
    let scheduled = 0;
    for (let week = 1; scheduled < BACKUP_REMINDER_WEEKS && week < 60; week += 1) {
      const at = new Date(start.getFullYear(), start.getMonth(), start.getDate() + week * 7, BACKUP_REMINDER_HOUR, 0, 0);
      if (at.getTime() <= now.getTime()) continue;
      await Notifications.scheduleNotificationAsync({
        identifier: `${BACKUP_ID_PREFIX}${toDateKey(at)}`,
        content: {
          title: "Weekly backup",
          body: lastBackupDateKey
            ? `Last DailyTask backup was on ${lastBackupDateKey}. Tap to take a backup (save it to Google Drive).`
            : "You have no DailyTask backup yet. Tap to take one (save it to Google Drive).",
          data: { screen: "backupRestore" },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: at,
          channelId: PARKING_CHANNEL_ID,
        },
      });
      scheduled += 1;
    }
  } catch (error) {
    console.log("Schedule backup reminder error:", error);
  }
}

// Used by Reset App: removes every reminder this app scheduled.
export async function cancelAllReminders() {
  if (!isPhone) return;
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch (error) {
    console.log("Cancel all reminders error:", error);
  }
}
