import PostUser from '../models/PostUser.js';
import UserModel from '../models/user.js';

export const getAll = async (req, res) => {
  try {
    const posts = await PostUser.findAll({
      include: [
        {
          model: UserModel,
          as: 'UserId',
        },
      ],
    });

    res.json(posts);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось получить статьи',
    });
  }
};

export const create = async (req, res) => {
  try {
    const currentDate = new Date();
    const doc = new PostUser({
      title: req.body.title,
      text: req.body.text,
      tags: req.body.tags,
      viewsCount: req.body.viewsCount,
      date: new Date(),
      user: req.body.user,
    });

    const post = await doc.save();
    res.json(post);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось создать запись',
    });
  }
};

export const getOne = async (req, res) => {
    try {
      const postId = req.params.id;
  
      // Ищем и обновляем статью по ID
      const updatedPost = await PostUser.findOne({
        where: {
          id: postId,
        },
        include: [
          {
            model: UserModel,
          as: 'UserId',
          },
        ],
      });
  
      if (!updatedPost) {
        return res.status(404).json({
          message: 'Статья не найдена',
        });
      }
  
      // Инкрементируем значение viewsCount
      await updatedPost.increment('viewsCount');
  
      res.json(updatedPost);
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: 'Не удалось получить статью',
      });
    }
};

export const remove = async (req, res) => {
    try {
      const postId = req.params.id;
  
      // Ищем статью по ID и удаляем её
      const deletedCount = await PostUser.destroy({
        where: {
          id: postId,
        },
      });
  
      if (deletedCount === 0) {
        return res.status(404).json({
          message: 'Статья не найдена',
        });
      }
  
      res.json({
        success: 'Статья успешно удалена',
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: 'Не удалось удалить статью',
      });
    }
};

export const update = async (req, res) => {
    try {
      const postId = req.params.id;
  
      // Проверка наличия req.body.tags перед использованием метода split
      const tags = req.body.tags ? req.body.tags.split(',') : [];
  
      // Ищем статью по ID и обновляем её
      const [updatedCount] = await PostUser.update(
        {
          title: req.body.title,
          text: req.body.text,
          imageUrl: req.body.imageUrl,
          user: req.userId,
          tags: tags,
        },
        {
          where: {
            id: postId,
          },
        }
      );
  
      if (updatedCount === 0) {
        return res.status(404).json({
          message: 'Статья не найдена',
        });
      }
  
      res.json({
        success: true,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: 'Не удалось обновить статью',
      });
    }
};
  
