/* eslint-disable @typescript-eslint/no-explicit-any */

interface GoogleCredentialResponse {
  credential: string;
  select_by: string;
}

interface GoogleAccountsId {
  initialize: (config: {
    client_id: string;
    callback: (response: GoogleCredentialResponse) => void;
    auto_select?: boolean;
  }) => void;
  renderButton: (
    element: HTMLElement,
    config: {
      theme?: string;
      size?: string;
      width?: number;
      text?: string;
      shape?: string;
      logo_alignment?: string;
    }
  ) => void;
  prompt: () => void;
  disableAutoSelect: () => void;
}

export function getGoogleAccountsId(): GoogleAccountsId | null {
  const w = window as any;
  return w.google?.accounts?.id ?? null;
}
