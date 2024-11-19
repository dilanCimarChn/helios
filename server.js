import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { Resend } from "resend";

const app = express();
const resend = new Resend("re_2MJqPAS4_NKvyhZSWbe9gZQPrLiGgb54k"); // Tu clave API de Resend

app.use(cors());
app.use(bodyParser.json());

// Ruta para enviar correos
app.post("/send-email", async (req, res) => {
  const { from, to, subject, html } = req.body;

  try {
    const data = await resend.emails.send({
      from: "Helios <admin@helios.dominio.com>", // Dirección de correo verificada
      to,
      subject,
      html,
    });
    console.log("Correo enviado con éxito:", data);
    res.status(200).send("Correo enviado con éxito");
  } catch (error) {
    console.error("Error al enviar el correo:", error);
    res.status(500).send("Error al enviar el correo");
  }
});

app.listen(5000, () => {
  console.log("Servidor corriendo en http://localhost:5000");
});
