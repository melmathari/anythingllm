import React, { useEffect, useState } from "react";
import System from "../../../models/system";
import { AUTH_TOKEN } from "../../../utils/constants";
import paths from "../../../utils/paths";
import ModalWrapper from "@/components/ModalWrapper";
import { useModal } from "@/hooks/useModal";
import RecoveryCodeModal from "@/components/Modals/DisplayRecoveryCodeModal";
import { useTranslation } from "react-i18next";

export default function SingleUserAuth({ loginLogo }) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [recoveryCodes, setRecoveryCodes] = useState([]);
  const [downloadComplete, setDownloadComplete] = useState(false);
  const [token, setToken] = useState(null);

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
    const { valid, token, message, recoveryCodes } =
      await System.requestToken(data);
    if (valid && !!token) {
      setToken(token);
      if (recoveryCodes) {
        setRecoveryCodes(recoveryCodes);
        openRecoveryCodeModal();
      } else {
        window.localStorage.setItem(AUTH_TOKEN, token);
        window.location = paths.home();
      }
    } else {
      setError(message);
      setLoading(false);
    }
    setLoading(false);
  };

  const handleDownloadComplete = () => {
    setDownloadComplete(true);
  };

  useEffect(() => {
    if (downloadComplete && token) {
      window.localStorage.setItem(AUTH_TOKEN, token);
      window.location = paths.home();
    }
  }, [downloadComplete, token]);

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
                Password
              </label>
              <input
                name="password"
                type="password"
                placeholder="Enter your password"
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
          <div className="w-full mt-8">
            <button
              disabled={loading}
              type="submit"
              className="w-full h-12 md:h-11 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? t("login.multi-user.validating")
                : t("login.multi-user.login")}
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
