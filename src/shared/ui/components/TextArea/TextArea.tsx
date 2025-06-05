import React, { useRef, useEffect } from "react";
import styles from "./TextArea.module.css";

export interface TextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  title: string;
  value: string;
  placeholder: string;
  rows: number;
  cols?: number;
  autoResize: boolean;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const TextArea: React.FC<TextAreaProps> = ({
  title,
  value,
  placeholder,
  rows,
  cols,
  autoResize = true,
  onChange,
  ...props
}) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const handleInput = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const cs = getComputedStyle(textareaRef.current);
      const pt = parseFloat(cs.paddingTop);
      const pb = parseFloat(cs.paddingBottom);
      const contentHeight = textareaRef.current.scrollHeight - pt - pb;
      textareaRef.current.style.height = `${contentHeight}px`;
    }
  };

  useEffect(() => {
    if (autoResize) {
      handleInput();
    }
  }, [autoResize, value]);

  return (
    <div className={styles.textareaContainer}>
      <h3 className={styles.title}>{title}</h3>
      <textarea
        ref={textareaRef}
        className={styles.textarea}
        value={value}
        placeholder={placeholder}
        rows={rows}
        cols={cols}
        onInput={handleInput}
        onChange={onChange}
        {...props}
      />
    </div>
  );
};
export default TextArea;
