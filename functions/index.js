const functions = require("firebase-functions");
const admin = require("firebase-admin");
const QRCode = require("qrcode");
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

    // Generar la información para el QR
    const start = data.ruta.inicio; // Ejemplo: "La Paz (-16.5, -68.15)"
    const end = data.ruta.fin; // Ejemplo: "Cochabamba (-17.4139, -66.1653)"
    const startCoords = data.ruta.coordenadasInicio; // Ejemplo: "-16.5,-68.15"
    const endCoords = data.ruta.coordenadasFin; // Ejemplo: "-17.4139,-66.1653"
    const mapUrl = `https://www.google.com/maps/dir/${startCoords}/${endCoords}`;

    const qrData = `Inicio: ${start}\nFin: ${end}\nMapa: ${mapUrl}`;

    let qrBuffer;
    try {
      qrBuffer = await QRCode.toBuffer(qrData); // Genera el QR como un buffer
    } catch (error) {
      console.error("Error generando el código QR", error);
      return; // Si ocurre un error al generar el QR, termina la ejecución
    }

    // Subir el QR a Firebase Storage
    const bucket = admin.storage().bucket();
    const file = bucket.file(`qr_codes/qr_${context.params.paqueteId}.png`);
 
    try {
      await file.save(qrBuffer, { contentType: "image/png" });
      await file.makePublic(); // Asegúrate de que el archivo sea público
    } catch (error) {
      console.error("Error subiendo el QR a Firebase Storage", error);
      return; // Si hay un error subiendo el archivo, termina la ejecución
    }

    const qrUrl = `https://storage.googleapis.com/${bucket.name}/qr_codes/qr_${context.params.paqueteId}.png`;

    // Configurar el correo con SendGrid
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
        <p><strong>Inicio:</strong> ${start}</p>
        <p><strong>Fin:</strong> ${end}</p>
        <p><strong>Mapa:</strong> <a href="${mapUrl}" target="_blank">${mapUrl}</a></p>
        <p>Gracias por utilizar nuestro servicio.</p>
        <p><strong>Escanea el Código QR para más detalles:</strong></p>
        <img src="${qrUrl}" alt="Código QR" />
      `
    };

    try {
      await sgMail.send(msg);
      console.log("Correo enviado a", destinatarioEmail);
    } catch (error) {
      console.error("Error al enviar el correo:", error);
    }
  });
