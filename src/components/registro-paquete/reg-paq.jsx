import React, { useState } from "react";
import { db } from '../../firebase'; 
import { collection, addDoc } from "firebase/firestore";
import GenerateQR from '../generador_qr/GenerateQR'; // Importa el componente para generar QR
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
    start: "", // Departamento de inicio
    end: ""    // Departamento de fin
  });

// Función para calcular el precio automáticamente
  const calculatePrice = (weight, type) => {
    const basePrice = 5; // Precio base en bolivianos
    const weightMultiplier = weight ? Math.max(1, weight) * 1.5 : 0; // Incremento por peso (1.5 Bs/kg)
    let typeIncrement = 0;

    switch (type) {
      case "Frágil":
        typeIncrement = 2;
        break;
      case "Electrodomésticos":
        typeIncrement = 3;
        break;
      case "Ropa":
        typeIncrement = 1;
        break;
      case "Alimentos":
        typeIncrement = 1.5;
        break;
      default:
        typeIncrement = 0.5;
    }

    return basePrice + weightMultiplier + typeIncrement;
  };


  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const updatedForm = { ...prev, [name]: value };

      if (name === "packageWeight" || name === "packageType") {
        const calculatedPrice = calculatePrice(
          parseFloat(updatedForm.packageWeight),
          updatedForm.packageType
        );
        updatedForm.packagePrice = calculatedPrice.toFixed(2);
      }

      return updatedForm;
    });
  };


  

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar que los departamentos no sean iguales
  if (formData.start === formData.end) {
    alert("El departamento de inicio y fin no pueden ser el mismo.");
    return;
  }
    
    const now = new Date();
    const fechaActual = now.toLocaleDateString();
    const horaActual = now.toLocaleTimeString();

    // Estructurar los datos pqra Firestore
    const packageData = {
      remitente: {
        nombre: formData.senderName,
        correo: formData.senderEmail,
        direccion: formData.senderAddress
      },
      destinatario: {
        nombre: formData.recipientName,
        correo: formData.recipientEmail,
        direccion: formData.recipientAddress
      },
      detallesPaquete: {
        peso: formData.packageWeight,
        tamaño: formData.packageSize,
        precio: formData.packagePrice
      },
      fechaRegistro: new Date().toISOString()

      
      
    };

    try {
      // Guardar datos en Firestore
      const docRef = await addDoc(collection(db, "paquetes"), packageData);
      console.log("Paquete registrado con ID: ", docRef.id);

      // Llamar a la función para enviar correo después de registrar el paquete
      enviarFacturaCorreo(formData.recipientEmail, packageData);
      alert("Paquete registrado y correo enviado correctamente");
    } catch (error) {
      console.error("Error al registrar el paquete: ", error);
    }
  };

  // Función para enviar la factura al correo del destinatario
  const enviarFacturaCorreo = (destinatarioEmail, packageData) => {
    // Aquí deberías usar un servicio de backend o un servicio de terceros como c=me invento o Firebase Functions con SendGrid.
    
    console.log("Enviar factura al correo:", destinatarioEmail);
    // Iaqui le pongo para correo
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
         onChange={handleInputChange} required 
        />
        <input 
         type="email" 
         name="senderEmail" 
         placeholder="Correo electrónico del remitente" 
         value={formData.senderEmail} 
         onChange={handleInputChange} 
         required 
        />
        <select
          name="start"
          value={formData.start}
          onChange={handleInputChange}
          required
        >
          <option value="">Selecciona un departamento</option>
          <option value="La Paz">La Paz</option>
          <option value="Santa Cruz">Santa Cruz</option>
          <option value="Cochabamba">Cochabamba</option>
          <option value="Chuquisaca">Chuquisaca</option>
          <option value="Potosí">Potosí</option>
          <option value="Oruro">Oruro</option>
          <option value="Tarija">Tarija</option>
          <option value="Beni">Beni</option>
          <option value="Pando">Pando</option>
        </select>

        <h3>Información del Destinatario</h3>
        <input type="text" name="recipientName" placeholder="Nombre del destinatario" value={formData.recipientName} onChange={handleInputChange} required />
        <input type="email" name="recipientEmail" placeholder="Correo electrónico del destinatario" value={formData.recipientEmail} onChange={handleInputChange} required />
        <select
          name="end"
          value={formData.end}
          onChange={handleInputChange}
          required
        >
          <option value="">Selecciona un departamento</option>
          <option value="La Paz" disabled={formData.start === "La Paz"}>La Paz</option>
          <option value="Santa Cruz" disabled={formData.start === "Santa Cruz"}>Santa Cruz</option>
          <option value="Cochabamba" disabled={formData.start === "Cochabamba"}>Cochabamba</option>
          <option value="Chuquisaca" disabled={formData.start === "Chuquisaca"}>Chuquisaca</option>
          <option value="Potosí" disabled={formData.start === "Potosí"}>Potosí</option>
          <option value="Oruro" disabled={formData.start === "Oruro"}>Oruro</option>
          <option value="Tarija" disabled={formData.start === "Tarija"}>Tarija</option>
          <option value="Beni" disabled={formData.start === "Beni"}>Beni</option>
          <option value="Pando" disabled={formData.start === "Pando"}>Pando</option>
        </select>

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
      {formData.start && formData.end && (
        <div>
          <GenerateQR start={formData.start} end={formData.end} />
        </div>
      )}
    </div>
  );
};

export default RegistroPaquete;
