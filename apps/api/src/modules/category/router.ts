import { Hono } from "hono";
import { getCurrentUser } from "../auth/middlewares/getCurrentUser";
import categoryCreationValidator from "./entities/request/category";
import CategoryController from "./controller";
import CategoryService from "./service";

const categoryRouter = new Hono();

const categoryController = new CategoryController(
   CategoryService.NewCategoryServices(),
);


console.log(categoryController);

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
  categoryController.getPostsCategories,
);


export default categoryRouter