import { Hono } from "hono";
import NoteController from "./controller";
import NoteService from "./service";
import { getCurrentUser } from "../auth/middlewares/getCurrentUser";
import noteCreationValidator from "./entities/requests/note";

const noteRouter = new Hono();

const noteController = new NoteController(await NoteService.NewNoteService());

noteRouter.post("/", getCurrentUser,noteCreationValidator, noteController.createNote);

export default noteRouter;
