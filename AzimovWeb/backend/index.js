import express from 'express';
import { Sequelize } from 'sequelize';
import { registerValidation, loginValidation, postCreateValidation } from '/AzimovWeb/validations/validations.js';
import CheckAuth from '../utils/CheckAuth.js';
import * as UserControllers from '../controllers/UserControllers.js';
import * as PostControllers from '../controllers/PostContlollers.js'
import multer from 'multer';
import handleValidationError from '../validations/handleValidationError.js';

const app = express();
const storage = multer.diskStorage({
  destination: (_, __, cd) => {
    cd(null, 'uploads');
  },
  filename: (_, file, cd) => {
    cd(null, file.originalname);
  },
});
const upload = multer({ storage });
const sequelize = new Sequelize('azimovweb', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
});

app.use(express.json());
app.use('/uploads/', express.static('uploads'));


app.get('/', (req, res) => res.send('hello'));
app.post('/upload', CheckAuth, upload.single('image'), (req, res) => {
  res.json({ url: `/uploads/${req.file.originalname}` });
});
app.post('/auth/register', registerValidation, handleValidationError, UserControllers.register);
app.post('/auth/login', loginValidation, handleValidationError, UserControllers.login);
app.get('/auth/me', CheckAuth, UserControllers.getMe);
app.get('/posts', CheckAuth, PostControllers.getAll);
app.get('/posts/:id', CheckAuth, PostControllers.getOne);
app.post('/posts', CheckAuth, postCreateValidation, handleValidationError, PostControllers.create);
app.patch('/posts/:id', CheckAuth, postCreateValidation, handleValidationError, PostControllers.update);
app.delete('/posts/:id', CheckAuth, PostControllers.remove);

const PORT = process.env.PORT || 3001;

try {
  await sequelize.sync();
  app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });
} catch (error) {
  console.error('Ошибка сервера: ', error);
}
