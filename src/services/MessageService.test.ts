import { MessageService } from './MessageService';
import { messageRepository } from '../repository/MessageRepository';

let messageServiceTest: MessageService;

beforeEach(() => {
    process.env.MESSAGE_PROCESSING_TIME_MS = '0';
    messageServiceTest = new MessageService();
});

describe('Function: receive', () => {

    it('Given no qty, should return all messages on storage', async (done) => {
        // Arrange
        const databaseMessagesDummy = [
            { id: '1' },
            { id: '2' },
            { id: '3' },
        ];
        messageServiceTest['getAvailableMessages'] = jest.fn().mockReturnValue(databaseMessagesDummy);
        messageServiceTest['setMessageProcessingTimeout'] = jest.fn();
        messageRepository.update = jest.fn();
        let result;

        // Act
        try {
            result = messageServiceTest.receive();
        } catch (error) {
            done(error);
        }

        // Assert
        expect(result).toStrictEqual({ messages: databaseMessagesDummy });
        done();
    });

    it('Given qty lower than messages on storage, should return first qty messages', async (done) => {
        // Arrange
        const databaseMessagesDummy = [
            { id: '1' },
            { id: '2' },
            { id: '3' },
        ];
        messageServiceTest['getAvailableMessages'] = jest.fn().mockReturnValue(databaseMessagesDummy);
        messageServiceTest['setMessageProcessingTimeout'] = jest.fn();
        messageRepository.update = jest.fn();
        const qtyDummy = 2;
        const databaseMessagesDummyFiltered = [
            { id: '1' },
            { id: '2' }
        ];
        let result;

        // Act
        try {
            result = messageServiceTest.receive(qtyDummy);
        } catch (error) {
            done(error);
        }

        // Assert
        expect(result).toStrictEqual({ messages: databaseMessagesDummyFiltered });
        done();
    });

    it('Given qty higher than messages on storage, should return all available messages', async (done) => {
        // Arrange
        const databaseMessagesDummy = [{ id: '1' }, { id: '2' }, { id: '3' }];
        messageServiceTest['getAvailableMessages'] = jest.fn().mockReturnValue(databaseMessagesDummy);
        messageServiceTest['setMessageProcessingTimeout'] = jest.fn();
        messageRepository.update = jest.fn();
        const qtyDummy = 10;
        let result;

        // Act
        try {
            result = messageServiceTest.receive(qtyDummy);
        } catch (error) {
            done(error);
        }

        // Assert
        expect(result).toStrictEqual({ messages: databaseMessagesDummy });
        done();
    });

});

describe('Function: send', () => {

    it('Given a message body, should return the id of the created Message', async (done) => {
        // Arrange
        const bodyDummy = {
            message: 'testMessage',
        };
        messageRepository.create = jest.fn().mockReturnValue({ id: '5' });
        let result;

        // Act
        try {
            result = messageServiceTest.send(bodyDummy);
        } catch (error) {
            done(error);
        }

        // Assert
        expect(result).toStrictEqual({ id: '5' });
        done();
    });

    it('If messageRepository.create fails, should throw an error', async (done) => {
        // Arrange
        const bodyDummy = {
            message: 'testMessage',
        };
        messageRepository.create = jest.fn().mockImplementation(() => { throw new Error(`Error creating a message`) });

        // Act
        // Assert
        expect(() => messageServiceTest.send(bodyDummy)).toThrow();
        done();
    });

});

describe('Function: markAsProcessed', () => {

    it('Given an existing id, should return the id of the deleted Message', async (done) => {
        // Arrange
        const idDummy = 'abc123';
        messageRepository.getOne = jest.fn().mockReturnValue({ id: idDummy, isBeingProcessed: true });
        messageRepository.delete = jest.fn();
        let result;

        // Act
        try {
            result = messageServiceTest.markAsProcessed(idDummy);
        } catch (error) {
            done(error);
        }

        // Assert
        expect(result).toStrictEqual({ id: idDummy });
        done();
    });

    it('Given an unexisting id, should throw error', async (done) => {
        // Arrange
        const idDummy = 'abc123';
        messageRepository.getOne = jest.fn().mockReturnValue(null);
        messageRepository.delete = jest.fn();

        // Act
        // Assert
        expect(() => messageServiceTest.markAsProcessed(idDummy)).toThrow();
        done();
    });

    it('Given an existing id of a message not being processed, should throw error', async (done) => {
        // Arrange
        const idDummy = 'abc123';
        messageRepository.getOne = jest.fn().mockReturnValue({ id: idDummy, isBeingProcessed: false });
        messageRepository.delete = jest.fn();

        // Act
        // Assert
        expect(() => messageServiceTest.markAsProcessed(idDummy)).toThrow();
        done();
    });

});


