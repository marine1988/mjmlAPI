// Importando dependências
const express = require('express');
const mjml = require('mjml');
const morgan = require('morgan'); // Para log de requisições (útil em produção)
const helmet = require('helmet'); // Para segurança

// Inicializando o app
const app = express();
const port = process.env.PORT || 3000; // Utiliza a variável de ambiente 'PORT' fornecida pelo Render

// Middleware de segurança
app.use(helmet());

// Middleware para logs de requisições
app.use(morgan('combined'));

// Middleware para parsing de JSON com limite ajustado
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Rota para compilar MJML para HTML
app.post('/compile-mjml', (req, res) => {
    const { mjmlContent } = req.body;

    // Verifica se o conteúdo do MJML foi fornecido
    if (!mjmlContent) {
        return res.status(400).json({ error: 'MJML content is required' });
    }

    try {
        // Compila o MJML para HTML
        const htmlOutput = mjml(mjmlContent, { minify: true }).html; // Minifica o HTML para otimizar o output
        return res.status(200).json({ html: htmlOutput });
    } catch (error) {
        // Log do erro e resposta para o cliente
        console.error('Error compiling MJML:', error.message);
        return res.status(500).json({ error: 'Error compiling MJML', details: error.message });
    }
});

// Rota de verificação de saúde (útil para monitoramento)
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'API is running' });
});

// Iniciando o servidor
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
