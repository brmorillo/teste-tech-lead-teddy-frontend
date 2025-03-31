import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  userName: string;
  setUserName: (name: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      userName: "",
      setUserName: (name) => set({ userName: name }),
    }),
    {
      name: "user-session", // chave no storage
      getStorage: () => sessionStorage, // armazena em sessionStorage
    }
  )
);
