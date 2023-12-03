import jwt from 'jsonwebtoken';

const jwtMiddleware = (req, res, next) => {

  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ message: "Token is not valid" });
      }

      req.user = user;
      next();
    });
  } else {
    res.status(401).json({ message: "Authorization header not found" });
  }
};

export default jwtMiddleware;
