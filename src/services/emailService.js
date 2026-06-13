/**
 * emailService.js  —  Powered by Web3Forms (https://web3forms.com)
 *
 * ── ONE-TIME SETUP (takes 60 seconds) ──────────────────────────────────────
 *  1. Open: https://web3forms.com
 *  2. Enter YOUR email address → click "Create Access Key"
 *  3. Check your email → copy the Access Key they send you
 *  4. Paste it below in WEB3FORMS_ACCESS_KEY
 *  5. Done! Emails will now arrive in your inbox for free (250/month free)
 * ───────────────────────────────────────────────────────────────────────────
 */

// ── ACCESS KEY — read from localStorage so user can set it in Settings ──────
// Go to Settings → Email Notifications → paste your key there.
// Or paste it directly here: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
const getAccessKey = () =>
  localStorage.getItem('cuitsCare_email_key') || 'YOUR_ACCESS_KEY_HERE';
// ────────────────────────────────────────────────────────────────────────────

const isConfigured = () => getAccessKey() !== 'YOUR_ACCESS_KEY_HERE' && getAccessKey() !== '';

/* Generic send via Web3Forms fetch API */
async function sendEmail({ subject, body, toEmail, toName }) {
  if (!isConfigured()) {
    console.info('[Email] Not configured. Go to Settings → Email Notifications → paste your Web3Forms key.');
    return { skipped: true };
  }

  const formData = {
    access_key: getAccessKey(),
    subject,
    from_name: 'Cuits Care 🌸',
    message: body,
    recipient_name: toName,
    recipient_email: toEmail,
  };

  try {
    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    if (data.success) {
      console.info('[Email] ✅ Sent:', subject);
      return { success: true };
    } else {
      console.error('[Email] ❌ Failed:', data);
      return { error: data.message };
    }
  } catch (err) {
    console.error('[Email] ❌ Network error:', err);
    return { error: err.message };
  }
}

/* ── Beautiful HTML email body builders ──────────────────────────────────── */

function welcomeBody(name) {
  return `
Hello ${name}! 🌸

Welcome to Cuits Care — your personal AI skin health companion.

Your account has been successfully created. Here's what you can do now:
  ✅ Take your first AI Skin Scan
  ✅ Set up your Morning & Night Routine
  ✅ Track your skin health progress daily
  ✅ Explore the Ingredient Wiki

Your skin journey starts today. Consistency is the secret to glowing skin! 💫

Stay glowing,
The Cuits Care Team 🌿

---
This email was sent because you signed up at Cuits Care.
  `.trim();
}

function scanResultBody(name, { score, issue, recommendation, skinType }) {
  return `
Hello ${name}! 🔬

Your latest AI Skin Scan results are ready:

  📊 Skin Health Score : ${score}%
  🧴 Skin Type         : ${skinType}
  ⚠️  Main Concern      : ${issue}
  💊 Recommended       : ${recommendation}

${score >= 80
  ? '🌟 Excellent! Your skin is in great shape. Keep up your routine!'
  : score >= 60
  ? '👍 Good progress! Stay consistent with your skincare routine.'
  : '💪 Your skin needs some extra care. Follow the recommendations above.'}

Open the app to see your full score breakdown and personalised routine.

Stay consistent,
Cuits Care 🌸

---
Date: ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
  `.trim();
}

function reminderBody(name, routineType) {
  const tips = {
    Morning: [
      'Cleanse → Vitamin C Serum → Moisturiser → SPF 50+',
      'Never skip sunscreen — UV damage is the #1 cause of premature ageing.',
      'Apply Vitamin C in the morning for maximum antioxidant protection.',
    ],
    Evening: [
      'Double cleanse → Toner → Serum → Moisturiser',
      'Night is when your skin repairs itself 3× faster — use your actives now!',
      'Apply retinol or niacinamide serum for overnight renewal.',
    ],
  };
  const tip = tips[routineType]?.[Math.floor(Math.random() * 3)] || 'Stay consistent with your routine!';

  return `
Hello ${name}! ⏰

Time for your ${routineType} Skincare Routine!

Today's tip: ${tip}

Open Cuits Care to check off your routine steps and keep your streak going! 🔥

Your routine:
  ${routineType === 'Morning' ? '☀️ Cleanser → Vitamin C → Moisturiser → SPF' : '🌙 Cleanser → Toner → Serum → Night Cream'}

Keep glowing,
Cuits Care 🌸

---
Date: ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
  `.trim();
}

function weeklyTipBody(name, { skinType, tip }) {
  return `
Hello ${name}! 💡

Your Weekly Skin Tip for ${skinType} Skin:

${tip}

─────────────────────────────────────
This week's focus areas for ${skinType} skin:
${skinType === 'Oily'        ? '  • Use a salicylic acid cleanser 2x/week\n  • Apply niacinamide serum daily\n  • Use oil-free moisturiser' : ''}
${skinType === 'Dry'         ? '  • Use a cream-based cleanser\n  • Layer hyaluronic acid on damp skin\n  • Use a rich night cream' : ''}
${skinType === 'Combination' ? '  • Zone-specific care: rich cream on cheeks, light gel on T-zone\n  • Use niacinamide to balance oil production' : ''}
${skinType === 'Sensitive'   ? '  • Patch-test new products\n  • Use fragrance-free products only\n  • Look for centella asiatica and oat complex' : ''}
${skinType === 'Normal'      ? '  • Maintain your routine consistently\n  • Add antioxidants like Vitamin C\n  • Use SPF 50+ daily' : ''}

Open the app to explore personalised recommendations and track your progress.

Stay radiant,
Cuits Care 🌿

---
Date: ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
  `.trim();
}

/* ── Public API ─────────────────────────────────────────────────────────── */

/** Sent on new account creation */
export function sendWelcomeEmail({ name, email }) {
  return sendEmail({
    subject: `Welcome to Cuits Care, ${name}! 🌸`,
    body: welcomeBody(name),
    toName: name,
    toEmail: email,
  });
}

/** Sent when skin scan result is saved */
export function sendScanResultEmail({ name, email, score, issue, recommendation, skinType }) {
  return sendEmail({
    subject: `Your Skin Scan Results — Score: ${score}% 🔬`,
    body: scanResultBody(name, { score, issue, recommendation, skinType }),
    toName: name,
    toEmail: email,
  });
}

/** Sent as a routine reminder (Morning / Evening) */
export function sendRoutineReminder({ name, email, routineType }) {
  return sendEmail({
    subject: `⏰ ${routineType} Skincare Reminder — Cuits Care`,
    body: reminderBody(name, routineType),
    toName: name,
    toEmail: email,
  });
}

/** Sent as a weekly skin tip */
export function sendWeeklySkinTip({ name, email, skinType, tip }) {
  return sendEmail({
    subject: `💡 Your Weekly Skin Tip for ${skinType} Skin`,
    body: weeklyTipBody(name, { skinType, tip }),
    toName: name,
    toEmail: email,
  });
}

export default { sendWelcomeEmail, sendScanResultEmail, sendRoutineReminder, sendWeeklySkinTip };
