import * as express from "express";
import { messageController } from "../controllers/MessageController";
import { messageValidator } from '../validators/MessageValidators';

class MessageRoutes {
    private baseUrl = '/messages';
    public router: express.Router = express.Router();

    constructor() {
        this.init();
    }

    private init(): void {

        this.router.get(
            `${this.baseUrl}`,
            messageValidator.receive,
            messageController.receive,
        );

        this.router.post(
            `${this.baseUrl}`,
            messageValidator.send,
            messageController.send,
        );

        this.router.put(
            `${this.baseUrl}/:messageId/`,
            messageValidator.markAsProcessed,
            messageController.markAsProcessed,
        );
    }
}

export const messageRoutes = new MessageRoutes().router;