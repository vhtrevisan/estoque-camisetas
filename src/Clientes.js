import { useEffect, useState } from "react";
import { db } from "./firebase";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import Layout from "./components/Layout";

export default function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");

  const fetchClientes = async () => {
    const querySnapshot = await getDocs(collection(db, "clientes"));
    const lista = [];
    querySnapshot.forEach((doc) => {
      lista.push({ id: doc.id, ...doc.data() });
    });
    setClientes(lista);
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  const adicionarCliente = async () => {
    if (!nome) return alert("Preencha o nome do cliente");
    await addDoc(collection(db, "clientes"), {
      nome,
      email,
      telefone,
    });
    setNome("");
    setEmail("");
    setTelefone("");
    fetchClientes();
  };

  const removerCliente = async (id) => {
    if (window.confirm("Tem certeza que deseja remover este cliente?")) {
      await deleteDoc(doc(db, "clientes", id));
      fetchClientes();
    }
  };

  return (
    <Layout titulo="Clientes">
      <div className="max-w-xl mx-auto bg-white p-4 rounded shadow space-y-4">
        <h2 className="text-xl font-semibold text-blue-600">Cadastrar novo cliente</h2>

        <input
          placeholder="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        />
        <input
          placeholder="E-mail (opcional)"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        />
        <input
          placeholder="Telefone (opcional)"
          value={telefone}
          onChange={(e) => setTelefone(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        />
        <button
          onClick={adicionarCliente}
          className="bg-blue-600 text-white py-2 rounded w-full hover:bg-blue-700 transition"
        >
          Salvar cliente
        </button>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-2">Lista de Clientes</h3>
        <ul className="space-y-2">
          {clientes.map((c) => (
            <li key={c.id} className="bg-gray-50 border rounded p-3 flex justify-between items-center">
              <div>
                <strong>{c.nome}</strong>
                {c.email && <p className="text-sm text-gray-500">{c.email}</p>}
                {c.telefone && <p className="text-sm text-gray-500">{c.telefone}</p>}
              </div>
              <button
                onClick={() => removerCliente(c.id)}
                className="text-red-500 hover:underline"
              >
                Remover
              </button>
            </li>
          ))}
        </ul>
      </div>
    </Layout>
  );
}
