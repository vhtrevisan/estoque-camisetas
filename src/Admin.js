import { useEffect, useState } from 'react';
import { db, auth } from './firebase';
import { collection, getDocs } from 'firebase/firestore';
import { useNavigate, Link } from 'react-router-dom';
import { saveAs } from 'file-saver';
import Papa from 'papaparse';
import Layout from './components/Layout';

export default function Admin() {
  const [camisetas, setCamisetas] = useState([]);
  const [buscaCliente, setBuscaCliente] = useState('');
  const [somenteBaixados, setSomenteBaixados] = useState(false);
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [refresh, setRefresh] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) navigate("/login");
    });
    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, 'camisetas'));
      const lista = [];
      querySnapshot.forEach((doc) => {
        lista.push({ id: doc.id, ...doc.data() });
      });
      setCamisetas(lista);
    };
    fetchData();
  }, [refresh]);

  const exportarCSV = () => {
    const camisetasFiltradas = camisetas.filter((item) => {
      const dentroDoPeriodo = (!dataInicio || new Date(item.timestamp) >= new Date(dataInicio)) &&
        (!dataFim || new Date(item.timestamp) <= new Date(dataFim));
      const correspondeBusca = item.cliente.toLowerCase().includes(buscaCliente.toLowerCase());
      const correspondeStatus = !somenteBaixados || item.baixadoEm;
      return dentroDoPeriodo && correspondeBusca && correspondeStatus;
    });

    if (camisetasFiltradas.length === 0) {
      alert('Nenhum dado para exportar!');
      return;
    }

    const dadosCSV = camisetasFiltradas.map((item) => ({
      Cliente: item.cliente,
      Tamanho: item.tamanho,
      Cor: item.cor,
      Modelo: item.modelo,
      'Data de Registro': new Date(item.timestamp).toLocaleString(),
      Status: item.baixadoEm ? 'Baixado' : 'Em Estoque',
    }));

    const csv = Papa.unparse(dadosCSV, {
      quotes: true,
      delimiter: ',',
      header: true,
      skipEmptyLines: true,
    });

    const blob = new Blob(["\uFEFF" + csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `relatorio_estoque_${new Date().toISOString().slice(0, 10)}.csv`);
  };

  const camisetasFiltradas = camisetas.filter((item) => {
    const dentroDoPeriodo = (!dataInicio || new Date(item.timestamp) >= new Date(dataInicio)) &&
      (!dataFim || new Date(item.timestamp) <= new Date(dataFim));
    const correspondeBusca = item.cliente.toLowerCase().includes(buscaCliente.toLowerCase());
    const correspondeStatus = !somenteBaixados || item.baixadoEm;
    return dentroDoPeriodo && correspondeBusca && correspondeStatus;
  });

  const estoqueAtual = camisetas.filter((item) => !item.baixadoEm).length;

  return (
    <Layout titulo="Painel do Admin">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-800">
          Estoque atual: <span className="text-blue-600 font-bold">{estoqueAtual}</span> camisetas
        </h2>
      </div>

      <div className="grid md:grid-cols-4 gap-4 mb-6">
        <input
          type="text"
          placeholder="Buscar por cliente"
          value={buscaCliente}
          onChange={(e) => setBuscaCliente(e.target.value)}
          className="col-span-2 border rounded px-3 py-2"
        />
        <div className="flex items-center gap-2 col-span-2 md:col-span-1">
          <input type="checkbox" checked={somenteBaixados} onChange={() => setSomenteBaixados(!somenteBaixados)} />
          <label className="text-sm">Somente baixados</label>
        </div>
        <input type="date" value={dataInicio} onChange={(e) => setDataInicio(e.target.value)} className="border rounded px-2 py-1" />
        <input type="date" value={dataFim} onChange={(e) => setDataFim(e.target.value)} className="border rounded px-2 py-1" />
        <button
          onClick={exportarCSV}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition col-span-2 md:col-span-1"
        >
          Exportar para Excel
        </button>
      </div>

      <div className="overflow-x-auto shadow border rounded">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-700 font-semibold">
            <tr>
              <th className="p-2 border">Cliente</th>
              <th className="p-2 border">Tamanho</th>
              <th className="p-2 border">Cor</th>
              <th className="p-2 border">Modelo</th>
              <th className="p-2 border">Registrado em</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Ver</th>
            </tr>
          </thead>
          <tbody>
            {camisetasFiltradas.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 transition">
                <td className="p-2 border">{item.cliente}</td>
                <td className="p-2 border">{item.tamanho}</td>
                <td className="p-2 border">{item.cor}</td>
                <td className="p-2 border">{item.modelo}</td>
                <td className="p-2 border">{new Date(item.timestamp).toLocaleString()}</td>
                <td className="p-2 border">
                  {item.baixadoEm ? (
                    <span className="text-green-600 font-bold">✔ Baixado</span>
                  ) : (
                    <span className="text-yellow-600">🕒 Pendente</span>
                  )}
                </td>
                <td className="p-2 border text-blue-600">
                  <Link to={`/produto/${item.id}`} className="hover:underline">Detalhes</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
