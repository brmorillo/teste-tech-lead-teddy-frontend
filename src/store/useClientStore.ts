import { create } from 'zustand';
import { clientService } from '../services/clientService';

interface Client {
  id: string;
  name: string;
  salary: number;
  companyValue: number;
}

interface ClientState {
  clients: Client[];
  fetchClients: () => Promise<void>;
  createClient: (data: Omit<Client, 'id'>) => Promise<void>;
  updateClient: (id: string, data: Omit<Client, 'id'>) => Promise<void>;
  deleteClient: (id: string) => Promise<void>;
}

export const useClientStore = create<ClientState>()((set, get) => ({
  clients: [],
  fetchClients: async () => {
    const response = await clientService.getAllClients();
    set({ clients: response.data });
  },
  createClient: async (data) => {
    const response = await clientService.createClient(data);
    // Alternativamente, poderia chamar fetchClients() novamente:
    // await get().fetchClients();
    set((state) => ({
      clients: [...state.clients, response.data]
    }));
  },
  updateClient: async (id, data) => {
    const response = await clientService.updateClient(id, data);
    set((state) => ({
      clients: state.clients.map(c => c.id === id ? response.data : c)
    }));
  },
  deleteClient: async (id) => {
    await clientService.deleteClient(id);
    set((state) => ({
      clients: state.clients.filter(c => c.id !== id)
    }));
  }
}));
