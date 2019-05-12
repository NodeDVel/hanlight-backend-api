import { Router } from 'express';

import calendar from '@Controller/calendar.controller';
import dev from '@Controller/dev.controller';
import meal from '@Controller/meal.controller';
import notice from '@Controller/notice.controller';
import timetable from '@Controller/timetable.controller';
import user from '@Controller/user.controller';

// token
import getUserFromToken from '@Middleware/user/jwt/getUserFromToken';
import verifyToken from '@Middleware/user/jwt/veirfyToken';

const router = Router();

router.use('/dev', dev);
router.use('/user', user);

router.use(verifyToken, getUserFromToken);

router.use('/timetable', timetable);
router.use('/calendar', calendar);
router.use('/notice', notice);
router.use('/meal', meal);

export default router;
