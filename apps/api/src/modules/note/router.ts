import { Hono } from "hono";
import NoteController from "./controller";
import NoteService from "./service";
import { getCurrentUser } from "../auth/middlewares/getCurrentUser";

const noteRouter = new Hono();

const noteController = new NoteController(await NoteService.NewNoteService());

noteRouter.post("/", getCurrentUser, noteController.createNote);

export default noteRouter;
