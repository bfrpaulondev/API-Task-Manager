// src/tests/user.test.js
const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');

describe('Testes de Usuário', () => {
  // Antes de tudo, conectar ao BD de teste
  beforeAll(async () => {
    // Idealmente, use um DB isolado (Ex: gerenciador_tarefas_test)
    await mongoose.connect(process.env.MONGO_URI_TEST, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  });

  // Após todos os testes, desconectar
  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('Deve registrar um novo usuário', async () => {
    const res = await request(app)
      .post('/usuarios/register')
      .send({
        nome: 'Teste User',
        email: `test${Date.now()}@example.com`,
        senha: '123456'
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('userId');
  });

  it('Deve logar o usuário', async () => {
    const email = `test${Date.now()}@example.com`;
    await request(app)
      .post('/usuarios/register')
      .send({ nome: 'User Login', email, senha: 'abc123' });

    const res = await request(app)
      .post('/usuarios/login')
      .send({ email, senha: 'abc123' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
  });
});
