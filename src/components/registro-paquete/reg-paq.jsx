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

  // Función para calcular el precio automáticamente
  const calculatePrice = (weight, type) => {
    const basePrice = 5; // Precio base en bolivianos
    const weightMultiplier = weight ? Math.max(1, weight) * 1.5 : 0; // Incremento por peso (1.5 Bs/kg)
    let typeIncrement = 0;

    // Incrementos según el tipo de paquete
    switch (type) {
      case "Frágil":
        typeIncrement = 2; // Ejemplo: paquetes frágiles cuestan un poco más
        break;
      case "Electrodomésticos":
        typeIncrement = 3; // Mayor costo por tamaño y peso potencial
        break;
      case "Ropa":
        typeIncrement = 1; // Más accesible
        break;
      case "Alimentos":
        typeIncrement = 1.5; // Conservación y cuidado
        break;
      default:
        typeIncrement = 0.5; // Otros tipos, pequeño incremento
    }

    // Precio final calculado
    return basePrice + weightMultiplier + typeIncrement;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Actualiza los datos del formulario
    setFormData((prev) => {
      const updatedForm = { ...prev, [name]: value };

      // Recalcular precio si cambian peso o tipo
      if (name === "packageWeight" || name === "packageType") {
        const calculatedPrice = calculatePrice(
          parseFloat(updatedForm.packageWeight),
          updatedForm.packageType
        );
        updatedForm.packagePrice = calculatedPrice.toFixed(2); // Redondear a 2 decimales
      }

      return updatedForm;
    });
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
          type="text"
          name="packagePrice"
          placeholder="Precio de envío (Bs)"
          value={formData.packagePrice}
          readOnly
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
          <option value="Otros">Otros</option>
        </select>

        <button type="submit">Registrar Paquete</button>
      </form>
    </div>
  );
};

export default RegistroPaquete;
