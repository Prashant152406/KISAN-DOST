import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, Monitor, LogOut, Lock, Eye, EyeOff } from "lucide-react";
import { authApi } from "../../services/authApi.js";
import { useAuthStore } from "../../store/authStore.js";

function Section({ title, icon, children }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        {icon}
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function ChangePasswordForm() {
  const user = useAuthStore((s) => s.user);
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  if (!user?.authProviders?.local) {
    return (
      <p className="text-sm text-gray-600">
        Your account is signed in through Google, so there's no password to
        change here.
      </p>
    );
  }

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setFieldErrors({});
    setLoading(true);
    try {
      await authApi.changePassword(form);
      setSuccessMessage("Password changed. You've been logged out of other devices.");
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      if (err.code === "VALIDATION_ERROR") {
        const mapped = {};
        err.errors.forEach((fe) => (mapped[fe.field] = fe.message));
        setFieldErrors(mapped);
      } else {
        setErrorMessage(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errorMessage && (
        <div className="rounded-lg bg-red-50 text-red-700 text-sm px-4 py-3">{errorMessage}</div>
      )}
      {successMessage && (
        <div className="rounded-lg bg-green-50 text-green-700 text-sm px-4 py-3">{successMessage}</div>
      )}

      {[
        { name: "currentPassword", placeholder: "Current password", autoComplete: "current-password" },
        { name: "newPassword", placeholder: "New password", autoComplete: "new-password" },
        { name: "confirmPassword", placeholder: "Confirm new password", autoComplete: "new-password" },
      ].map((f) => (
        <div key={f.name}>
          <div className="relative">
            <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              name={f.name}
              placeholder={f.placeholder}
              value={form[f.name]}
              onChange={handleChange}
              required
              autoComplete={f.autoComplete}
              className="w-full pl-10 pr-12 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            {f.name === "currentPassword" && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            )}
          </div>
          {fieldErrors[f.name] && <p className="mt-1 text-sm text-red-600">{fieldErrors[f.name]}</p>}
        </div>
      ))}

      <button
        type="submit"
        disabled={loading}
        className="bg-green-600 hover:bg-green-700 text-white py-2.5 px-5 rounded-lg font-medium transition-colors disabled:opacity-50"
      >
        {loading ? "Updating..." : "Update password"}
      </button>
    </form>
  );
}

function SessionsList() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const logoutAll = useAuthStore((s) => s.logoutAll);
  const navigate = useNavigate();

  const load = async () => {
    setLoading(true);
    try {
      const res = await authApi.getSessions();
      setSessions(res.data.data.sessions);
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleRevoke = async (id) => {
    try {
      await authApi.revokeSession(id);
      setSessions((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  const handleLogoutAll = async () => {
    await logoutAll();
    navigate("/login");
  };

  if (loading) return <p className="text-sm text-gray-500">Loading sessions…</p>;

  return (
    <div>
      {errorMessage && <p className="text-sm text-red-600 mb-3">{errorMessage}</p>}
      <div className="space-y-3">
        {sessions.map((s) => (
          <div
            key={s.id}
            className="flex items-center justify-between rounded-lg border border-gray-200 p-4"
          >
            <div>
              <p className="font-medium text-gray-900">
                {s.browser} on {s.os}
                {s.isCurrent && (
                  <span className="ml-2 text-xs font-medium text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                    This device
                  </span>
                )}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Last active {new Date(s.lastActiveAt).toLocaleString()} · {s.ipAddress}
              </p>
            </div>
            {!s.isCurrent && (
              <button
                onClick={() => handleRevoke(s.id)}
                className="text-sm text-red-600 hover:text-red-700"
              >
                Revoke
              </button>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={handleLogoutAll}
        className="mt-4 flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-700"
      >
        <LogOut className="w-4 h-4" />
        Log out of all devices
      </button>
    </div>
  );
}

export default function Profile() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  if (!user) return null; // ProtectedRoute handles the redirect

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center overflow-hidden">
              {user.profileImage ? (
                <img src={user.profileImage} alt={user.name} className="h-full w-full object-cover" />
              ) : (
                <User className="w-8 h-8 text-green-600" />
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
              <p className="text-gray-600 flex items-center gap-1">
                <Mail className="w-4 h-4" /> {user.email}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-600 hover:text-red-700 font-medium"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>

        <Section title="Account" icon={<User className="w-5 h-5 text-green-600" />}>
          <dl className="grid grid-cols-2 gap-y-3 text-sm">
            <dt className="text-gray-500">Signed in with</dt>
            <dd className="text-gray-900">
              {user.authProviders?.google && user.authProviders?.local
                ? "Email & Google"
                : user.authProviders?.google
                ? "Google"
                : "Email & password"}
            </dd>
            <dt className="text-gray-500">Email verified</dt>
            <dd className="text-gray-900">{user.isEmailVerified ? "Yes" : "No"}</dd>
            <dt className="text-gray-500">Role</dt>
            <dd className="text-gray-900 capitalize">{user.role}</dd>
          </dl>
        </Section>

        <Section title="Password" icon={<Lock className="w-5 h-5 text-green-600" />}>
          <ChangePasswordForm />
        </Section>

        <Section title="Active sessions" icon={<Monitor className="w-5 h-5 text-green-600" />}>
          <SessionsList />
        </Section>
      </div>
    </div>
  );
}
