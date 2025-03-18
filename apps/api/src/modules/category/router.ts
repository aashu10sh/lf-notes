import { Hono } from "hono";
import { getCurrentUser } from "../auth/middlewares/getCurrentUser";
import categoryCreationValidator from "./entities/request/category";
import CategoryController from "./controller";
import CategoryService from "./service";
import verifyNoteBody from "./entities/request/verifyNote";

const categoryRouter = new Hono();

const categoryController = new CategoryController(
  CategoryService.NewCategoryServices(),
);

categoryRouter.get("/", getCurrentUser, categoryController.getUsersCategories);

categoryRouter.post(
  "/",
  getCurrentUser,
  categoryCreationValidator,
  categoryController.createCategory,
);

categoryRouter.get(
  "/:noteId",
  getCurrentUser,
  categoryController.getNoteCategories,
);

categoryRouter.post(
  "/:noteId",
  getCurrentUser,
  verifyNoteBody,
  categoryController.addCategoryToNote,
);

categoryRouter.delete(
  "/:noteId",
  getCurrentUser,
  verifyNoteBody,
  categoryController.deleteCategoryFromNote,
);

export default categoryRouter;
