import React from "react";

interface Client {
  id: string;
  name: string;
  salary: number;
  companyValue: number;
}

interface ClientCardProps {
  client: Client;
  onEdit: () => void;
  onDelete: () => void;
}

function ClientCard({ client, onEdit, onDelete }: ClientCardProps) {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-lg font-bold mb-2">{client.name}</h3>
      <p>
        Salário:{" "}
        {client.salary.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        })}
      </p>
      <p>
        Valor da Empresa:{" "}
        {client.companyValue.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        })}
      </p>
      <div className="flex justify-end mt-2 space-x-2">
        <button onClick={onEdit} className="text-blue-500 hover:underline">
          Editar
        </button>
        <button onClick={onDelete} className="text-red-500 hover:underline">
          Excluir
        </button>
      </div>
    </div>
  );
}

export default ClientCard;
