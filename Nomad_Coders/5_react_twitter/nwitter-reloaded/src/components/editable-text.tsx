import { ChangeEvent } from "react";
import { styled } from "styled-components";

interface EditableTextProps {
  fontSize: number;
  rows: number;
  maxLength: number;
  isEditMode: boolean;
  currentText: string;
  onTextChange: (newText: string) => void;
  isLoading: boolean;
}

const Payload = styled.p<{ fontSize: string }>`
  margin: 10px 5px;
  font-size: ${(props) => props.fontSize};
`;

const EditMessage = styled.textarea<{ fontSize: string }>`
  border: 0.5 solid rgba(255, 255, 255, 1);
  margin: 5px 0;
  padding: 5px 5px;
  border-radius: 5px;
  font-size: ${(props) => props.fontSize};
  color: white;
  background-color: black;
  width: 100%;
  resize: none;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  &:focus {
    outline: none;
    border-color: #1d9bf0;
  }
  &:disabled {
    background-color: gray;
  }
`;

export default function EditableText({
  fontSize,
  rows,
  maxLength,
  isEditMode,
  currentText,
  onTextChange,
  isLoading = false,
}: EditableTextProps) {
  const onEditedTextChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const newText = event.target.value;
    onTextChange(newText); // 외부로 변경사항 전달
  };

  return (
    <>
      {isEditMode ? (
        <EditMessage
          fontSize={`${fontSize}px`}
          maxLength={maxLength}
          rows={rows}
          onChange={onEditedTextChange}
          value={currentText}
          disabled={isLoading}
        />
      ) : (
        <Payload fontSize={`${fontSize}px`}>{currentText}</Payload>
      )}
    </>
  );
}
