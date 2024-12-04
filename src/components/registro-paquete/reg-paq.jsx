import React, { useState, useEffect } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../utils/firebase";
import emailjs from "emailjs-com";
import { QRCodeCanvas } from "qrcode.react";
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
    start: "", // Departamento de inicio
    end: "", // Departamento de fin
  });

  const [qrData, setQrData] = useState(""); // Para almacenar los datos del QR
  const [qrVisible, setQrVisible] = useState(false); // Mostrar u ocultar el QR

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

  // Manejar cambios en los inputs
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

  // Generar QR dinámicamente cuando cambian "start" o "end"
  useEffect(() => {
    if (formData.start && formData.end && formData.start !== formData.end) {
      const qrText = `Inicio: ${formData.start}
Fin: ${formData.end}
Mapa: https://www.google.com/maps/dir/${formData.start}/${formData.end}`;
      setQrData(qrText);
      setQrVisible(true); // Mostrar el QR
    } else {
      setQrVisible(false); // Ocultar el QR si no hay datos válidos
    }
  }, [formData.start, formData.end]);

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

    const paquete = {
      remitente: {
        nombre: formData.senderName,
        correo: formData.senderEmail,
        direccion: formData.start,
      },
      destinatario: {
        nombre: formData.recipientName,
        correo: formData.recipientEmail,
        direccion: formData.end,
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

      // Enviar correo con EmailJS
      const emailParams = {
        shipping_date: paquete.fechaEnvio,
        shipping_time: paquete.horaEnvio,
        sender_name: paquete.remitente.nombre,
        sender_email: paquete.remitente.correo,
        sender_address: paquete.remitente.direccion,
        recipient_name: paquete.destinatario.nombre,
        recipient_email: paquete.destinatario.correo,
        recipient_address: paquete.destinatario.direccion,
        package_weight: paquete.detallesPaquete.peso,
        package_size: paquete.detallesPaquete.tamaño,
        package_price: paquete.detallesPaquete.precio,
        package_type: paquete.detallesPaquete.tipo,
        to_email: `${formData.senderEmail},${formData.recipientEmail}`,
      };

      await emailjs.send(
        "service_1db7qis",
        "template_90v75yw",
        emailParams,
        "jbxBw1VchN1nYnmz3"
      );

      alert("El paquete fue registrado y la factura enviada con éxito.");
    } catch (error) {
      console.error("Error al registrar el paquete o enviar el correo:", error);
      alert("Hubo un problema al registrar el paquete o enviar la factura.");
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
        <select
          name="end"
          value={formData.end}
          onChange={handleInputChange}
          required
        >
          <option value="">Selecciona un departamento</option>
          <option value="La Paz" disabled={formData.start === "La Paz"}>
            La Paz
          </option>
          <option value="Santa Cruz" disabled={formData.start === "Santa Cruz"}>
            Santa Cruz
          </option>
          <option
            value="Cochabamba"
            disabled={formData.start === "Cochabamba"}
          >
            Cochabamba
          </option>
          <option value="Chuquisaca" disabled={formData.start === "Chuquisaca"}>
            Chuquisaca
          </option>
          <option value="Potosí" disabled={formData.start === "Potosí"}>
            Potosí
          </option>
          <option value="Oruro" disabled={formData.start === "Oruro"}>
            Oruro
          </option>
          <option value="Tarija" disabled={formData.start === "Tarija"}>
            Tarija
          </option>
          <option value="Beni" disabled={formData.start === "Beni"}>
            Beni
          </option>
          <option value="Pando" disabled={formData.start === "Pando"}>
            Pando
          </option>
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

      {/* Mostrar QR generado automáticamente */}
      {qrVisible && (
        <div style={{ marginTop: "20px" }}>
          <h3>QR Generado</h3>
          <QRCodeCanvas value={qrData} size={256} />
          <pre>{qrData}</pre>
        </div>
      )}
    </div>
  );
};

export default RegistroPaquete;
