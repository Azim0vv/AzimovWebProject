import jwt from 'jsonwebtoken';

export default (req, res, next) => {
    const token = (req.headers.authorization || '').replace('Bearer ', '');
    const strippedToken = token.replace(/"/g, '');

    if (token) {
        try {
          const decoded = jwt.verify(token, 'secret123');
    
          req.user = decoded._id;
          next();
        } catch (e) {
          return res.status(403).json({
            message: 'Нет доступа',
          });
        }
      } else {
        return res.status(403).json({
          message: 'Нет доступа',
        });
      }
};
