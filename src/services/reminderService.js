// src/services/reminderService.js
const cron = require('node-cron');
const dayjs = require('dayjs');
const Task = require('../models/Task');
const User = require('../models/User');
const transporter = require('../config/mailer'); // se quiser enviar e-mail
const logger = require('../config/logger');

/**
 * Executa uma verificação todos os dias às 09:00
 * Ex.: "0 9 * * *" (minuto=0, hora=9, qualquer dia, qualquer mês, qualquer diaSemana)
 */
cron.schedule('0 9 * * *', async () => {
  try {
    logger.info('Iniciando verificação de lembretes de tarefas...');
    
    const now = dayjs();
    const tomorrow = now.add(1, 'day');

    // Buscar tarefas pendentes ou em-andamento
    const tasks = await Task.find({
      status: { $in: ['pendente', 'em-andamento'] },
      dataVencimento: { $lte: tomorrow.toDate(), $gte: now.toDate() }
    });

    for (const task of tasks) {
      // buscar user assigned
      if (!task.assignedTo) continue;
      
      const user = await User.findById(task.assignedTo);
      if (!user) continue;

     // Enviar email com o lembrete
      await transporter.sendMail({
        from: '"Gerenciador de Tarefas" <brunopaulon@outlook.com.br>',
        to: user.email,
        subject: `Lembrete: Tarefa "${task.titulo}" vence em breve!`,
        text: `Olá, ${user.nome}.\nA tarefa "${task.titulo}" vence em breve (até ${dayjs(task.dataVencimento).format('DD/MM/YYYY')}).\nStatus: ${task.status}\nDescrição: ${task.descricao}`
      });

      logger.info(`Lembrete enviado para ${user.email} sobre a tarefa ${task._id}`);
    }

  } catch (error) {
    logger.error('Erro no reminderService:', error);
  }
});
