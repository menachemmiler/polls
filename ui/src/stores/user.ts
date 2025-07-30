import { create } from "zustand";
import { IShragaUser } from "../types/survey";

export interface UserState {
  user: IShragaUser;
  setUser: (user: UserState["user"]) => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: {
    _id: "",
    id: "",
    adfsId: "",
    genesisId: "",
    name: { firstName: "", lastName: "" },
    email: "",
    displayName: "",
    upn: "",
    provider: "",
    personalNumber: "",
    entityType: "",
    job: "",
    phoneNumbers: [],
    photo: "",
    identityCard: "",
  },
  setUser: (user) => set({ user }),
}));
