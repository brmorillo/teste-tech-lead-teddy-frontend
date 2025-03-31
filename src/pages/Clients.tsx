import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { useClientStore } from "../store/useClientStore";
import Modal from "../components/Modal";
import ClientCard from "../components/ClientCard";

function ClientsPage() {
  const userName = useAuthStore((state) => state.userName);
  const { clients, fetchClients, createClient, updateClient, deleteClient } =
    useClientStore();

  // Estados locais para controle de modais e formulários
  const [modalType, setModalType] = useState<
    "create" | "edit" | "delete" | null
  >(null);
  const [currentClient, setCurrentClient] = useState<null | {
    id: string;
    name: string;
    salary: number;
    companyValue: number;
  }>(null);
  const [formData, setFormData] = useState({
    name: "",
    salary: "",
    companyValue: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  // Buscar lista de clientes ao montar o componente (se usuário logado)
  useEffect(() => {
    if (userName) {
      fetchClients();
    }
  }, [userName, fetchClients]);

  // Se não há usuário em sessão, redireciona de volta para login
  if (!userName) {
    return <Navigate to="/" replace />;
  }

  // Paginação: calcula índices e fatia da lista de acordo com a página atual
  const totalPages = Math.ceil(clients.length / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const displayedClients = clients.slice(startIndex, startIndex + pageSize);

  // Funções para abrir cada modal, ajustando estado conforme ação
  const openCreateModal = () => {
    setCurrentClient(null);
    setFormData({ name: "", salary: "", companyValue: "" });
    setModalType("create");
  };
  const openEditModal = (client: {
    id: string;
    name: string;
    salary: number;
    companyValue: number;
  }) => {
    setCurrentClient(client);
    // Preenche formulário com dados do cliente selecionado
    setFormData({
      name: client.name,
      salary: String(client.salary),
      companyValue: String(client.companyValue),
    });
    setModalType("edit");
  };
  const openDeleteModal = (client: {
    id: string;
    name: string;
    salary: number;
    companyValue: number;
  }) => {
    setCurrentClient(client);
    setModalType("delete");
  };

  // Submissão do formulário de criar/editar
  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (modalType === "create") {
      await createClient({
        name: formData.name,
        salary: parseFloat(formData.salary),
        companyValue: parseFloat(formData.companyValue),
      });
    } else if (modalType === "edit" && currentClient) {
      await updateClient(currentClient.id, {
        name: formData.name,
        salary: parseFloat(formData.salary),
        companyValue: parseFloat(formData.companyValue),
      });
    }
    setModalType(null); // fecha o modal após a operação
  };

  // Confirmação de exclusão
  const handleConfirmDelete = async () => {
    if (currentClient) {
      await deleteClient(currentClient.id);
    }
    setModalType(null);
  };

  return (
    <div className="p-6">
      {/* Cabeçalho: saudação e botão de adicionar cliente */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Olá, {userName}!</h2>
        <button
          onClick={openCreateModal}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Adicionar Cliente
        </button>
      </div>

      {/* Lista de clientes em cards */}
      {clients.length === 0 ? (
        <p className="text-gray-500">Nenhum cliente cadastrado.</p>
      ) : (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayedClients.map((client) => (
              <ClientCard
                key={client.id}
                client={client}
                onEdit={() => openEditModal(client)}
                onDelete={() => openDeleteModal(client)}
              />
            ))}
          </div>
          {/* Controles de paginação */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-4 space-x-2">
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Anterior
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 border rounded ${
                      page === currentPage ? "bg-blue-500 text-white" : ""
                    }`}
                  >
                    {page}
                  </button>
                )
              )}
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Próxima
              </button>
            </div>
          )}
        </div>
      )}

      {/* Modal reutilizável para criar, editar ou excluir */}
      <Modal
        isOpen={modalType !== null}
        title={
          modalType === "create"
            ? "Adicionar Cliente"
            : modalType === "edit"
            ? "Editar Cliente"
            : modalType === "delete"
            ? "Excluir Cliente"
            : ""
        }
        onClose={() => setModalType(null)}
      >
        {/* Conteúdo do modal para Criar/Editar Cliente */}
        {(modalType === "create" || modalType === "edit") && (
          <form onSubmit={handleSubmitForm}>
            <div className="mb-4">
              <label className="block font-medium">Nome:</label>
              <input
                name="name"
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block font-medium">Salário:</label>
              <input
                name="salary"
                type="number"
                value={formData.salary}
                onChange={(e) =>
                  setFormData({ ...formData, salary: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block font-medium">Valor da Empresa:</label>
              <input
                name="companyValue"
                type="number"
                value={formData.companyValue}
                onChange={(e) =>
                  setFormData({ ...formData, companyValue: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
            <div className="text-right">
              <button
                type="button"
                className="mr-4 px-4 py-2"
                onClick={() => setModalType(null)}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                {modalType === "create" ? "Criar" : "Salvar"}
              </button>
            </div>
          </form>
        )}

        {/* Conteúdo do modal para Confirmar Exclusão */}
        {modalType === "delete" && currentClient && (
          <div>
            <p>
              Tem certeza que deseja excluir{" "}
              <strong>{currentClient.name}</strong>?
            </p>
            <div className="text-right mt-4">
              <button
                className="mr-4 px-4 py-2"
                onClick={() => setModalType(null)}
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmDelete}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Confirmar
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default ClientsPage;
