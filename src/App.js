import { useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { db } from './firebase';
import { collection, addDoc } from 'firebase/firestore';

function App() {
  const [cliente, setCliente] = useState('');
  const [tamanho, setTamanho] = useState('');
  const [cor, setCor] = useState('');
  const [modelo, setModelo] = useState('');
  const [codigoGerado, setCodigoGerado] = useState('');

  const gerarQRCode = async () => {
    const dados = {
      cliente,
      tamanho,
      cor,
      modelo,
      timestamp: new Date().toISOString(),
    };

    try {
      const docRef = await addDoc(collection(db, "camisetas"), dados);
      const urlQRCode = `${window.location.origin}/produto/${docRef.id}`;
      setCodigoGerado(urlQRCode);
    } catch (e) {
      console.error("Erro ao adicionar documento: ", e);
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: '0 auto', padding: 20 }}>
      <h1>Cadastro de Camiseta</h1>
      <input placeholder="Nome do Cliente" value={cliente} onChange={(e) => setCliente(e.target.value)} />
      <input placeholder="Tamanho" value={tamanho} onChange={(e) => setTamanho(e.target.value)} />
      <input placeholder="Cor" value={cor} onChange={(e) => setCor(e.target.value)} />
      <input placeholder="Modelo" value={modelo} onChange={(e) => setModelo(e.target.value)} />
      <button onClick={gerarQRCode}>Gerar QR Code</button>

      {codigoGerado && (
        <div style={{ marginTop: 20 }}>
          <h2>QR Code gerado:</h2>
          <QRCodeCanvas value={codigoGerado} size={256} />
          <p>Link: <a href={codigoGerado} target="_blank" rel="noreferrer">{codigoGerado}</a></p>
        </div>
      )}
    </div>
  );
}

export default App;