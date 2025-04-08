import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";
import Layout from "./components/Layout";

export default function Produto() {
  const { id } = useParams();
  const [camiseta, setCamiseta] = useState(null);
  const [baixado, setBaixado] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const docRef = doc(db, "camisetas", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setCamiseta(docSnap.data());
      } else {
        setCamiseta(null);
      }
    };

    fetchData();
  }, [id]);

  const darBaixa = async () => {
    const docRef = doc(db, "camisetas", id);
    await updateDoc(docRef, {
      baixadoEm: new Date().toISOString(),
    });
    setBaixado(true);
  };

  if (!camiseta) return (
    <Layout titulo="Produto">
      <p className="text-center text-gray-500">Carregando ou não encontrado...</p>
    </Layout>
  );

  return (
    <Layout titulo="Detalhes da Camiseta">
      <div className="max-w-lg mx-auto bg-white shadow p-6 rounded space-y-4">
        <div className="space-y-2 text-sm">
          <p><strong>Cliente:</strong> {camiseta.cliente}</p>
          <p><strong>Tamanho:</strong> {camiseta.tamanho}</p>
          <p><strong>Cor:</strong> {camiseta.cor}</p>
          <p><strong>Modelo:</strong> {camiseta.modelo}</p>
          <p><strong>Registrado em:</strong> {new Date(camiseta.timestamp).toLocaleString()}</p>
        </div>

        {baixado || camiseta.baixadoEm ? (
          <p className="text-green-600 font-semibold">✔ Produto baixado do estoque!</p>
        ) : (
          <button
            onClick={darBaixa}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition w-full"
          >
            Dar baixa no estoque
          </button>
        )}
      </div>
    </Layout>
  );
}
