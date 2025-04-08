import { useEffect, useState } from "react";
import { db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";
import Layout from "./components/Layout";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

export default function Dashboard() {
  const [camisetas, setCamisetas] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, "camisetas"));
      const lista = [];
      querySnapshot.forEach((doc) => {
        lista.push({ id: doc.id, ...doc.data() });
      });
      setCamisetas(lista);
    };
    fetchData();
  }, []);

  const total = camisetas.length;
  const baixadas = camisetas.filter((c) => c.baixadoEm).length;
  const emEstoque = total - baixadas;

  // 📊 Gráfico por mês
  const porMes = {};
  camisetas.forEach((c) => {
    const date = new Date(c.baixadoEm || c.timestamp);
    const key = `${date.getMonth() + 1}/${date.getFullYear()}`;
    porMes[key] = (porMes[key] || 0) + 1;
  });
  const dadosMensais = Object.entries(porMes).map(([mes, qtd]) => ({
    mes,
    qtd,
  }));

  // 📊 Gráfico por cliente
  const porCliente = {};
  camisetas.forEach((c) => {
    porCliente[c.cliente] = (porCliente[c.cliente] || 0) + 1;
  });
  const dadosClientes = Object.entries(porCliente).map(([cliente, qtd]) => ({
    name: cliente,
    value: qtd,
  }));

  const cores = ["#3B82F6", "#F59E0B", "#10B981", "#EF4444", "#8B5CF6", "#EC4899"];

  return (
    <Layout titulo="Dashboard">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow text-center">
          <h2 className="text-sm text-gray-500">Total de Camisetas</h2>
          <p className="text-2xl font-bold text-blue-600">{total}</p>
        </div>
        <div className="bg-white p-4 rounded shadow text-center">
          <h2 className="text-sm text-gray-500">Em Estoque</h2>
          <p className="text-2xl font-bold text-green-600">{emEstoque}</p>
        </div>
        <div className="bg-white p-4 rounded shadow text-center">
          <h2 className="text-sm text-gray-500">Baixadas</h2>
          <p className="text-2xl font-bold text-red-500">{baixadas}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-2">Camisetas por Mês</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dadosMensais}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="qtd" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-2">Camisetas por Cliente</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={dadosClientes}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {dadosClientes.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={cores[index % cores.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Layout>
  );
}
