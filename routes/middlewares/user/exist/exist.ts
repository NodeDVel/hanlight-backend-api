import { NextFunction, Request, Response } from 'express';

import CustomError from '@Middleware/error/customError';
import User from '@Model/user.model';

const exist = (req: Request, res: Response, next: NextFunction) => {
  const { key, value } = req.query;

  User.findOne({
    where: {
      [key]: value,
    },
  })
    .then((user: User) =>
      res.json({
        success: true,
        data: {
          exist: !!user,
        },
      })
    )
    .catch(err => {
      console.log(err);
      next(new CustomError({ name: 'Database_Error' }));
    });
};

export default exist;
