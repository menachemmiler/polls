import { useEffect, useState } from "react";
import { User, X } from "lucide-react";
import { UserProfile } from "../../types/kartoffelType";
import { kartoffelService } from "../../services/kartoffelService";

interface Props {
  selectedUsers: UserProfile[];
  setSelectedUsers: React.Dispatch<React.SetStateAction<UserProfile[]>>;
}

const UserSearchSection: React.FC<Props> = ({ selectedUsers, setSelectedUsers }) => {
  const [input, setInput] = useState("");
  const [users, setUsers] = useState<UserProfile[]>([]);

  useEffect(() => {
    if (input.length < 2) return setUsers([]);
    const fetch = async () => {
      try {
        const results = await kartoffelService.searchUsers(input);
        setUsers(results);
      } catch {
        setUsers([]);
      }
    };
    fetch();
  }, [input]);

  const handleSelect = (user: UserProfile) => {
    if (!selectedUsers.find((u) => u.id === user.id)) {
      setSelectedUsers((prev) => [...prev, user]);
    }
    setInput("");
    setUsers([]);
  };

  const handleRemove = (id: string) => {
    setSelectedUsers((prev) => prev.filter((u) => u.id !== id));
  };

  return (
    <>
      <div className="relative mb-4">
        <input
          className="w-full border border-blue-500 rounded px-3 py-2 text-sm text-gray-700"
          placeholder="חפש משתמש"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        {users.length > 0 && (
          <div className="absolute z-10 bg-white border border-blue-300 rounded shadow-md mt-1 max-h-48 overflow-y-auto right-0 left-0 top-full">
            {users.map((user) => (
              <div
                key={user.id}
                onClick={() => handleSelect(user)}
                className="flex items-center gap-3 p-3 hover:bg-blue-100 cursor-pointer text-right"
              >
                <User className="w-4 h-4 text-blue-600" />
                <div className="flex-1">
                  <div className="text-sm text-gray-800">{user.fullName}</div>
                  <div className="text-xs text-gray-500">{user.hierarchy}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {selectedUsers.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {selectedUsers.map((user) => (
            <div key={user.id} className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              {user.fullName}
              <X className="w-4 h-4 cursor-pointer" onClick={() => handleRemove(user.id)} />
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default UserSearchSection;
