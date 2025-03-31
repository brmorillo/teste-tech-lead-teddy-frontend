import api from "./api";

interface Client {
  id: string;
  name: string;
  salary: number;
  companyValue: number;
}

interface CreateClientDto {
  name: string;
  salary: number;
  companyValue: number;
}

interface UpdateClientDto {
  name: string;
  salary: number;
  companyValue: number;
}

const getAllClients = () => api.get<Client[]>("/client");
const createClient = (data: CreateClientDto) =>
  api.post<Client>("/client", data);
const updateClient = (id: string, data: UpdateClientDto) =>
  api.put<Client>(`/client/${id}`, data);
const deleteClient = (id: string) => api.delete(`/client/${id}`);

export const clientService = {
  getAllClients,
  createClient,
  updateClient,
  deleteClient,
};
