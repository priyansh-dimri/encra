const SearchBar = () => {
  // Simple input field to search/add new recipient chats.
  return (
    <div style={{ padding: "1rem" }}>
      <input
        type="text"
        placeholder="Start a new chat..."
        style={{ width: "100%" }}
      />
    </div>
  );
};

export default SearchBar;
