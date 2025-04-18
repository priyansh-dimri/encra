# Architecture Decisions

## Server (encra-server)

### 13-04-2025 — Message Storage Strategy

- Decision: Use a flat messages collection instead of embedding inside chatRooms
- Reason: Faster queries, clean pagination, and avoids document bloat.

### 13-04-2025 — Chat Model Structure

- Decision: Keep participants array inside chatRoom instead of referencing chatRooms inside user
- Reason: Simplify getting chats a user is inside and is easy to scale.

### 13-04-2025 — Message Deletion Policy

- Decision: Message deletion is global so delete = delete for both
- Reason: Keep logic simple and align with privacy-first UX

### 13-04-2025 — Stateless JWT based Authentication Token with Cookie based Refresh Token

- Decision: Stateless Access Token is stored in front end memory and Refresh Token is stored in front end cookie
- Reason: Automatic token rotation and protection from XSS of Access Token

### 13-04-2025 — CSRF Protection using csurf

- Decision: Add CSRF Protection for end points which change state of the system like POST. So, CSRF is provided using /auth/csrf-token route
- Reason: Protections against CSRF

### 14-04-2025 — Password Hashing Migration from bcrypt to Argon2

- Decision: Migrate from using bcrypt to argon2 for password hashing
- Reason: Argon2 is more modern and provides maximum protection as compared to bcrypt

### 16-04-2025 — Proper Participants ordering in ChatRoom.js Model

- Decision: Add a hook to sort the participants
- Reason: Improves query performance and avoid duplication of a chat

### 17-04-2025 — Socket.io using JWT Access Token

- Decision: All socket connections require a valid JWT token before establishing connection to the server
- Reason: Only valid users can now connect with the server

### 17-04-2025 — Rate Limiting in socket.io

- Decision: Using `rate-limiter-flexible` module to at most allow 10 events per 5 seconds per user.
- Reason: This prevents spamming by any user

### 17-04-2025 — Hybrid Message and Conversation Deletion: REST + Socket.IO

- Decision: When a message is deleted via REST, emit `message:delete` or `conversation:delete` using socket.io to notify all connected chat participants
- Reason: It helps in combining the reliability of REST and real time UI update features of socket.io

### 17-04-2025 — Cascade Delete all Messages on Conversation deletion

- Decision: Added pre hook to delete all messages related to the conversation ID being deleted
- Reason: Maintains data integrity and removes any condition of unnecessary storage being taken

### 18-04-2025 — Exact matching username search for privacy

- Decision: User search will result at most one result with case insensitive exact username match
- Reason: Respects privacy of users and prevents username harvesting

### 18-04-2025 — Delayed Key delivery via invite

- Decision: Encrypted AES keys are stored in the DBMS and only delivered when recipient accepts the chat invite
- Reason: This avoids unnecessary decryption on client side, and improves user's control over unsolicited chats.

## Client (encra-client)
