import React, { useEffect, useState } from "react";
import System from "../../../models/system";
import { AUTH_TOKEN, AUTH_USER } from "../../../utils/constants";
import paths from "../../../utils/paths";
import showToast from "@/utils/toast";
import ModalWrapper from "@/components/ModalWrapper";
import { useModal } from "@/hooks/useModal";
import RecoveryCodeModal from "@/components/Modals/DisplayRecoveryCodeModal";
import { useTranslation } from "react-i18next";
import { t } from "i18next";

const RecoveryForm = ({ onSubmit, setShowRecoveryForm, loginLogo }) => {
  const [username, setUsername] = useState("");
  const [recoveryCodeInputs, setRecoveryCodeInputs] = useState(
    Array(2).fill("")
  );

  const handleRecoveryCodeChange = (index, value) => {
    const updatedCodes = [...recoveryCodeInputs];
    updatedCodes[index] = value;
    setRecoveryCodeInputs(updatedCodes);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const recoveryCodes = recoveryCodeInputs.filter(
      (code) => code.trim() !== ""
    );
    onSubmit(username, recoveryCodes);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-center relative rounded-2xl bg-theme-bg-secondary md:shadow-[0_4px_14px_rgba(0,0,0,0.25)] p-8 md:p-12 w-full max-w-md mx-auto"
    >
      {/* Logo Section */}
      <div className="flex items-center justify-center mb-8">
        <img
          src={loginLogo}
          alt="Logo"
          className="w-auto h-8 md:h-10"
          style={{ objectFit: "contain" }}
        />
      </div>

      {/* Input Fields Group */}
      <div className="w-full space-y-6">
        <div className="space-y-2">
          <label className="block text-white text-sm font-medium">
            {t("login.multi-user.placeholder-username")}
          </label>
          <input
            name="username"
            type="text"
            placeholder={t("login.multi-user.placeholder-username")}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full h-12 md:h-11 px-4 py-3 border-none bg-theme-settings-input-bg text-theme-text-primary placeholder:text-theme-settings-input-placeholder focus:outline-primary-button active:outline-primary-button outline-none text-sm rounded-lg"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="block text-white text-sm font-medium">
            {t("login.password-reset.recovery-codes")}
          </label>
          {recoveryCodeInputs.map((code, index) => (
            <input
              key={index}
              type="text"
              name={`recoveryCode${index + 1}`}
              placeholder={t("login.password-reset.recovery-code", {
                index: index + 1,
              })}
              value={code}
              onChange={(e) => handleRecoveryCodeChange(index, e.target.value)}
              className="w-full h-12 md:h-11 px-4 py-3 border-none bg-theme-settings-input-bg text-theme-text-primary placeholder:text-theme-settings-input-placeholder focus:outline-primary-button active:outline-primary-button outline-none text-sm rounded-lg"
              required
            />
          ))}
        </div>
      </div>
      {/* Button Section */}
      <div className="w-full mt-8">
        <button
          type="submit"
          className="w-full h-12 md:h-11 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:ring-offset-2"
        >
          {t("login.password-reset.title")}
        </button>
        <button
          type="button"
          className="w-full mt-4 text-white text-sm hover:text-primary-button hover:underline"
          onClick={() => setShowRecoveryForm(false)}
        >
          {t("login.password-reset.back-to-login")}
        </button>
      </div>
    </form>
  );
};

const ResetPasswordForm = ({ onSubmit, loginLogo }) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(newPassword, confirmPassword);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-center relative rounded-2xl bg-theme-bg-secondary md:shadow-[0_4px_14px_rgba(0,0,0,0.25)] p-8 md:p-12 w-full max-w-md mx-auto"
    >
      {/* Logo Section */}
      <div className="flex items-center justify-center mb-8">
        <img
          src={loginLogo}
          alt="Logo"
          className="w-auto h-8 md:h-10"
          style={{ objectFit: "contain" }}
        />
      </div>

      {/* Input Fields Group */}
      <div className="w-full space-y-6">
        <div className="space-y-2">
          <label className="block text-white text-sm font-medium">
            New Password
          </label>
          <input
            type="password"
            name="newPassword"
            placeholder="Enter your new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full h-12 md:h-11 px-4 py-3 border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder focus:outline-primary-button active:outline-primary-button outline-none text-sm rounded-lg"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="block text-white text-sm font-medium">
            Confirm Password
          </label>
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm your new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full h-12 md:h-11 px-4 py-3 border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder focus:outline-primary-button active:outline-primary-button outline-none text-sm rounded-lg"
            required
          />
        </div>
      </div>
      {/* Button Section */}
      <div className="w-full mt-8">
        <button
          type="submit"
          className="w-full h-12 md:h-11 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:ring-offset-2"
        >
          Reset Password
        </button>
      </div>
    </form>
  );
};

