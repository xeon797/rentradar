import { EmailDispatchRecord, VerificationTier } from "@/types/rentradar";

// Persistent in-memory ledger for transactional verification emails
const EMAIL_DISPATCH_LEDGER: EmailDispatchRecord[] = [
  {
    id: "email-seed-001",
    timestamp: "2026-02-18T14:32:00Z",
    to: "engr.kamal@dhanmondi-holdings.bd",
    from: "RentRadar Civic Ledger <onboarding@resend.dev>",
    subject: "[RENTRADAR] Verification Filing Confirmed // VER-2026-104 (RR-DHK-041)",
    eventType: "BADGE_UPGRADED",
    docketRef: "RR-DHK-041",
    deliveryMode: "LOCAL_MIME_LEDGER",
    bodyPreview:
      "Municipal verification approved. Property docket RR-DHK-041 has been stamped with VERIFIED_LANDLORD status following DESCO meter account match.",
    htmlPreview: `
      <div style="font-family: monospace; background: #F7F6F2; padding: 24px; border: 2px solid #0A0A0A;">
        <h2 style="margin: 0 0 12px 0; color: #0A0A0A; text-transform: uppercase;">RENTRADAR CIVIC IDENTITY LEDGER</h2>
        <p style="margin: 0 0 8px 0; font-size: 13px;">SUBMISSION: <strong>VER-2026-104</strong> | DOCKET: <strong>RR-DHK-041</strong></p>
        <p style="margin: 0 0 16px 0; font-size: 14px; color: #15803D; font-weight: bold;">STATUS: BADGE UPGRADED TO VERIFIED_LANDLORD</p>
        <div style="background: #FFFFFF; border: 1px solid #0A0A0A; padding: 12px; font-size: 12px; margin-bottom: 16px;">
          Utility Provider: DESCO | Meter Token Match: 100% | Holding Tax ID: Matched DNCC
        </div>
        <p style="font-size: 11px; color: #52525B; margin: 0;">ZERO-LLM-LEAK GUARANTEE: Utility meter records were processed in isolated civic vaults and never transmitted to external AI training APIs.</p>
      </div>
    `,
  },
  {
    id: "email-seed-002",
    timestamp: "2026-02-20T09:15:00Z",
    to: "submission-review@rentradar.bd",
    from: "RentRadar Civic Ledger <onboarding@resend.dev>",
    subject: "[RENTRADAR] Discrepancy Flagged // VER-2026-103 (RR-DHK-043)",
    eventType: "DISCREPANCY_FLAGGED",
    docketRef: "RR-DHK-043",
    deliveryMode: "LOCAL_MIME_LEDGER",
    bodyPreview:
      "Audit discrepancy flagged on filing VER-2026-103. DESCO bill service address indicates Tongi holding while listing advertises Bashundhara Block D.",
    htmlPreview: `
      <div style="font-family: monospace; background: #FFF5F5; padding: 24px; border: 2px solid #DC2626;">
        <h2 style="margin: 0 0 12px 0; color: #DC2626; text-transform: uppercase;">MUNICIPAL AUDIT WARNING</h2>
        <p style="margin: 0 0 8px 0; font-size: 13px;">SUBMISSION: <strong>VER-2026-103</strong> | DOCKET: <strong>RR-DHK-043</strong></p>
        <p style="margin: 0 0 16px 0; font-size: 14px; color: #DC2626; font-weight: bold;">STATUS: FLAGGED DISCREPANCY</p>
        <div style="background: #FFFFFF; border: 1px solid #DC2626; padding: 12px; font-size: 12px; margin-bottom: 16px;">
          Discrepancy: Utility bill address is located in Tongi Gazipur, but listing advertises Bashundhara R/A Block D. Photographic collision flagged against registered docket RR-DHK-041.
        </div>
        <p style="font-size: 11px; color: #52525B; margin: 0;">Under Section 420 Penal Code & Premises Rent Control Act 1991, verified holding proof is mandatory.</p>
      </div>
    `,
  },
];

export interface DispatchEmailParams {
  to: string;
  applicantName: string;
  eventType: EmailDispatchRecord["eventType"];
  docketRef: string;
  submissionCode: string;
  grantedTier?: VerificationTier;
  notes?: string;
}

/**
 * Returns all dispatched email receipts currently stored in the runtime ledger.
 */
export function getEmailDispatchLedger(): EmailDispatchRecord[] {
  return [...EMAIL_DISPATCH_LEDGER];
}

/**
 * Dual-Mode Resend Email Dispatcher.
 * Dispatches via Resend REST API when RESEND_API_KEY is configured,
 * and always logs inspectable MIME telemetry into the local verification ledger.
 */