describe('Function: getAvailableMessages', () => {

    it('Should return all not beingProcessed messages from storage', async (done) => {
        // Arrange
        const allMessagesDummy = [
            {id: '1', isBeingProcessed: true},
            {id: '2', isBeingProcessed: false},
            {id: '3', isBeingProcessed: true},
        ]
        messageRepository.getAll = jest.fn().mockReturnValue(allMessagesDummy);
        const allMessagesFilteredDummy = [
            {id: '2', isBeingProcessed: false},
        ]
        let result;

        // Act
        try {
            result = messageServiceTest['getAvailableMessages']();
        } catch (error) {
            done(error);
        }

        // Assert
        expect(result).toStrictEqual(allMessagesFilteredDummy);
        done();
    });

    it('Given an unexisting id, should throw error', async (done) => {
        // Arrange
        const idDummy = 'abc123';
        messageRepository.getOne = jest.fn().mockReturnValue(null);
        messageRepository.delete = jest.fn();

        // Act
        // Assert
        expect(() => messageServiceTest.markAsProcessed(idDummy)).toThrow();
        done();
    });

    it('Given an existing id of a message not being processed, should throw error', async (done) => {
        // Arrange
        const idDummy = 'abc123';
        messageRepository.getOne = jest.fn().mockReturnValue({ id: idDummy, isBeingProcessed: false });
        messageRepository.delete = jest.fn();

        // Act
        // Assert
        expect(() => messageServiceTest.markAsProcessed(idDummy)).toThrow();
        done();
    });

});

describe('Function: timeoutHandler', () => {

    it('Should call messageRepository.getOne once', async (done) => {
        // Arrange
        messageRepository.getOne = jest.fn();
        const idDummy = 'abc123';

        // Act
        try {
            messageServiceTest['timeoutHandler'](idDummy);
        } catch (error) {
            done(error);
        }

        // Assert
        expect(messageRepository.getOne).toBeCalledTimes(1);
        done();
    });

    it('Given an unexisting id of a message, should call messageRepository.update 0 times', async (done) => {
        // Arrange
        messageRepository.getOne = jest.fn().mockReturnValue(null);
        messageRepository.update = jest.fn();
        const idDummy = 'abc123';

        // Act
        try {
            messageServiceTest['timeoutHandler'](idDummy);
        } catch (error) {
            done(error);
        }

        // Assert
        expect(messageRepository.update).toBeCalledTimes(0);
        done();
    });

    it('Given an existing id of a message with isBeingProcessed:false, should call messageRepository.update 0 times', async (done) => {
        // Arrange
        const messageDummy = {
            id: 'abc123',
            message: 'testMessage',
            isBeingProcessed: false,
        };
        messageRepository.getOne = jest.fn().mockReturnValue(messageDummy);
        messageRepository.update = jest.fn();
        const idDummy = 'abc123';

        // Act
        try {
            messageServiceTest['timeoutHandler'](idDummy);
        } catch (error) {
            done(error);
        }

        // Assert
        expect(messageRepository.update).toBeCalledTimes(0);
        done();
    });

    it('Given an existing id of a message with isBeingProcessed:true, should call messageRepository.update 1 time', async (done) => {
        // Arrange
        const messageDummy = {
            id: 'abc123',
            message: 'testMessage',
            isBeingProcessed: true,
        };
        messageRepository.getOne = jest.fn().mockReturnValue(messageDummy);
        messageRepository.update = jest.fn();
        const idDummy = 'abc123';

        // Act
        try {
            messageServiceTest['timeoutHandler'](idDummy);
        } catch (error) {
            done(error);
        }

        // Assert
        expect(messageRepository.update).toBeCalledTimes(1);
        done();
    });

    it('Given an existing id of a message with isBeingProcessed:true, should call messageRepository.update with this id as first parameter', async (done) => {
        // Arrange
        const messageDummy = {
            id: 'abc123',
            message: 'testMessage',
            isBeingProcessed: true,
        };
        messageRepository.getOne = jest.fn().mockReturnValue(messageDummy);
        messageRepository.update = jest.fn();
        const idDummy = 'abc123';

        // Act
        try {
            messageServiceTest['timeoutHandler'](idDummy);
        } catch (error) {
            done(error);
        }

        // Assert
        expect(messageRepository.update).toBeCalledWith(idDummy, expect.anything());
        done();
    });

    it('Given an existing id of a message with isBeingProcessed:true, should call messageRepository.update with {isBeingProcessed: false} as the second parameter', async (done) => {
        // Arrange
        const messageDummy = {
            id: 'abc123',
            message: 'testMessage',
            isBeingProcessed: true,
        };
        messageRepository.getOne = jest.fn().mockReturnValue(messageDummy);
        messageRepository.update = jest.fn();
        const idDummy = 'abc123';
        const updateDummy = { isBeingProcessed: false };

        // Act
        try {
            messageServiceTest['timeoutHandler'](idDummy);
        } catch (error) {
            done(error);
        }

        // Assert
        expect(messageRepository.update).toBeCalledWith(expect.anything(), updateDummy);
        done();
    });
});
