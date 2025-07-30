# Permissions Service

This service manages access control for polls. It provides endpoints to check and modify permissions for users on specific polls, including access, editing rights, ownership, and publication status.

## Object Structure

### IPermission

- `pollId`: string - The ID of the poll.
- `accessIds`: string[] - List of user IDs with access permission.
- `access`: boolean - Indicates if access is granted.
- `editorIds`: string[] - List of user IDs with editor permission.
- `editor`: boolean - Indicates if editing is allowed.
- `owner`: string - Current owner of the poll.
- `newOwner`: string - Proposed new owner.
- `publish`: boolean - Indicates if the poll is published.

### PermissionDocument

- Inherits from IPermission and adds:
- `_id`: string - Unique identifier for the permission document.

## API Endpoints

### POST /api/permissions/:pollId/:userId

- Create a permission entry for a user on a poll.

### GET /api/permissions/polls/:userId

- Retrieve all polls associated with a user.
- Optional query parameters: `step`, `limit`, `owner`, `editor`.

### GET /api/permissions/:pollId

- Retrieve all permissions for a specific poll.

### GET /api/permissions/:pollId/:userId

- Retrieve a user's permission level for a specific poll.
- Query parameter: `level` (access or editor).

### PUT /api/permissions/:pollId

- Update permissions for all users on a poll.
- Query parameters: `level`, `permission`.

### PUT /api/permissions/:pollId/:userId

- Update a specific user's permission on a poll.
- Query parameters: `level`, `action`.

### PUT /api/permissions/owner/accept/:pollId

- Accept ownership of a poll.

### PUT /api/permissions/owner/:pollId

- Reject or remove ownership of a poll.

### PUT /api/permissions/owner/:pollId/:userId

- Assign a new owner to a poll.

### PUT /api/permissions/publish/:pollId

- Update the publish status of a poll.

### GET /api/permissions/publish/:pollId

- Retrieve the publish status of a poll.

### DELETE /api/permissions/:pollId

- Delete all permissions associated with a poll.
