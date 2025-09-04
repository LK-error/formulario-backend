const express = require("express");
const cors = require("cors");
const multer = require("multer");
const nodemailer = require("nodemailer");
const app = express();

const upload = multer({ storage: multer.memoryStorage() });
app.use(cors());

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

app.post("/send", upload.any(), (req, res) => {
  const { solicitante_nome, replyTo, 'Resumo Completo': resumo } = req.body;

  const attachments = req.files.map(file => ({
    filename: file.originalname,
    content: file.buffer,
  }));

  transporter.sendMail({
    from: `"Formulário de Contrato" <${process.env.GMAIL_USER}>`,
    to: "gestaoti@floresativos.com.br",
    replyTo: replyTo,
    subject: `Solicitação de Contrato - ${solicitante_nome}`,
    html: `<pre>${resumo || 'Nenhum resumo fornecido.'}</pre>`,
    attachments: attachments,
  }).then(() => {
    res.status(200).json({ status: "success", message: "E-mail enviado!" });
  }).catch(err => {
    console.error("Erro:", err);
    res.status(500).json({ status: "error", message: "Falha ao enviar e-mail." });
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("Seu app está rodando na porta " + port);
});
