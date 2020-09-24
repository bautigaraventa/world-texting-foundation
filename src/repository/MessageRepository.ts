import { IRepository } from "./IRepository";
import { database } from "./Database";
import { MessageModel } from "../models/MessageModel";

/**
 * Database access implementation for the entity "Message"
 */
export class MessageRepository implements IRepository {

    /**
     * Creates, stores and returns a Message
     * @param body Body to create a Message
     */
    create(body: any): MessageModel {
        try {
            const message = new MessageModel(body.message, body.payload);

            database.messages.push(message);

            return message;
        } catch (error) {
            throw new Error(`Error creating a message`);
        }
    }

    /**
     * Deletes a message from the storage
     * @param id Unique id to identify the Message to delete
     */
    delete(id: string): void {
        const messageToDeleteIndex = database.messages.findIndex((m) => m.id === id);
        if (messageToDeleteIndex === -1) {
            throw new Error(`Invalid ID: ${id}`);
        }

        database.messages.splice(messageToDeleteIndex, 1);
    }

    /**
     * Returns all Messages from the storage
     */
    getAll(): MessageModel[] {
        try {
            return database.messages;
        } catch (error) {
            throw new Error(`Error getting messages`);
        }
    }

    /**
     * Returns a Message from the storage
     * @param id Unique id to identify the Message
     */
    getOne(id: any): MessageModel {
        try {
            return database.messages.find((m) => m.id === id);
        } catch (error) {
            throw new Error(`Error getting message with id ${id}`);
        }
    }

    /**
     * Updates and returns a Message
     * @param id Unique id to identify the Message
     * @param body body to update the Message
     */
    update(id: string, body: any): MessageModel {
        const messageToUpdateIndex: number = database.messages.findIndex((m) => m.id === id);
        if (messageToUpdateIndex === -1) {
            throw new Error(`Invalid ID: ${id}`);
        }

        let messageToUpdate: MessageModel = database.messages[messageToUpdateIndex];

        database.messages[messageToUpdateIndex] = { ...messageToUpdate, ...body };

        return database.messages[messageToUpdateIndex];
    }

}

export const messageRepository = new MessageRepository();