import { NextFunction, Request, Response } from 'express';
import { Op } from 'sequelize';

import CustomError from '@Middleware/error/customError';
import Notice from '@Model/notice.model';
import NoticeLog from '@Model/noticeLog.model';

const getNotice = async (req: Request, res: Response, next: NextFunction) => {
  const limit = 15;
  const seachType: 'list' | 'post' = req.query.type;
  const searchPage = (req.query.page && req.query.page - 1) || 0;
  const searchId = req.query.id;
  const searchTitle = req.query.title;

  try {
    let notice: Notice | Notice[];
    if (seachType === 'post') {
      notice = await Notice.findOne({
        where: {
          pk: searchId,
        },
        attributes: ['pk', 'title', 'content', 'updatedAt'],
      });
    } else {
      const whereClause = {
        title: (searchTitle && { [Op.like]: `%${searchTitle}%` }) || undefined,
      };
      await Object.keys(whereClause).forEach(key => whereClause[key] === undefined && delete whereClause[key]);

      notice = await Notice.findAll({
        where: whereClause,
        offset: searchPage * limit,
        limit,
        attributes: ['pk', 'title', 'updatedAt'],
      });
    }

    if (Array.isArray(notice)) {
      const noticePks = notice.map(val => val.pk);
      const logs = await NoticeLog.findAll({
        where: {
          user_pk: res.locals.user.pk,
          notice_pk: noticePks,
        },
      });
      res.locals.notice = await notice.map(val => {
        const EditedNotice = {
          pk: val.pk,
          title: val.title,
          updatedAt: val.updatedAt,
          read: false,
        };
        for (const log of logs) {
          if (val.pk === log.notice_pk) {
            EditedNotice.read = true;
          }
        }
        return EditedNotice;
      });
    } else {
      res.locals.notice = notice;
    }
    await next();
  } catch (error) {
    console.log(error);
    next(new CustomError({ name: 'Database_Error' }));
  }
};

export default getNotice;