export default function MultiUserAuth({ loginLogo }) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [recoveryCodes, setRecoveryCodes] = useState([]);
  const [downloadComplete, setDownloadComplete] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [showRecoveryForm, setShowRecoveryForm] = useState(false);
  const [showResetPasswordForm, setShowResetPasswordForm] = useState(false);

  const {
    isOpen: isRecoveryCodeModalOpen,
    openModal: openRecoveryCodeModal,
    closeModal: closeRecoveryCodeModal,
  } = useModal();

  const handleLogin = async (e) => {
    setError(null);
    setLoading(true);
    e.preventDefault();
    const data = {};
    const form = new FormData(e.target);
    for (var [key, value] of form.entries()) data[key] = value;
    const { valid, user, token, message, recoveryCodes } =
      await System.requestToken(data);
    if (valid && !!token && !!user) {
      setUser(user);
      setToken(token);

      if (recoveryCodes) {
        setRecoveryCodes(recoveryCodes);
        openRecoveryCodeModal();
      } else {
        window.localStorage.setItem(AUTH_USER, JSON.stringify(user));
        window.localStorage.setItem(AUTH_TOKEN, token);
        window.location = paths.home();
      }
    } else {
      setError(message);
      setLoading(false);
    }
    setLoading(false);
  };

  const handleDownloadComplete = () => setDownloadComplete(true);
  const handleResetPassword = () => setShowRecoveryForm(true);
  const handleRecoverySubmit = async (username, recoveryCodes) => {
    const { success, resetToken, error } = await System.recoverAccount(
      username,
      recoveryCodes
    );

    if (success && resetToken) {
      window.localStorage.setItem("resetToken", resetToken);
      setShowRecoveryForm(false);
      setShowResetPasswordForm(true);
    } else {
      showToast(error, "error", { clear: true });
    }
  };

  const handleResetSubmit = async (newPassword, confirmPassword) => {
    const resetToken = window.localStorage.getItem("resetToken");

    if (resetToken) {
      const { success, error } = await System.resetPassword(
        resetToken,
        newPassword,
        confirmPassword
      );

      if (success) {
        window.localStorage.removeItem("resetToken");
        setShowResetPasswordForm(false);
        showToast("Password reset successful", "success", { clear: true });
      } else {
        showToast(error, "error", { clear: true });
      }
    } else {
      showToast("Invalid reset token", "error", { clear: true });
    }
  };

  useEffect(() => {
    if (downloadComplete && user && token) {
      window.localStorage.setItem(AUTH_USER, JSON.stringify(user));
      window.localStorage.setItem(AUTH_TOKEN, token);
      window.location = paths.home();
    }
  }, [downloadComplete, user, token]);

  if (showRecoveryForm) {
    return (
      <RecoveryForm
        onSubmit={handleRecoverySubmit}
        setShowRecoveryForm={setShowRecoveryForm}
        loginLogo={loginLogo}
      />
    );
  }

  if (showResetPasswordForm) {
    return (
      <ResetPasswordForm onSubmit={handleResetSubmit} loginLogo={loginLogo} />
    );
  }
  return (
    <>
      <form onSubmit={handleLogin}>
        <div className="flex flex-col items-center relative rounded-2xl bg-theme-bg-secondary md:shadow-[0_4px_14px_rgba(0,0,0,0.25)] p-8 md:p-12 w-full max-w-md mx-auto">
          {/* Logo Section */}
          <div className="flex items-center justify-center mb-8">
            <img
              src={loginLogo}
              alt="Logo"
              className="w-auto h-8 md:h-10"
              style={{ objectFit: "contain" }}
            />
          </div>

          {/* Input Fields Group */}
          <div className="w-full space-y-6">
            <div className="space-y-2">
              <label className="block text-white text-sm font-medium">
                {t("login.multi-user.placeholder-username")}
              </label>
              <input
                name="username"
                type="text"
                placeholder={t("login.multi-user.placeholder-username")}
                className="w-full h-12 md:h-11 px-4 py-3 border-none bg-theme-settings-input-bg text-theme-text-primary placeholder:text-theme-settings-input-placeholder focus:outline-primary-button active:outline-primary-button outline-none text-sm rounded-lg"
                required={true}
                autoComplete="off"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-white text-sm font-medium">
                {t("login.multi-user.placeholder-password")}
              </label>
              <input
                name="password"
                type="password"
                placeholder={t("login.multi-user.placeholder-password")}
                className="w-full h-12 md:h-11 px-4 py-3 border-none bg-theme-settings-input-bg text-theme-text-primary placeholder:text-theme-settings-input-placeholder focus:outline-primary-button active:outline-primary-button outline-none text-sm rounded-lg"
                required={true}
                autoComplete="off"
              />
            </div>

            {error && (
              <p className="text-red-400 text-sm text-center">{error}</p>
            )}
          </div>

          {/* Button Section */}
          <div className="w-full mt-8 space-y-4">
            <button
              disabled={loading}
              type="submit"
              className="w-full h-12 md:h-11 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? t("login.multi-user.validating")
                : t("login.multi-user.login")}
            </button>
            <button
              type="button"
              className="w-full text-white text-sm text-center hover:text-primary-button hover:underline"
              onClick={handleResetPassword}
            >
              {t("login.multi-user.forgot-pass")}?
              <b> {t("login.multi-user.reset")}</b>
            </button>
          </div>
        </div>
      </form>

      <ModalWrapper isOpen={isRecoveryCodeModalOpen} noPortal={true}>
        <RecoveryCodeModal
          recoveryCodes={recoveryCodes}
          onDownloadComplete={handleDownloadComplete}
          onClose={closeRecoveryCodeModal}
        />
      </ModalWrapper>
    </>
  );
}
