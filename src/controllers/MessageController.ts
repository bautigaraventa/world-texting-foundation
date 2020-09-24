import { Request, Response } from "express";
import { messageService } from "../services/MessageService";

/**
 * Message Controller to manage everything related to a Message
 */
export class MessageController {

    //#region Methods

    /**
     * Returns all available Messages to process
     * @param req 
     * @param res 
     */
    public receive = (req: Request, res: Response) => {
        try {
            const result = messageService.receive(Number(req.query.qty));
            res.status(200).send(result);
        } catch (error) {
            res.status(500).send({
                error: error.message,
            });
        }
    }

    /**
     * Creates, stores and returns a Message to be processed by a Consumer
     * @param req 
     * @param res 
     */
    public send = (req: Request, res: Response) => {
        try {
            const result = messageService.send(req.body);
            res.status(200).send(result);
        } catch (error) {
            res.status(500).send({
                error: error.message,
            });
        }
    }

    /**
     * Deletes a successfully processed Message 
     * @param req 
     * @param res 
     */
    public markAsProcessed = (req: Request, res: Response) => {
        try {
            const result = messageService.markAsProcessed(req.params.messageId);
            res.status(200).send(result);
        } catch (error) {
            res.status(500).send({
                error: error.message,
            });
        }
    }

    //#endregion

}

export const messageController = new MessageController();