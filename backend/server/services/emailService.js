const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail', // Or configured host
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

exports.sendWelcomeEmail = async (email, username, password) => {
    try {
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            console.warn("Email credentials not found. Skipping email.");
            return;
        }

        const mailOptions = {
            from: `"Pastelería La Fiesta" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: '¡Bienvenido al Equipo! 🧁',
            html: `
                <div style="font-family: 'Georgia', serif; color: #3E2723; background-color: #FDF8F1; padding: 40px; border-radius: 10px; max-width: 600px; margin: 0 auto; border: 2px dashed #D4A373;">
                    <h1 style="color: #D4A373; text-align: center;">¡Bienvenido a La Fiesta!</h1>
                    <p>Hola <strong>${username}</strong>,</p>
                    <p>Tu cuenta ha sido creada exitosamente. Estamos emocionados de tenerte en el equipo.</p>
                    
                    <div style="background-color: #fff; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #E6B8A2;">
                        <p style="margin: 0;"><strong>Tus credenciales de acceso:</strong></p>
                        <p style="margin: 5px 0;">Email: <strong>${email}</strong></p>
                        <p style="margin: 5px 0;">Contraseña temporal: <strong>${password}</strong></p>
                    </div>

                    <p>Por favor, inicia sesión y cambia tu contraseña lo antes posible por seguridad.</p>
                    
                    <div style="text-align: center; margin-top: 30px;">
                        <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/login" style="background-color: #D4A373; color: white; padding: 12px 24px; text-decoration: none; border-radius: 25px; font-weight: bold;">Ir al Sistema</a>
                    </div>
                    
                    <p style="font-size: 12px; text-align: center; margin-top: 40px; color: #8D6E63;">
                        Pastelería La Fiesta<br>
                        <em>Creando momentos dulces.</em>
                    </p>
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Welcome email sent: %s", info.messageId);
    } catch (error) {
        console.error("Error sending welcome email:", error);
    }
};

exports.sendEmailWithAttachment = async (to, subject, text, attachmentBuffer, filename) => {
    try {
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            console.warn("Email credentials not found. Skipping email.");
            return;
        }

        const mailOptions = {
            from: `"Pastelería La Fiesta" <${process.env.EMAIL_USER}>`,
            to: to,
            subject: subject,
            text: text,
            attachments: [
                {
                    filename: filename,
                    content: attachmentBuffer
                }
            ]
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Report email sent: %s", info.messageId);
    } catch (error) {
        console.error("Error sending report email:", error);
    }
};