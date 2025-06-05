import React, { useState } from "react";
import styles from "./InputField.module.css";
import { useLazySVG } from "shared/hooks/useLazySVG";

export enum InputType {
  Text = "text",
  Password = "password",
}

export interface InputFieldProps {
  id: string;
  label: string;
  type: InputType;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  disabled?: boolean;
  hasError?: boolean;
  errorMessage?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  id,
  label,
  type = InputType.Text,
  value,
  onChange,
  placeholder,
  disabled = false,
  hasError = false,
  errorMessage = "Error message",
}) => {
  const [inputType, setInputType] = useState<InputType>(type);

  const eyeClose = useLazySVG("shared/icons/eye-close.svg?react");
  const eyeOpen = useLazySVG("shared/icons/eye-open.svg?react");

  const isPassword = type === InputType.Password;
  const disabledClass = disabled
    ? isPassword
      ? styles.disabledPassword
      : styles.disabledUsername
    : "";

  const togglePasswordVisibility = () => {
    setInputType((prevType) =>
      prevType === InputType.Password ? InputType.Text : InputType.Password
    );
  };

  return (
    <div className={`${styles.inputField} ${disabledClass}`}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      <div className={styles.inputContainer}>
        <input
          id={id}
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`${styles.input} ${hasError ? styles.error : ""}`}
          aria-invalid={hasError}
          aria-describedby={hasError ? `${id}-error` : undefined}
        />
        {isPassword &&
          eyeClose &&
          eyeOpen &&
          (() => {
            const Icon = inputType === InputType.Password ? eyeClose : eyeOpen;
            return (
              <span
                className={`${styles.eyeIcon} ${disabledClass}`}
                onClick={!disabled ? togglePasswordVisibility : undefined}
                aria-label={
                  inputType === InputType.Password
                    ? "Show password"
                    : "Hide password"
                }
              >
                <Icon />
              </span>
            );
          })()}
      </div>
      {hasError && errorMessage && (
        <p className={styles.errorMessage}>{errorMessage}</p>
      )}
    </div>
  );
};

export default InputField;
