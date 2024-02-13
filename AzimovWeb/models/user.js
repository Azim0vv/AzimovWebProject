import { Sequelize, DataTypes } from 'sequelize';

const sequelize = new Sequelize('AzimovWeb', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
  });

const UserModel = sequelize.define('User', {
    fullname: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    passwordHash: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    devices: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    date: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
      },
  });
  

  UserModel.sync()
    .then(() => {
      console.log('Таблица User создана успешно');
    })
    .catch((error) => {
      console.error('Ошибка при создание таблицы', error);
    });
  
export default UserModel;


