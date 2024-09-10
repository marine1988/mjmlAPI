// Importando dependências
const express = require('express');
const mjml = require('mjml');

// Inicializando o app
const app = express();
const port = 3000;

// Configurando o middleware para aceitar payloads maiores
app.use(express.json({ limit: '100mb' }));  // Aumenta o limite de tamanho do corpo para 10MB
app.use(express.urlencoded({ limit: '100mb', extended: true }));

// Rota para compilar MJML para HTML
app.post('/compile-mjml', (req, res) => {
    const { mjmlContent } = req.body;

    // Verifica se o conteúdo do MJML foi fornecido
    if (!mjmlContent) {
        return res.status(400).json({ error: 'MJML content is required' });
    }

    try {
        // Compila o MJML para HTML
        const htmlOutput = mjml(mjmlContent).html;
        return res.status(200).json({ html: htmlOutput });
    } catch (error) {
        return res.status(500).json({ error: 'Error compiling MJML', details: error.message });
    }
});

// Iniciando o servidor
app.listen(port, () => {
    console.log(`API rodando na porta ${port}`);
});
