/**
 * emailService.js
 * Sends transactional emails via EmailJS (no backend needed).
 *
 * ── HOW TO SET UP YOUR OWN EmailJS ─────────────────────────────────────────
 *  1. Go to https://www.emailjs.com  → Sign up free
 *  2. Add an Email Service  (Gmail / Outlook / any SMTP)
 *     → Copy the  Service ID  → paste into EMAILJS_SERVICE_ID below
 *  3. Create Email Templates for each type (see template instructions below)
 *     → Copy each Template ID → paste into TEMPLATE_IDS below
 *  4. Go to Account → API Keys → copy your  Public Key
 *     → paste into EMAILJS_PUBLIC_KEY below
 * ──────────────────────────────────────────────────────────────────────────
 *
 * Template variables you can use in EmailJS template editor:
 *   {{to_name}}      – recipient's name
 *   {{to_email}}     – recipient email
 *   {{skin_type}}    – e.g. Oily / Dry / Sensitive
 *   {{score}}        – skin health score %
 *   {{issue}}        – main skin concern
 *   {{recommendation}} – recommended product
 *   {{tip}}          – today's skin tip
 *   {{date}}         – date string
 */

import emailjs from '@emailjs/browser';

// ── CONFIGURE THESE ─────────────────────────────────────────────────────────
const EMAILJS_SERVICE_ID  = 'YOUR_SERVICE_ID';   // e.g. 'service_abc123'
const EMAILJS_PUBLIC_KEY  = 'YOUR_PUBLIC_KEY';   // e.g. 'user_xyz789'

const TEMPLATE_IDS = {
  welcome:    'template_welcome',   // Sent on new account creation
  scanResult: 'template_scan',      // Sent when skin scan is saved
  weeklyTip:  'template_weekly',    // Sent as weekly skin tip
  reminder:   'template_reminder',  // Sent as routine reminder
};
// ────────────────────────────────────────────────────────────────────────────

const isConfigured = () =>
  EMAILJS_SERVICE_ID !== 'YOUR_SERVICE_ID' && EMAILJS_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY';

/* Generic send helper */
async function sendEmail(templateId, params) {
  if (!isConfigured()) {
    console.info('[EmailJS] Not configured yet — skipping email send.');
    return { skipped: true };
  }
  try {
    const res = await emailjs.send(
      EMAILJS_SERVICE_ID,
      templateId,
      params,
      EMAILJS_PUBLIC_KEY
    );
    console.info('[EmailJS] Email sent ✅', res.status, res.text);
    return res;
  } catch (err) {
    console.error('[EmailJS] Send failed:', err);
    return { error: err };
  }
}

/* ── Public API ─────────────────────────────────────────────────────────── */

/** Send welcome email on new account creation */
export function sendWelcomeEmail({ name, email }) {
  return sendEmail(TEMPLATE_IDS.welcome, {
    to_name:  name,
    to_email: email,
    date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
  });
}

/** Send scan result summary after user saves a scan */
export function sendScanResultEmail({ name, email, score, issue, recommendation, skinType }) {
  return sendEmail(TEMPLATE_IDS.scanResult, {
    to_name:        name,
    to_email:       email,
    score,
    issue,
    recommendation,
    skin_type:      skinType,
    date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
  });
}

/** Send a time-aware skin tip (call once a day from Dashboard) */
export function sendWeeklySkinTip({ name, email, skinType, tip }) {
  return sendEmail(TEMPLATE_IDS.weeklyTip, {
    to_name:   name,
    to_email:  email,
    skin_type: skinType,
    tip,
    date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
  });
}

/** Send a routine reminder */
export function sendRoutineReminder({ name, email, routineType }) {
  return sendEmail(TEMPLATE_IDS.reminder, {
    to_name:      name,
    to_email:     email,
    routine_type: routineType, // 'Morning' or 'Evening'
    date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
  });
}

export default { sendWelcomeEmail, sendScanResultEmail, sendWeeklySkinTip, sendRoutineReminder };
