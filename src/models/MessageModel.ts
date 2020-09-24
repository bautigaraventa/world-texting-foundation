import { v4 as uuidv4 } from 'uuid';

/**
 * Message Model structure
 */
export class MessageModel {

    /**
     * Unique Identifier
     */
    public id: string;
    
    /**
     * Determines if it's being pcessed (taken by a consumer)
     */
    public isBeingProcessed: boolean;

    /**
     * The exact message
     */
    public message: string;

    /**
     * Additional information of the message
     */
    public payload: any;

    /**
     *  Model Contructor
     */
    constructor(message: string, payload: any) {
        this.id = uuidv4();
        this.isBeingProcessed = false;
        this.message = message;
        this.payload = payload;
    }
}
