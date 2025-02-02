const express = require("express");
const transporter = require("../config/mailer"); // Usa a mesma configuração do reminderService
const logger = require("../config/logger");

const router = express.Router();

/**
 * @swagger
 * /email/test:
 *   post:
 *     summary: Enviar um e-mail de teste
 *     description: Envia um e-mail de teste para o endereço fornecido.
 *     tags: [E-mail]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "teste@email.com"
 *     responses:
 *       200:
 *         description: E-mail enviado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "E-mail enviado com sucesso para teste@email.com"
 *       500:
 *         description: Erro ao enviar e-mail.
 */
router.post("/test", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "O campo 'email' é obrigatório." });
    }

    await transporter.sendMail({
      from: '"Gerenciador de Tarefas" <brunopaulon@outlook.com.br>',
      to: email,
      subject: "Teste de E-mail",
      text: "Este é um e-mail de teste enviado pelo Gerenciador de Tarefas.",
      html: "<p><strong>Este é um e-mail de teste</strong> enviado pelo Gerenciador de Tarefas.</p>",
    });

    logger.info(`E-mail de teste enviado para ${email}`);
    res.json({ message: `E-mail enviado com sucesso para ${email}` });
  } catch (error) {
    logger.error("Erro ao enviar e-mail:", error);
    res.status(500).json({ error: "Erro ao enviar e-mail" });
  }
});

module.exports = router;
