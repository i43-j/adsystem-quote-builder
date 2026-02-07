# Removing "Continue in Preview Mode"

## What was Preview Mode?

Preview Mode (aka Demo Mode) allowed anyone to bypass Google OAuth and log in as a demo user (`workingforthebigg@gmail.com` / `test` branch) without a real Google account. This was useful during development but should be removed for production.

## What was changed

### `src/components/LoginScreen.tsx`

The following were **removed**:

1. **The `Button` import** — no longer needed since the preview button is gone.
2. **The `loginAsDemo` function** — previously destructured from `useAuth()`.
3. **The "or" divider** — the horizontal line with "or" text between the Google button and preview button.
4. **The "Continue in Preview Mode" button** — the `<Button>` that called `loginAsDemo()`.

### `src/contexts/AuthContext.tsx` (optional cleanup)

The `loginAsDemo` function still exists in `AuthContext.tsx`. If you want to fully remove it:

1. Open `src/contexts/AuthContext.tsx`
2. Delete the `loginAsDemo` callback (around lines 123-135):
   ```tsx
   // DELETE THIS BLOCK
   const loginAsDemo = useCallback(() => {
     const demoUser: AuthUser = {
       email: "workingforthebigg@gmail.com",
       name: "Demo User",
       picture: "",
       branch: "test",
     };
     localStorage.setItem("userEmail", demoUser.email);
     localStorage.setItem("branch", demoUser.branch);
     localStorage.setItem("userName", demoUser.name);
     setUser(demoUser);
     setError(null);
   }, []);
   ```
3. Remove `loginAsDemo` from the `AuthContextType` interface:
   ```tsx
   // Remove this line from the interface
   loginAsDemo: () => void;
   ```
4. Remove `loginAsDemo` from the context provider value:
   ```tsx
   // Change this:
   <AuthContext.Provider value={{ user, isLoading, error, logout, loginAsDemo }}>
   // To this:
   <AuthContext.Provider value={{ user, isLoading, error, logout }}>
   ```

## Why keep `loginAsDemo` in AuthContext?

You may choose to keep it if:
- You want to re-enable preview mode later for demos or testing
- Other parts of the codebase might reference it

If no code references `loginAsDemo` anymore, it's safe to remove for a cleaner codebase.

## Google OAuth Notes

For Google Sign-In to work in production, make sure your deployed domain is added to **Authorized JavaScript Origins** in your [Google Cloud Console](https://console.cloud.google.com/apis/credentials):

1. Go to **APIs & Services → Credentials**
2. Click your OAuth 2.0 Client ID
3. Under **Authorized JavaScript origins**, add your production URL (e.g., `https://yourdomain.com`)
4. Save and wait a few minutes for changes to propagate
