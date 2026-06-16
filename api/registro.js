import { Resend } from 'resend';

// Inicializamos Resend desde una variable segura del entorno de Vercel.
const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const d = req.body;

  try {
    // Estructuramos el correo institucional
    await resend.emails.send({
      from: 'Capellania <onboarding@resend.dev>',
      to: 'joselocabrera563@gmail.com',
      subject: `Nueva Inscripción: ${d.nombre_completo} (${d.tipo_pase})`,
      html: `
        <h2>Módulo de Inscripciones Unificado - Capellanía Empresarial</h2>
        <p><strong>Tipo de Pase:</strong> ${d.tipo_pase}</p>
        <p><strong>Nombre Completo:</strong> ${d.nombre_completo}</p>
        <p><strong>Email:</strong> ${d.email}</p>
        <p><strong>WhatsApp:</strong> ${d.telefono_whatsapp}</p>
        <p><strong>Ciudad:</strong> ${d.ciudad}</p>

        ${d.tipo_pase === 'pareja' ? `
          <h3>Datos del Acompañante</h3>
          <p><strong>Nombre:</strong> ${d.nombre_segunda_persona}</p>
          <p><strong>Email:</strong> ${d.email_segunda_persona}</p>
        ` : ''}

        <h3>Datos de Facturación</h3>
        <p><strong>Requiere Factura:</strong> ${d.factura}</p>
        ${d.factura === 'si' ? `
          <p><strong>RUC:</strong> ${d.ruc}</p>
          <p><strong>Razón Social:</strong> ${d.razon_social}</p>
          <p><strong>Dirección:</strong> ${d.direccion_facturacion}</p>
        ` : ''}

        <h3>Comprobante de Transferencia</h3>
        <p><strong>Archivo subido:</strong> ${d.comprobante_pago}</p>
      `
    });

    // Redireccionamos al index con parámetro de éxito
    res.redirect(303, '/index.html?registro=exito');
  } catch (error) {
    console.error('Error enviando el correo con Resend:', error);
    res.status(500).json({ error: 'Error interno al procesar el registro' });
  }
}
