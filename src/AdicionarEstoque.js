import { useState, useEffect } from "react";
import { db, auth } from "./firebase";
import { addDoc, collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import Layout from "./components/Layout";

export default function AdicionarEstoque() {
  const [clientes, setClientes] = useState([]);
  const [clienteSelecionado, setClienteSelecionado] = useState("");
  const [tamanho, setTamanho] = useState("");
  const [cor, setCor] = useState("");
  const [modelo, setModelo] = useState("");
  const [quantidade, setQuantidade] = useState(1);
  const [mensagem, setMensagem] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (!user) navigate("/login");
    });

    const buscarClientes = async () => {
      const querySnapshot = await getDocs(collection(db, "clientes"));
      const lista = [];
      querySnapshot.forEach((doc) => {
        lista.push(doc.data().nome);
      });
      setClientes(lista);
    };

    buscarClientes();
  }, [navigate]);

  const adicionar = async () => {
    if (!clienteSelecionado || !tamanho || !cor || !modelo || quantidade < 1) {
      setMensagem("Preencha todos os campos corretamente!");
      return;
    }

    for (let i = 0; i < quantidade; i++) {
      const dados = {
        cliente: clienteSelecionado,
        tamanho,
        cor,
        modelo,
        timestamp: new Date().toISOString(),
      };
      await addDoc(collection(db, "camisetas"), dados);
    }

    setMensagem(`${quantidade} camisetas adicionadas ao estoque!`);
    setClienteSelecionado("");
    setTamanho("");
    setCor("");
    setModelo("");
    setQuantidade(1);
  };

  return (
    <Layout titulo="Adicionar ao Estoque">
      <div className="max-w-lg mx-auto bg-white shadow rounded p-6 space-y-4">
        <select
          value={clienteSelecionado}
          onChange={(e) => setClienteSelecionado(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        >
          <option value="">Selecione o cliente</option>
          {clientes.map((c, i) => (
            <option key={i} value={c}>{c}</option>
          ))}
        </select>

        <input
          placeholder="Tamanho"
          value={tamanho}
          onChange={(e) => setTamanho(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />
        <input
          placeholder="Cor"
          value={cor}
          onChange={(e) => setCor(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />
        <input
          placeholder="Modelo"
          value={modelo}
          onChange={(e) => setModelo(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />
        <input
          type="number"
          min="1"
          value={quantidade}
          onChange={(e) => setQuantidade(parseInt(e.target.value))}
          className="w-full border rounded px-3 py-2"
        />
        <button
          onClick={adicionar}
          className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700 transition"
        >
          Adicionar ao estoque
        </button>

        {mensagem && <p className="text-green-600 font-medium">{mensagem}</p>}
      </div>
    </Layout>
  );
}
