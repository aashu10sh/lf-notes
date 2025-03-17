import { Hono } from "hono";
import NoteController from "./controller";
import NoteService from "./service";
import { getCurrentUser } from "../auth/middlewares/getCurrentUser";
import noteCreationValidator from "./entities/requests/note";

const noteRouter = new Hono();

const noteController = new NoteController(await NoteService.NewNoteService());

noteRouter.post(
  "/",
  getCurrentUser,
  noteCreationValidator,
  noteController.createNote,
);

noteRouter.get("/", getCurrentUser, noteController.getMany);

noteRouter.get("/:noteId", getCurrentUser, noteController.getOne);

noteRouter.delete("/:noteId", getCurrentUser, noteController.deleteNote);

noteRouter.put("/:noteId", getCurrentUser, noteController.updateNote);

export default noteRouter;
