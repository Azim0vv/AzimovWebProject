import { Sequelize, DataTypes } from 'sequelize';
import UserModel from '/AzimovWeb/models/user.js'


const sequelize = new Sequelize('AzimovWeb', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
});

const Articles = sequelize.define('Articles', {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    text: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    tags: {
        type: DataTypes.TEXT,
        defaultValue: '[]',
        get() {
            const rawValue = this.getDataValue('tags');
            return JSON.parse(rawValue || '[]');
        },
        set(value) {
            this.setDataValue('tags', JSON.stringify(value || []));
        },
    },
    viewsCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    date: {
        type: Sequelize.DATE,
        allowNull: false,
    },
    user: { 
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id',
        },
    },
});


sequelize.sync()
    .then(() => {
        console.log('Таблица Articles создана успешна');
    })
    .catch((error) => {
        console.error('При создании таблицы Articles произошла ошибка', error);
    });
    Articles.belongsTo(UserModel, { foreignKey: 'user', as: 'UserId' });

export default Articles;