import { Router } from 'express';
import EventController from './event-controller';
import EventService from './event-service';
import { eventMiddleware } from '../middlewares/event-middleware';

//in order to provide our frontend with the user data, we need to specify user routes

const eventRouter = Router();

const eventService = new EventService();
const eventController = new EventController(eventService);

eventRouter.get('/events/', eventMiddleware, eventController.getEvents);
eventRouter.post('/events/', eventController.createEvent);
eventRouter.get('/events/:id', eventController.getEventById);

export default eventRouter;
