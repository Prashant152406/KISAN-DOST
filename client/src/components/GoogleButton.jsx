import { useEffect, useRef } from "react";

/**
 * Renders Google's official Sign-In button via Google Identity Services (GIS).
 * Requires the GIS script in index.html:
 *   <script src="https://accounts.google.com/gsi/client" async defer></script>
 *
 * onCredential receives the raw ID token to send to POST /api/auth/google.
 * The backend verifies it server-side — this component never decodes it.
 */
export default function GoogleButton({ onCredential, disabled }) {
  const buttonRef = useRef(null);

  useEffect(() => {
    if (disabled) return;
    if (!window.google || !buttonRef.current) return;

    window.google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: (response) => onCredential(response.credential),
    });

    window.google.accounts.id.renderButton(buttonRef.current, {
      theme: "outline",
      size: "large",
      width: buttonRef.current.offsetWidth,
      text: "continue_with",
    });
  }, [onCredential, disabled]);

  if (!import.meta.env.VITE_GOOGLE_CLIENT_ID) return null;

  return <div ref={buttonRef} className="w-full flex justify-center" />;
}
