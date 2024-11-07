import React, { useState } from "react";
import { db } from '../../firebase'; // Ajusta la ruta según la estructura de tu proyecto
import { collection, addDoc } from "firebase/firestore";
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
    packagePrice: ""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Estructurar los datos en un objeto para guardar en Firestore
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
    // Aquí deberías usar un servicio de backend o un servicio de terceros como EmailJS o Firebase Functions con SendGrid.
    // Este código solo es una referencia, ya que enviar correos no es posible directamente desde el frontend sin un servidor.

    console.log("Enviar factura al correo:", destinatarioEmail);
    // Implementa tu lógica de envío de correo aquí
  };

  return (
    <div className="registro-paquete">
      <h2>Registrar Paquete</h2>
      <form onSubmit={handleSubmit}>
        <h3>Información del Remitente</h3>
        <input type="text" name="senderName" placeholder="Nombre del remitente" value={formData.senderName} onChange={handleInputChange} required />
        <input type="email" name="senderEmail" placeholder="Correo electrónico del remitente" value={formData.senderEmail} onChange={handleInputChange} required />
        <input type="text" name="senderAddress" placeholder="Dirección del remitente" value={formData.senderAddress} onChange={handleInputChange} required />

        <h3>Información del Destinatario</h3>
        <input type="text" name="recipientName" placeholder="Nombre del destinatario" value={formData.recipientName} onChange={handleInputChange} required />
        <input type="email" name="recipientEmail" placeholder="Correo electrónico del destinatario" value={formData.recipientEmail} onChange={handleInputChange} required />
        <input type="text" name="recipientAddress" placeholder="Dirección del destinatario" value={formData.recipientAddress} onChange={handleInputChange} required />

        <h3>Detalles del Paquete</h3>
        <input type="number" name="packageWeight" placeholder="Peso del paquete (kg)" value={formData.packageWeight} onChange={handleInputChange} required />
        <input type="text" name="packageSize" placeholder="Tamaño del paquete" value={formData.packageSize} onChange={handleInputChange} required />
        <input type="number" name="packagePrice" placeholder="Precio de envío (Bs)" value={formData.packagePrice} onChange={handleInputChange} required />

        <button type="submit">Registrar Paquete</button>
      </form>
    </div>
  );
};

export default RegistroPaquete;
