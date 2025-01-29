// src/services/reminderService.js
const cron = require('node-cron');
const dayjs = require('dayjs');
const Task = require('../models/Task');
const User = require('../models/User');
const transporter = require('../config/mailer');
const logger = require('../config/logger');

// Executa todo dia às 09:00
cron.schedule('0 9 * * *', async () => {
  try {
    logger.info('Verificando tarefas próximas do vencimento...');

    const now = dayjs();
    const tomorrow = now.add(1, 'day');

    // Buscar tarefas pendentes que vencem em <24 horas
    const tasks = await Task.find({
      status: 'pendente',
      dataVencimento: { $gte: now.toDate(), $lte: tomorrow.toDate() }
    });

    for (const task of tasks) {
      const user = await User.findById(task.user);
      if (!user) continue;

      await transporter.sendMail({
        from: '"Gerenciador de Tarefas" <nao-responda@exemplo.com>',
        to: user.email,
        subject: `Lembrete: Tarefa "${task.titulo}" vence em breve!`,
        text: `Olá, ${user.nome}!\nA tarefa "${task.titulo}" vencerá em menos de 24 horas.\n\nDescrição: ${task.descricao}\nVencimento: ${task.dataVencimento}\n\nNão perca o prazo!`
      });

      logger.info(`Lembrete de vencimento enviado para ${user.email} sobre a tarefa ${task._id}`);
    }
  } catch (error) {
    logger.error('Erro no processo de lembrete:', error);
  }
});
