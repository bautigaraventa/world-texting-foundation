import { MessageRepository } from './MessageRepository';
import { MessageModel } from '../models/MessageModel';
import { database } from './Database';

let messageRepositoryTest: MessageRepository;

beforeEach(() => {
    messageRepositoryTest = new MessageRepository();
});

describe('Function: create', () => {

    it('Given a Message body, should return an instance of MessageModel', async (done) => {
        // Arrange
        const messageTextDummy = 'messageTest';
        const payloadDummy = {};
        const messageDummy = {
            message: messageTextDummy,
            payload: payloadDummy,
        }
        let result;

        // Act
        try {
            result = messageRepositoryTest.create(messageDummy);
        } catch (error) {
            done(error);
        }

        // Assert
        expect(result).toBeInstanceOf(MessageModel);
        done();
    });

    it('Given a Message body, should call database.messages.push once', async (done) => {
        // Arrange
        const messageTextDummy = 'messageTest';
        const payloadDummy = {};
        const messageDummy = {
            message: messageTextDummy,
            payload: payloadDummy,
        }
        database.messages.push = jest.fn();

        // Act
        try {
            messageRepositoryTest.create(messageDummy);
        } catch (error) {
            done(error);
        }

        // Assert
        expect(database.messages.push).toBeCalledTimes(1);
        done();
    });

    it('Given a Message body, when MessageModel fails, should throw an error', async (done) => {
        // Arrange
        const messageTextDummy = 'messageTest';
        const payloadDummy = {};
        const messageDummy = {
            message: messageTextDummy,
            payload: payloadDummy,
        }
        database.messages.push = jest.fn().mockImplementation(() => { throw new Error(`Error creating a message`) });

        // Act
        // Assert
        expect(() => messageRepositoryTest.create(messageDummy)).toThrow();
        done();
    });

});

describe('Function: delete', () => {

    it('Given an existing id, should call database.messages.splice once', async (done) => {
        // Arrange
        const idDummy = 'abc123';
        database.messages.findIndex = jest.fn().mockReturnValue(2);
        database.messages.splice = jest.fn();

        // Act
        try {
            messageRepositoryTest.delete(idDummy);
        } catch (error) {
            done(error);
        }

        // Assert
        expect(database.messages.splice).toBeCalledTimes(1);
        done();
    });

    it('Given an unexisting id, should throw an error', async (done) => {
        // Arrange
        const idDummy = 'abc123';
        database.messages.findIndex = jest.fn().mockReturnValue(-1);

        // Act
        // Assert
        expect(() => messageRepositoryTest.delete(idDummy)).toThrow();
        done();
    });

});

describe('Function: getAll', () => {

    it('Should return messages from database', async (done) => {
        // Arrange
        const databaseMessagesDummy = [
            { id: '1' } as MessageModel,
            { id: '2' } as MessageModel,
            { id: '3' } as MessageModel,
        ];
        database.messages = databaseMessagesDummy;
        let result;

        // Act
        try {
            result = messageRepositoryTest.getAll();
        } catch (error) {
            done(error);
        }

        // Assert
        expect(result).toStrictEqual(databaseMessagesDummy);
        done();
    });

});

describe('Function: getOne', () => {

    it('Given an existing id, should return the message from storage', async (done) => {
        // Arrange
        const idDummy = '2';
        const databaseMessagesDummy = [
            { id: '1' } as MessageModel,
            { id: '2' } as MessageModel,
            { id: '3' } as MessageModel,
        ];
        database.messages = databaseMessagesDummy;
        let result;

        // Act
        try {
            result = messageRepositoryTest.getOne(idDummy);
        } catch (error) {
            done(error);
        }

        // Assert
        expect(result).toStrictEqual({ id: '2' });
        done();
    });

    it('Given an unexisting id, should return undefined', async (done) => {
        // Arrange
        const idDummy = 'abc123';
        const databaseMessagesDummy = [
            { id: '1' } as MessageModel,
            { id: '2' } as MessageModel,
            { id: '3' } as MessageModel,
        ];
        database.messages = databaseMessagesDummy;
        let result;

        // Act
        try {
            result = messageRepositoryTest.getOne(idDummy);
        } catch (error) {
            done(error);
        }

        // Assert
        expect(result).toBe(undefined);
        done();
    });

    it('If find on storage fails, should throw an error', async (done) => {
        // Arrange
        const idDummy = 'abc123';
        database.messages.find = jest.fn().mockImplementation(() => { throw new Error(`Error creating a message`) });

        // Act
        // Assert
        expect(() => messageRepositoryTest.getOne(idDummy)).toThrow();
        done();
    });

});

describe('Function: update', () => {

    it('Given an existing id and a body, should return the message updated', async (done) => {
        // Arrange
        const idDummy = 'abc123';
        const oldMessage = {
            id: 'abc123',
            message: 'messageTest',
            isBeingProcessed: true,
        } as MessageModel;

        const databaseMessagesDummy = [
            oldMessage as MessageModel,
            { id: '2' } as MessageModel,
            { id: '3' } as MessageModel,
        ];

        const bodyDummy = {
            isBeingProcessed: false,
        };

        database.messages = databaseMessagesDummy;
        const updatedMessage = {
            id: 'abc123',
            message: 'messageTest',
            isBeingProcessed: false,
        } as MessageModel;
        let result;

        // Act
        try {
            result = messageRepositoryTest.update(idDummy, bodyDummy);
        } catch (error) {
            done(error);
        }

        // Assert
        expect(result).toStrictEqual(updatedMessage);
        done();
    });

    it('Given an unexisting id, should return throw error', async (done) => {
        // Arrange
        const idDummy = 'abc123';
        const databaseMessagesDummy = [
            { id: '1' } as MessageModel,
            { id: '2' } as MessageModel,
            { id: '3' } as MessageModel,
        ];
        database.messages = databaseMessagesDummy;

        const bodyDummy = {
            isBeingProcessed: false,
        };

        // Act
        // Assert
        expect(() => messageRepositoryTest.update(idDummy, bodyDummy)).toThrow();
        done();
    });

});