import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Shield } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { getGoogleAccountsId } from "@/lib/google-auth";
import adsystemsLogo from "@/assets/adsystems-logo.png";

export function LoginScreen() {
  const { error } = useAuth();
  const googleBtnRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const renderButton = () => {
      const gsi = getGoogleAccountsId();
      if (gsi && googleBtnRef.current) {
        googleBtnRef.current.innerHTML = "";
        gsi.renderButton(googleBtnRef.current, {
          theme: "outline",
          size: "large",
          width: 320,
          text: "signin_with",
          shape: "rectangular",
          logo_alignment: "left",
        });
      }
    };

    renderButton();
    const interval = setInterval(() => {
      if (getGoogleAccountsId() && googleBtnRef.current) {
        renderButton();
        clearInterval(interval);
      }
    }, 300);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-accent/5 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative w-full max-w-md"
      >
        <div className="bg-card rounded-2xl shadow-lg border border-border/50 p-8 md:p-10">
          {/* Logo / Brand */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="inline-flex items-center justify-center w-20 h-20 mb-4"
            >
              <img
                src={adsystemsLogo}
                alt="Adsystems logo"
                className="w-full h-full object-contain"
              />
            </motion.div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">
              Adsystem Tools
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Sign in to continue
            </p>
          </div>

          {/* Google Sign-In Button */}
          <div className="flex flex-col items-center gap-4">
            <div ref={googleBtnRef} className="flex justify-center min-h-[44px]" />

            {/* Error message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm text-center"
              >
                {error}
              </motion.div>
            )}
          </div>

          {/* Footer */}
          <div className="mt-8 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
            <Shield className="w-3.5 h-3.5" />
            <span>Authorized personnel only</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}