export async function dispatchVerificationEmail(
  params: DispatchEmailParams
): Promise<EmailDispatchRecord> {
  const { to, applicantName, eventType, docketRef, submissionCode, grantedTier, notes } = params;

  let subject = "";
  let headline = "";
  let statusColor = "#0A0A0A";

  if (eventType === "SUBMISSION_RECEIVED") {
    subject = `[RENTRADAR] Verification Filing Received // ${submissionCode} (${docketRef})`;
    headline = "FILING CONFIRMATION: SUBMITTED TO MUNICIPAL AUDITOR QUEUE";
    statusColor = "#FACC15";
  } else if (eventType === "BADGE_UPGRADED") {
    subject = `[RENTRADAR] Verified Landlord Badge Granted // ${submissionCode} (${docketRef})`;
    headline = `OFFICIAL UPGRADE: STAMPED ${grantedTier || "VERIFIED_LANDLORD"}`;
    statusColor = "#15803D";
  } else {
    subject = `[RENTRADAR] Forensic Discrepancy Flagged // ${submissionCode} (${docketRef})`;
    headline = "AUDIT NOTICE: EVIDENCE DISCREPANCY FLAGGED";
    statusColor = "#DC2626";
  }

  const plainTextBody = `
============================================================
RENTRADAR CIVIC IDENTITY LEDGER // MUNICIPAL DISPATCH
============================================================
DATE: ${new Date().toUTCString()}
TO: ${applicantName} <${to}>
EVENT: ${eventType}
SUBMISSION CODE: ${submissionCode}
PROPERTY DOCKET: ${docketRef}
${grantedTier ? `GRANTED TIER: ${grantedTier}\n` : ""}${notes ? `AUDITOR NOTES: ${notes}\n` : ""}
ZERO-LLM-LEAK PRIVACY GUARANTEE:
Your utility meter evidence and municipal holding tax records were processed
in strictly isolated civic storage and were NEVER transmitted to third-party
AI training APIs or public models.

Review this docket online: https://rentradar.bd/verify?docket=${docketRef}
============================================================
  `.trim();

  const htmlPreview = `
    <div style="font-family: 'JetBrains Mono', monospace, sans-serif; background: #F7F6F2; padding: 24px; border: 2px solid #0A0A0A; max-width: 600px; margin: 0 auto; color: #0A0A0A;">
      <div style="background: #0A0A0A; color: #FFFFFF; padding: 12px 16px; margin: -24px -24px 20px -24px;">
        <span style="background: #FACC15; color: #0A0A0A; font-weight: bold; padding: 2px 6px; font-size: 11px;">RENTRADAR CIVIC LEDGER</span>
        <span style="font-size: 11px; margin-left: 8px; color: #A1A1AA;">MUNICIPAL EVIDENCE NOTICE</span>
      </div>

      <h3 style="margin: 0 0 12px 0; color: ${statusColor}; font-size: 16px; font-weight: bold; text-transform: uppercase;">
        ${headline}
      </h3>

      <div style="background: #FFFFFF; border: 1px solid #0A0A0A; padding: 14px; font-size: 12px; margin-bottom: 16px; line-height: 1.6;">
        <div><strong>Applicant:</strong> ${applicantName} (${to})</div>
        <div><strong>Submission Code:</strong> ${submissionCode}</div>
        <div><strong>Property Docket:</strong> ${docketRef}</div>
        ${grantedTier ? `<div><strong>Granted Tier:</strong> <span style="background: #15803D; color: #FFFFFF; padding: 1px 4px; font-weight: bold;">${grantedTier}</span></div>` : ""}
        ${notes ? `<div style="margin-top: 8px; padding-top: 8px; border-top: 1px dashed #E4E2DD;"><strong>Auditor Notes:</strong> ${notes}</div>` : ""}
      </div>

      <div style="background: #F4F4F5; border-left: 3px solid #15803D; padding: 8px 12px; font-size: 11px; color: #3F3F46; margin-bottom: 16px;">
        <strong>ZERO-LLM-LEAK GUARANTEE:</strong> Utility bills and holding tax credentials are processed deterministically in isolated storage and NEVER transmitted to external LLM APIs.
      </div>

      <div style="font-size: 10px; color: #71717A; text-align: center; border-top: 1px solid #E4E2DD; padding-top: 12px;">
        RentRadar Civic Infrastructure • Dhaka / Sylhet / Chattogram • Verified by Municipal Auditors
      </div>
    </div>
  `;

  let deliveryMode: EmailDispatchRecord["deliveryMode"] = "LOCAL_MIME_LEDGER";

  const resendApiKey = process.env.RESEND_API_KEY;
  if (resendApiKey && resendApiKey.startsWith("re_")) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "RentRadar Civic Ledger <onboarding@resend.dev>",
          to: [to],
          subject,
          text: plainTextBody,
          html: htmlPreview,
        }),
      });

      if (res.ok) {
        deliveryMode = "RESEND_CLOUD_API";
      } else {
        console.warn("[ResendDispatcher] Cloud dispatch failed with status:", res.status);
      }
    } catch (err) {
      console.warn("[ResendDispatcher] Resend API call error:", err);
    }
  }

  const record: EmailDispatchRecord = {
    id: `email-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    timestamp: new Date().toISOString(),
    to,
    from: "RentRadar Civic Ledger <onboarding@resend.dev>",
    subject,
    eventType,
    docketRef,
    deliveryMode,
    bodyPreview: plainTextBody.slice(0, 240) + "...",
    htmlPreview,
  };

  EMAIL_DISPATCH_LEDGER.unshift(record);
  return record;
}
