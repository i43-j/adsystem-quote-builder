export const GOOGLE_CLIENT_ID =
  "261221329843-j59mr1vc8o63t9b76cp1ahlf2aj6ldmp.apps.googleusercontent.com";

export const N8N_WEBHOOK_URL =
  "https://i43-j.app.n8n.cloud/webhook-test/local-host-test";

export const ALLOWED_USERS: Record<string, string> = {
  "workingforthebigg@gmail.com": "test",
  "malupa.macdaver@shap.edu.ph": "test",
};

export const SALUTATION_OPTIONS = [
  { value: "Sir", label: "Sir" },
  { value: "Ma'am", label: "Ma'am" },
  { value: "Mr.", label: "Mr." },
  { value: "Mrs.", label: "Mrs." },
  { value: "Ms.", label: "Ms." },
];

export const DOWNPAYMENT_OPTIONS = [
  { value: "30", label: "30%" },
  { value: "50", label: "50%" },
  { value: "60", label: "60%" },
  { value: "70", label: "70%" },
  { value: "80", label: "80%" },
  { value: "custom", label: "Custom" },
];
