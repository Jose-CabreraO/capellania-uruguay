export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const datos = req.body;

  // TODO: Aquí conectaremos el servicio de envío de correos (Resend/SendGrid) en producción.
  console.log('Inscripción recibida de forma segura en el backend:', datos);

  // Redireccionar a una página de éxito (puedes crear un exito.html o redirigir al index)
  res.redirect(303, '/index.html?registro=exito');
}
