import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { motion } from "framer-motion";

export default function Layout({ children, titulo = "Painel" }) {
  const navigate = useNavigate();

  const logout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex bg-gray-50 text-gray-800">
      <motion.aside
        initial={{ x: -200 }}
        animate={{ x: 0 }}
        transition={{ type: "spring", stiffness: 60 }}
        className="bg-white w-64 shadow-md p-5 hidden md:block"
      >
        <h2 className="text-xl font-bold mb-6 text-blue-600">Smart Hub Estoque</h2>
        <nav className="space-y-3 text-sm">
  <Link to="/dashboard" className="block hover:text-blue-500">📈 Dashboard</Link>
  <Link to="/clientes" className="block hover:text-blue-500">👥 Clientes</Link>
  <Link to="/admin" className="block hover:text-blue-500">📋 Painel</Link>
  <Link to="/estoque" className="block hover:text-blue-500">➕ Adicionar Estoque</Link>
          <button onClick={logout} className="text-red-500 hover:underline mt-6">
            🚪 Sair
          </button>
        </nav>
      </motion.aside>

      <main className="flex-1 p-4">
        <div className="md:hidden mb-4">
        <nav className="flex justify-between text-sm">
  <Link to="/dashboard">📈 Dashboard</Link>
  <Link to="/clientes">👥 Clientes</Link>
  <Link to="/admin">📋 Painel</Link>
  <Link to="/estoque">➕ Estoque</Link>
  <button onClick={logout}>🚪</button>
</nav>


        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="text-2xl font-bold text-blue-600 mb-4">{titulo}</h1>
          {children}
        </motion.div>
      </main>
    </div>
  );
}