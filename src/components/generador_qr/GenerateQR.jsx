// src/components/GenerateQR.js
import React, { useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import './GenerateQR.css';

const GenerateQR = () => {
  const [startDepartment, setStartDepartment] = useState('');
  const [endDepartment, setEndDepartment] = useState('');
  const [qrData, setQrData] = useState('');
  const [error, setError] = useState(null);

  const departments = [
    { name: 'Pando', lat: -11.0464, lng: -67.7154 },
    { name: 'Beni', lat: -14.835, lng: -64.8986 },
    { name: 'Santa Cruz', lat: -17.7833, lng: -63.1821 },
    { name: 'Cochabamba', lat: -17.4139, lng: -66.1653 },
    { name: 'La Paz', lat: -16.5000, lng: -68.1500 },
    { name: 'Oruro', lat: -17.9833, lng: -67.1500 },
    { name: 'Potosí', lat: -19.5836, lng: -65.7531 },
    { name: 'Tarija', lat: -21.5355, lng: -64.7296 },
    { name: 'Chuquisaca', lat: -19.0333, lng: -65.2624 },
  ];

  const handleGenerateQR = () => {
    if (!startDepartment || !endDepartment) {
      setError('Por favor selecciona ambos puntos.');
      return;
    }
    if (startDepartment === endDepartment) {
      setError('El punto de inicio y fin no pueden ser el mismo.');
      return;
    }

    const start = departments.find((d) => d.name === startDepartment);
    const end = departments.find((d) => d.name === endDepartment);

    // Crear el texto para el QR
    const qrText = `Inicio: ${start.name} (${start.lat}, ${start.lng})
Fin: ${end.name} (${end.lat}, ${end.lng})
Mapa: https://www.google.com/maps/dir/${start.lat},${start.lng}/${end.lat},${end.lng}`;

    // Configurar el texto como datos del QR
    setQrData(qrText);
    setError(null);
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h2>Generador de QR con Ruta entre Departamentos de Bolivia</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Selección de departamentos */}
      <div>
        <label>
          <strong>Punto de Inicio:</strong>
          <select
            value={startDepartment}
            onChange={(e) => setStartDepartment(e.target.value)}
          >
            <option value="">--Selecciona un departamento--</option>
            {departments.map((dep) => (
              <option key={dep.name} value={dep.name}>
                {dep.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div>
        <label>
          <strong>Punto Final:</strong>
          <select
            value={endDepartment}
            onChange={(e) => setEndDepartment(e.target.value)}
          >
            <option value="">--Selecciona un departamento--</option>
            {departments
              .filter((dep) => dep.name !== startDepartment)
              .map((dep) => (
                <option key={dep.name} value={dep.name}>
                  {dep.name}
                </option>
              ))}
          </select>
        </label>
      </div>

      {/* Generar QR */}
      <button onClick={handleGenerateQR} style={{ margin: '20px', padding: '10px 20px' }}>
        Generar QR
      </button>

      {/* Mostrar QR */}
      {qrData && (
        <div>
          <h3>Escanea el QR para ver los datos</h3>
          <QRCodeCanvas value={qrData} size={256} />
          <pre style={{ textAlign: 'left', background: '#f8f8f8', padding: '10px', marginTop: '20px' }}>
            {qrData}
          </pre>
        </div>
      )}
    </div>
  );
};

export default GenerateQR;
