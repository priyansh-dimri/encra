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

## Client (encra-client)
