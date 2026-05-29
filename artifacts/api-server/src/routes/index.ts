import { Router, type IRouter } from "express";
import healthRouter from "./health";
import newsRouter from "./news";
import bannersRouter from "./banners";
import statisticsRouter from "./statistics";
import galleryRouter from "./gallery";
import contactsRouter from "./contacts";
import contentRouter from "./content";
import adminRouter from "./admin";

const router: IRouter = Router();

router.use(healthRouter);
router.use(newsRouter);
router.use(bannersRouter);
router.use(statisticsRouter);
router.use(galleryRouter);
router.use(contactsRouter);
router.use(contentRouter);
router.use(adminRouter);

export default router;
