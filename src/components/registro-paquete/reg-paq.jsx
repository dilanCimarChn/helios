import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../utils/firebase";
import "./reg-paq.css";

const RegistroPaquete = () => {
  const [formData, setFormData] = useState({
    senderName: "",
    senderEmail: "",
    senderAddress: "",
    recipientName: "",
    recipientEmail: "",
    recipientAddress: "",
    packageWeight: "",
    packageSize: "",
    packagePrice: "",
    packageType: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const now = new Date();
    const fechaActual = now.toLocaleDateString();
    const horaActual = now.toLocaleTimeString();

    const paquete = {
      remitente: {
        nombre: formData.senderName,
        correo: formData.senderEmail,
        direccion: formData.senderAddress,
      },
      destinatario: {
        nombre: formData.recipientName,
        correo: formData.recipientEmail,
        direccion: formData.recipientAddress,
      },
      detallesPaquete: {
        peso: formData.packageWeight,
        tamaño: formData.packageSize,
        precio: formData.packagePrice,
        tipo: formData.packageType,
      },
      fechaEnvio: fechaActual,
      horaEnvio: horaActual,
    };

    try {
      // Guardar datos en Firebase
      const docRef = await addDoc(collection(db, "paquetes"), paquete);
      console.log("Paquete registrado con ID:", docRef.id);

      alert("El paquete fue registrado con éxito.");
    } catch (error) {
      console.error("Error al registrar el paquete:", error);
      alert("Hubo un problema al procesar el registro.");
    }
  };

  return (
    <div className="registro-paquete">
      <h2>Registrar Paquete</h2>
      <form onSubmit={handleSubmit}>
        <h3>Información del Remitente</h3>
        <input
          type="text"
          name="senderName"
          placeholder="Nombre del remitente"
          value={formData.senderName}
          onChange={handleInputChange}
          required
        />
        <input
          type="email"
          name="senderEmail"
          placeholder="Correo electrónico del remitente"
          value={formData.senderEmail}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="senderAddress"
          placeholder="Dirección del remitente"
          value={formData.senderAddress}
          onChange={handleInputChange}
          required
        />

        <h3>Información del Destinatario</h3>
        <input
          type="text"
          name="recipientName"
          placeholder="Nombre del destinatario"
          value={formData.recipientName}
          onChange={handleInputChange}
          required
        />
        <input
          type="email"
          name="recipientEmail"
          placeholder="Correo electrónico del destinatario"
          value={formData.recipientEmail}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="recipientAddress"
          placeholder="Dirección del destinatario"
          value={formData.recipientAddress}
          onChange={handleInputChange}
          required
        />

        <h3>Detalles del Paquete</h3>
        <input
          type="number"
          name="packageWeight"
          placeholder="Peso del paquete (kg)"
          value={formData.packageWeight}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="packageSize"
          placeholder="Tamaño del paquete"
          value={formData.packageSize}
          onChange={handleInputChange}
          required
        />
        <input
          type="number"
          name="packagePrice"
          placeholder="Precio de envío (Bs)"
          value={formData.packagePrice}
          onChange={handleInputChange}
          required
        />
        <select
          name="packageType"
          value={formData.packageType}
          onChange={handleInputChange}
          required
        >
          <option value="">Seleccionar tipo de paquete</option>
          <option value="Frágil">Frágil</option>
          <option value="Electrodomésticos">Electrodomésticos</option>
          <option value="Ropa">Ropa</option>
          <option value="Alimentos">Alimentos</option>
          <option value="Artículos de oficina">Artículos de oficina</option>
          <option value="Herramientas">Herramientas</option>
          <option value="Tecnología">Tecnología</option>
          <option value="Muebles">Muebles</option>
          <option value="Otros">Otros</option>
        </select>

        <button type="submit">Registrar Paquete</button>
      </form>
    </div>
  );
};

export default RegistroPaquete;
