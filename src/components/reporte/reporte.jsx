import React, { useState, useEffect } from "react";
import { db } from "../../firebase"; import { collection, getDocs } from "firebase/firestore";
import "./reporte.css";

function Reporte() {
  const [reportData, setReportData] = useState([]);
  const [filterDate, setFilterDate] = useState("");
  const [reportType, setReportType] = useState("Todos");

  useEffect(() => {
    const fetchReportData = async () => {
      const paquetesCollection = collection(db, "paquetes");
      const paquetesSnapshot = await getDocs(paquetesCollection);
      const paquetesList = paquetesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setReportData(paquetesList);
    };
    
    fetchReportData();
  }, []);

  const filteredData = reportData.filter((item) => {
    return (
      (reportType === "Todos" || item.tipo === reportType) &&
      (!filterDate || item.fecha === filterDate)
    );
  });

  return (
    <div className="reporte-container">
      <h2>Reportes</h2>
      <div className="filter-section">
        <label>
          Filtrar por fecha:
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
          />
        </label>
        <label>
          Tipo de reporte:
          <select value={reportType} onChange={(e) => setReportType(e.target.value)}>
            <option value="Todos">Todos</option>
            <option value="Notificaciones">Notificaciones</option>
            <option value="Paquetes">Paquetes</option>
            <option value="Usuarios">Usuarios</option>
          </select>
        </label>
        <button className="filter-button">Aplicar Filtros</button>
      </div>

      <div className="report-content">
        {filteredData.length > 0 ? (
          <table className="report-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Remitente</th>
                <th>Destinatario</th>
                <th>Peso</th>
                <th>Tamaño</th>
                <th>Precio</th>
                <th>Dirección del Destinatario</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((report) => (
                <tr key={report.id}>
                  <td>{report.id}</td>
                  <td>{report.remitente?.nombre || "N/A"}</td>
                  <td>{report.destinatario?.nombre || "N/A"}</td>
                  <td>{report.detallesPaquete?.peso || "N/A"} kg</td>
                  <td>{report.detallesPaquete?.tamaño || "N/A"}</td>
                  <td>{report.detallesPaquete?.precio || "N/A"} Bs</td>
                  <td>{report.destinatario?.direccion || "N/A"}</td>
                  <td>{report.fecha || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Aquí se mostrarán los reportes disponibles.</p>
        )}
      </div>
    </div>
  );
}

export default Reporte;
