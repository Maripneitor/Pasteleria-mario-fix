require('dotenv').config({ path: '../.env' });
const OpenAI = require('openai');

async function testOpenAI() {
    console.log("🔍 Probando configuración de OpenAI...");

    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'tu_llave_aqui') {
        console.error("❌ Error: OPENAI_API_KEY no está configurada correctamente en .env");
        console.log("ℹ️  Por favor, edita backend/.env y pon tu clave real.");
        process.exit(1);
    }

    try {
        const openai = new OpenAI();
        const completion = await openai.chat.completions.create({
            messages: [{ role: "system", content: "You are a helpful assistant." }, { role: "user", content: "Say 'Hello World' in Spanish." }],
            model: "gpt-3.5-turbo",
        });

        console.log("✅ Conexión Exitosa!");
        console.log("🤖 Respuesta de IA:", completion.choices[0].message.content);
    } catch (error) {
        console.error("❌ Error conectando con OpenAI:", error.message);
        if (error.code === 'invalid_api_key') {
            console.error("💡 Tu API KEY parece ser inválida.");
        }
    }
}

testOpenAI();
