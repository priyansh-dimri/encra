const MessagesArea = () => {
  // Scrollable container for chat messages
  // Only supports text messages for now
  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "1rem" }}>
      {/* Messages go here, aligned left/right depending on sender */}
    </div>
  );
};

export default MessagesArea;
