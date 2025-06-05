import React, { useState } from "react";
import Button from "shared/ui/components/Button/Button";
import { signInWithGoogle } from "features/auth/model/authService";
import { useNavigate } from "react-router-dom";

import styles from "./WelcomePage.module.css";
import { useLazySVG } from "shared/hooks/useLazySVG";

interface WelcomePageProps {}

const WelcomePage: React.FC<WelcomePageProps> = ({}) => {
  const [hasError, setHasError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const navigate = useNavigate();

  const GoogleIcon = useLazySVG("shared/icons/google.svg?react");
  const LogoIcon = useLazySVG("shared/icons/logo.svg?react");

  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
      setHasError(false);
      navigate("/weekView");
    } catch (error) {
      setHasError(true);
      console.error("Can't signing in with Google");
      setErrorMessage("Can't sinning in with Google. Try again.");
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        {LogoIcon && (
          <div className={styles.logo}>
            <LogoIcon />
          </div>
        )}
        <div className={styles.button}>
          <Button variant="secondary" onClick={handleSignIn}>
            {GoogleIcon && <GoogleIcon />}
            Continue with Google
          </Button>
        </div>
        {hasError && errorMessage && (
          <p className={styles.errorMessage}>{errorMessage}</p>
        )}
      </div>
    </div>
  );
};
export default WelcomePage;
