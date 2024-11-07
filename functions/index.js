const functions = require("firebase-functions");
const admin = require("firebase-admin");
const sgMail = require("@sendgrid/mail");

admin.initializeApp();

// Configurar SendGrid usando la API Key almacenada en las configuraciones
sgMail.setApiKey(functions.config().sendgrid.key);

// Crear una función que envíe la factura cuando se registre un nuevo paquete
exports.enviarFactura = functions.firestore
  .document("paquetes/{paqueteId}")
  .onCreate(async (snap, context) => {
    const data = snap.data();
    const destinatarioEmail = data.destinatario.correo;

    const msg = {
      to: destinatarioEmail,
      from: "2002dilanchoque@gmail.com", // Cambia esto al correo verificado en SendGrid
      subject: "Factura de Envío - Helios",
      text: `Hola ${data.destinatario.nombre}, aquí está la factura de su paquete.`,
      html: `
        <h1>Factura de Envío</h1>
        <p><strong>Remitente:</strong> ${data.remitente.nombre}</p>
        <p><strong>Destinatario:</strong> ${data.destinatario.nombre}</p>
        <p><strong>Detalles del Paquete:</strong></p>
        <ul>
          <li>Peso: ${data.detallesPaquete.peso} kg</li>
          <li>Tamaño: ${data.detallesPaquete.tamaño}</li>
          <li>Precio: ${data.detallesPaquete.precio} Bs</li>
        </ul>
        <p>Gracias por utilizar nuestro servicio.</p>
      `
    };

    try {
      await sgMail.send(msg);
      console.log("Correo enviado a", destinatarioEmail);
    } catch (error) {
      console.error("Error al enviar el correo:", error);
    }
  });
