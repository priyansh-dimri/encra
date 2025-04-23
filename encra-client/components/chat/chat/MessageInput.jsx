import { useTheme } from "@emotion/react";

const MessageInput = () => {
  const theme = useTheme();
  // Bottom input area. Contains:
  // - Text input box (multi-line if needed)
  // - Send button aligned to the right
  return (
    <div
      style={{
        padding: "1rem",
        borderTop: `1px solid ${theme.palette.divider}`,
        display: "flex",
        gap: "1rem",
      }}
    >
      <input type="text" placeholder="Type a message..." style={{ flex: 1 }} />
      <button>Send</button>
    </div>
  );
};

export default MessageInput;
