import { createTransport } from "nodemailer";
import config from '../config.js';

export const transporter = createTransport({
    service: 'gmail',
    port:587,
    auth: {
        user: "siriusdecohome@gmail.com",
        pass: "aajq ymkz kfdi sauy"
    }
});

export const updatePassEmail = {
    from: "siriusdecohome@gmail.com",
    to: "siriusdecohome@gmail.com",
    subject: 'Recupere su contraseña',
    html: `<!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <title>LOGIN</title>
      </head>
      <body>
        <h1>Click en el siguiente enlace para reestablecer su contraseña</h1>
    
        <a href="http://localhost:8080/api/updatePass">
        <button>Reestablecer contraseña</button>
      </a>
    
      </body>
    
    </html>`
};

export const deactivationEmail = {
  from: config.emailEthereal,
  to: config.emailEthereal,
  subject: 'Su cuenta ha sido desactivada por inactividad',
  html: `<!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8">
      <title>INACTIVIDAD</title>
    </head>
    <body>
      <h4>Su cuenta ha sido eliminada</h4>
  
      <p>Lo lamentamos pero su cuenta ha sido eliminada ya que lleva inactivo más de 30 días.</p>
    </body>
  
  </html>`
};