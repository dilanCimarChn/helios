export async function sendEmail(from, to, subject, html) {
    try {
      const response = await fetch("http://localhost:5000/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ from, to, subject, html }),
      });
  
      if (!response.ok) {
        throw new Error("Error al enviar el correo");
      }
  
      console.log("Correo enviado con éxito");
    } catch (error) {
      console.error("Error en sendEmail:", error);
      throw error;
    }
  }
  