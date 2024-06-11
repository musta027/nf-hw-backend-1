import { Request, Response } from 'express';
import { CreateEventDto } from './dtos/CreateEvent.dot';
import EventService from './event-service';
import { Event } from './types/response';

interface PaginationProps {
    page: number;
    limit:number;
}

class EventController {
    private eventService : EventService;


    constructor(eventService : EventService){
        this.eventService = eventService;
    }

    createEvent = (req:Request,res:Response) =>{
        try{
            const event: CreateEventDto = req.body;
            const newEvent = this.eventService.createEvent(event);
            res.status(201).json(newEvent);
        }catch(error:any){
            res.status(500).json({ error: error.message });
        }
    }

    PaginateEvents = (items: Event[] | null, page:number, limit:number) => {
        if(items === null || (page - 1) * limit >= items.length) return [];
        return items.slice((page - 1) * limit, page*limit);
    }

    Sort = (items: Event[] | null, sortBy:string, sortDirection:string) => {
        if(sortDirection === 'desc') {
            items?.sort((a:Event, b:Event) => {
                if(a.id > b.id) return -1;
                return 1;
            });
            return items;
        } else {
                items?.sort((a:Event, b:Event) => {
                    if(a.id < b.id) return -1;
                    return 1;
                })
                return items;
        }
    }

    getEvents  = async (req:Request, res:Response) =>{
        try{
            const {page = 1, limit = 1, sortBy, sortDirection} = req.query;
            if(sortDirection != null && (sortDirection !== 'desc' && sortDirection !== 'asc')) {
                res.status(401).json({error: "Wrong sort direction"});
            }
            if(req.user === null) {
                const events: Event[] = this.eventService.getEvents();
                res.status(200).json(this.Sort(this.PaginateEvents(events, (page as any), (limit as any)), (sortBy as any), (sortDirection as any)));   
            } else {
                const user = await this.eventService.getUserById((req.user as any).id);
                // console.log(user);
                const events:Event[] | null = this.eventService.getEventsByCity((user as any).city);
                res.status(200).json(this.Sort(this.PaginateEvents(events, (page as any), (limit as any)), (sortBy as any), (sortDirection as any)));   
            }
        }catch (error: any) {
            res.status(500).json({ error: error.message });
          }
    }

    getEventById = (req:Request, res:Response) =>{
        try{
            const params = req.params;
            const id = parseInt(params.id);
            const event = this.eventService.getEventById(id);
            if(!event){
                res.status(404).json({error:"Event not found"});
            }else{
                res.status(200).json(event);
            }
        }catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
}

export default EventController;