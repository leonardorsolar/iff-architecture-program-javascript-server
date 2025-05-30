// Importa os tipos Request e Response do Express para tipagem
import { Request, Response } from 'express';
// Importa a função responsável por salvar o usuário no banco de dados
import { saveUserToDatabase } from '../bancodados/database';

// Define a classe responsável por controlar as ações relacionadas ao usuário
export class ControladorUsuario {
  constructor() {}
  // Método assíncrono para criar um novo usuário
  public async criarUsuario(req: Request, res: Response): Promise<void> {
    console.log('ControladorUsuario'); // Log para depuração
    console.log(req.body); // Exibe os dados recebidos no corpo da requisição
    try {
      const { name, email, password } = req.body;
      // === REGRAS DE NEGÓCIO ===
      //São regras que definem como o sistema deve funcionar de acordo com o domínio da aplicação.

      // Verifica se todos os campos obrigatórios foram enviados
      if (!name || !email || !password) {
        res.status(400).json({ error: 'Nome, email e senha são obrigatórios.' });
        return;
      }
      // Verifica se o nome tem pelo menos 3 caracteres
      if (name.length < 3) {
        res.status(400).json({ error: 'O nome deve ter no mínimo 3 caracteres.' });
        return;
      }
      // Verifica se o email é válido usando uma expressão regular simples
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        res.status(400).json({ error: 'Formato de email inválido.' });
        return;
      }
      // Verifica se a senha tem pelo menos 6 caracteres
      if (password.length < 6) {
        res.status(400).json({ error: 'A senha deve ter no mínimo 6 caracteres.' });
        return;
      }

      // Chama a função para salvar o usuário no banco de dados
      //ação de infraestrutura, mais especificamente, uma operação de persistência de dados.
      const result = await saveUserToDatabase(name, email, password);
      // Responde com status 201 (Criado) e o resultado
      res.status(201).json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
