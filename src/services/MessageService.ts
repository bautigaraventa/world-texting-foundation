import { messageRepository } from "../repository/MessageRepository";
import { MessageModel } from "models/MessageModel";

/**
 * Message Service to manage extra functionalities
 */
export class MessageService {

    //#region Properties

    private messageProcessingTimeMs: number;

    //#endregion

    //#region Constructor

    constructor() {
        this.messageProcessingTimeMs = Number(process.env.MESSAGE_PROCESSING_TIME_MS);
    }

    //#endregion

    //#region Methods

    /**
     * Returns all available Messages to process and schedules the timeout to process it
     */
    public receive = (qty: number = undefined) => {
        try {
            let filteredMessages: MessageModel[] = this.getAvailableMessages();
            if (qty < filteredMessages.length) {
                filteredMessages = filteredMessages.splice(0, qty);
            }
            if (filteredMessages.length) {
                filteredMessages.forEach(fm => {
                    messageService.setMessageProcessingTimeout(fm.id);
                    messageRepository.update(fm.id, { isBeingProcessed: true });
                });
            }

            return {
                messages: filteredMessages,
            }
        } catch (error) {
            throw error;
        }
    }

    /**
     * Creates, stores and returns a Message to be processed by a Consumer
     * @param body Body to create the Message with
     */
    public send = (body: any) => {
        try {
            const messageCreated: MessageModel = messageRepository.create(body);
            return {
                id: messageCreated.id,
            }
        } catch (error) {
            throw error;
        }
    }

    /**
     * Deletes a successfully processed Message 
     * @param messageId Unique Identifier of the message to mark
     */
    public markAsProcessed = (messageId: string) => {
        try {
            const messageToDelete = messageRepository.getOne(messageId);
            if (!messageToDelete?.isBeingProcessed) {
                throw new Error(`The message time to process has expired`);
            }

            messageRepository.delete(messageId);

            return {
                id: messageId,
            }
        } catch (error) {
            throw error;
        }
    }

    /**
     * Sets a timer to run after a defined time 
     * @param id Unique id to identify the Message to set the timer
     */
    public setMessageProcessingTimeout = (id: string) => {
        setTimeout(() => this.timeoutHandler(id), this.messageProcessingTimeMs);
    }

    /**
     * Handles the timeout of a message processing time
     * @param id Unique id to identify the Message
     */
    private timeoutHandler = (id: string) => {
        const messageToUpdate = messageRepository.getOne(id);
        if (messageToUpdate?.isBeingProcessed) {
            messageRepository.update(id, { isBeingProcessed: false })
        }
    }

    /**
     * Returns all available Messages to be processed
     */
    private getAvailableMessages = () => {
        const allMessages: MessageModel[] = messageRepository.getAll();
        return allMessages.filter((m) => !m.isBeingProcessed);
    }

    //#endregion

}

export const messageService = new MessageService();
