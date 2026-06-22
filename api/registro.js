import { Resend } from 'resend';

// Inicialización limpia y estricta desde las variables de entorno de Vercel
const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const d = req.body;

  try {
    // Sintaxis correcta desestructurando la respuesta del SDK de Resend
    const { data, error } = await resend.emails.send({
      from: 'Capellania <onboarding@resend.dev>',
      to: 'jcshogun39@gmail.com',
      subject: `Nueva Inscripción: ${d.nombre_completo || 'Test'}`,
      html: `<p><strong>Nombre:</strong> ${d.nombre_completo}</p>
             <p><strong>Email:</strong> ${d.email}</p>
             <p><strong>Pase:</strong> ${d.tipo_pase}</p>`
    });

    if (error) {
      console.error('Resend rebotó el envío:', error);
      return res.status(400).json({ error: 'Resend rebotó el envío', detalle: error });
    }

    console.log('Resend aceptó el envío con ID:', data?.id);
    return res.redirect(303, '/?registro=exito');

  } catch (error) {
    console.error('Error crítico en la API de Resend:', error.message || error);
    return res.status(500).json({ error: 'Error interno en el servidor de correos', detalle: error.message });
  }
}
