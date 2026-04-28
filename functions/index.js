const admin = require("firebase-admin");
const webpush = require("web-push");
const {onSchedule} = require("firebase-functions/v2/scheduler");

admin.initializeApp();

const VAPID_SUBJECT = process.env.WEB_PUSH_SUBJECT || "mailto:admin@rosario.app";
const VAPID_PUBLIC_KEY = process.env.WEB_PUSH_PUBLIC_KEY;
const VAPID_PRIVATE_KEY = process.env.WEB_PUSH_PRIVATE_KEY;

if (VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);
}

const DAILY_INTENTIONS = [
  "Pelos que sofrem perseguição por causa da fé.",
  "Pela conversão dos pecadores e a salvação das almas.",
  "Pelas vocações sacerdotais e religiosas.",
  "Pela paz no mundo e o fim das guerras.",
  "Pelos enfermos e todos que cuidam deles.",
  "Pelas almas do purgatório, especialmente as mais abandonadas.",
  "Pela santificação das famílias.",
  "Pelos jovens, para que encontrem seu caminho em Cristo.",
  "Pela Igreja e pelo Santo Padre.",
  "Pelos missionários em terras distantes.",
];

function getMysteryForDate(dateObj = new Date()) {
  const dayMap = {
    0: "Gloriosos",
    1: "Gozosos",
    2: "Dolorosos",
    3: "Gloriosos",
    4: "Gozosos",
    5: "Dolorosos",
    6: "Gozosos",
  };
  return dayMap[dateObj.getDay()];
}

function getIntentionForDate(dateObj = new Date()) {
  const dayOfYear = Math.floor((dateObj - new Date(dateObj.getFullYear(), 0, 0)) / 86400000);
  return DAILY_INTENTIONS[dayOfYear % DAILY_INTENTIONS.length];
}

exports.sendDailyRosaryPush = onSchedule(
    {schedule: "0 7 * * *", timeZone: "America/Sao_Paulo"},
    async () => {
      if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
        console.error("WEB_PUSH_PUBLIC_KEY/WEB_PUSH_PRIVATE_KEY não configuradas.");
        return;
      }

      const now = new Date();
      const mystery = getMysteryForDate(now);
      const intention = getIntentionForDate(now);

      const usersSnap = await admin.database().ref("users").get();
      if (!usersSnap.exists()) return;

      const users = usersSnap.val();
      const sendJobs = [];

      for (const [uid, user] of Object.entries(users)) {
        if (!user?.pushConfig?.enabled) continue;
        if (!user?.pushSubscription?.endpoint) continue;

        const payload = JSON.stringify({
          title: "Rosário de hoje 🙏",
          body: `Mistérios ${mystery} • Intenção: ${intention}`,
          url: "/",
        });

        const subscription = user.pushSubscription;
        sendJobs.push(
            webpush.sendNotification(subscription, payload)
                .catch(async (err) => {
                  const statusCode = err?.statusCode || 0;
                  if (statusCode === 404 || statusCode === 410) {
                    await admin.database().ref(`users/${uid}/pushSubscription`).remove();
                    await admin.database().ref(`users/${uid}/pushConfig/enabled`).set(false);
                  }
                  console.error(`Falha push para uid=${uid}:`, err.message);
                }),
        );
      }

      await Promise.all(sendJobs);
    },
);
