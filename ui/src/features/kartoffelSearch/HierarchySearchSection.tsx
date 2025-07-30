import { useEffect, useState } from "react";
import { GroupEntity } from "../../types/kartoffelType";
import { kartoffelService } from "../../services/kartoffelService";
import { Users, X } from "lucide-react";

interface Props {
  selectedGroup: GroupEntity | null;
  setSelectedGroup: React.Dispatch<React.SetStateAction<GroupEntity | null>>;
}

const HierarchySearchSection: React.FC<Props> = ({ selectedGroup, setSelectedGroup }) => {
  const [input, setInput] = useState("");
  const [groups, setGroups] = useState<GroupEntity[]>([]);

  useEffect(() => {
    if (input.length < 2 || selectedGroup) return setGroups([]);
    const fetch = async () => {
      try {
        const results = await kartoffelService.searchGroups(input);
        setGroups(results);
      } catch {
        setGroups([]);
      }
    };
    fetch();
  }, [input, selectedGroup]);

  return (
    <div className="relative mb-6">
      <input
        className="w-full border border-blue-500 rounded px-3 py-2 text-sm text-gray-700"
        placeholder="חפש לפי היררכיה"
        value={selectedGroup ? `${selectedGroup.hierarchy}/${selectedGroup.name}` : input}
        onChange={(e) => {
          setSelectedGroup(null);
          setInput(e.target.value);
        }}
        disabled={!!selectedGroup}
      />
      {selectedGroup && (
        <button
          className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800"
          onClick={() => {
            setSelectedGroup(null);
            setInput("");
          }}
        >
          <X className="w-4 h-4" />
        </button>
      )}
      {groups.length > 0 && !selectedGroup && (
        <div className="absolute right-0 left-0 top-full z-10 bg-white border border-blue-300 rounded shadow-md mt-1 max-h-48 overflow-y-auto">
          {groups.map((group) => (
            <div
              key={group.id}
              onClick={() => {
                setSelectedGroup(group);
                setInput("");
                setGroups([]);
              }}
              className="flex items-center gap-3 p-3 hover:bg-blue-100 cursor-pointer text-right"
            >
              <Users className="w-4 h-4 text-blue-600" />
              <span className="text-sm text-gray-800 flex-1">{`${group.hierarchy}/${group.name}`}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HierarchySearchSection;
