import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MailCheck } from "lucide-react";
import { authApi } from "../../services/authApi.js";
import { useAuthStore } from "../../store/authStore.js";

const VerifyOtp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const setUser = useAuthStore((s) => s.setUser);

  const email = location.state?.email;

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [infoMessage, setInfoMessage] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    if (!email) navigate("/register", { replace: true });
  }, [email, navigate]);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);
    try {
      const res = await authApi.verifyEmail({ email, otp });
      setUser(res.data.data.user);
      navigate("/", { replace: true });
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setErrorMessage("");
    setInfoMessage("");
    try {
      await authApi.resendOtp({ email });
      setInfoMessage("A new code has been sent to your email.");
      setResendCooldown(60);
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-8">
            <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
              <MailCheck className="w-6 h-6 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Verify your email</h2>
            {email && <p className="text-gray-600">We sent a 6-digit code to {email}</p>}
          </div>

          {errorMessage && (
            <div className="mb-6 rounded-lg bg-red-50 text-red-700 text-sm px-4 py-3">
              {errorMessage}
            </div>
          )}
          {infoMessage && (
            <div className="mb-6 rounded-lg bg-green-50 text-green-700 text-sm px-4 py-3">
              {infoMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="000000"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              className="w-full text-center text-2xl tracking-[0.5em] py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />

            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Verifying..." : "Verify"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={handleResend}
              disabled={resendCooldown > 0}
              className="text-green-600 hover:text-green-700 font-medium disabled:text-gray-400"
            >
              {resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : "Resend code"}
            </button>
          </div>

          <div className="mt-4 text-center">
            <button
              onClick={() => navigate("/register")}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Back to registration
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;
