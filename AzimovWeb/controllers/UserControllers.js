import bcrypt from 'bcrypt';
import UserModel from '/AzimovWeb/models/user.js';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
    const { email } = req.body;
  
    const existingUser = await UserModel.findOne({ where: { email } });
  
    if (existingUser) {
      return res.status(400).json({ error: 'Email уже используется' });
    }
  
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
  
    try {
      const user = await UserModel.create({
        fullname: req.body.fullname,
        passwordHash,
        date: new Date(),
        devices: req.body.devices,
        email: req.body.email,
      }, { tableName: 'Users' });
  
      const token = jwt.sign(
        {
          _id: user.id, // Используйте только идентификатор пользователя
        },
        'secret123',
        {
          expiresIn: '30d',
        }
      );
  
      res.json({ user, token });
    } catch (error) {
      console.error('Error creating user', error);
      res.status(500).json({
        message: 'Не удалось зарегистрироваться',
      });
    }
};

export const login = async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await UserModel.findOne({ where: { email } });
  
      if (!user) {
        return res.status(400).json({
          message: 'Неверный логин или пароль',
        });
      }
  
      const isValidPass = await bcrypt.compare(password, user.passwordHash);
  
      if (!isValidPass) {
        return res.status(400).json({
          message: 'Неверный логин или пароль',
        });
      }
  
      const token = jwt.sign(
        {
          _id: user.id, // Используйте только идентификатор пользователя
        },
        'secret123',
        {
          expiresIn: '30d',
        }
      );
      res.json({ user, token });
  
    } catch (err) {
      console.error(err);
      res.status(500).json({
        message: 'Произошла ошибка во время входа',
      });
    }
};

export const getMe = async (req, res) => {
    try {
      const user = await UserModel.findOne({ where: { id: req.user } });
  
      if (!user) {
        return res.status(404).json({
          message: 'Пользователь не найден',
        });
      }
  
      const token = jwt.sign(
        {
          _id: user.id, // Используйте только идентификатор пользователя
        },
        'secret123',
        {
          expiresIn: '30d',
        }
      );
      res.json({ user, token });
  
    } catch (err) {
      console.error(err);
      res.status(500).json({
        message: 'Произошла ошибка при получении информации о пользователе',
        err,
      });
    }
}