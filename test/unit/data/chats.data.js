const { expect } = require('chai');
const sinon = require('sinon');

const ChatsData = require('../../../data/chats.data');
const Message = require('../../../models/message');

describe('ChatsData', () => {
    const db = {
        collection: () => { },
    };

    let chats = [];
    const isValidMessage = () => {
        return true;
    };
    const validator = {
        isValidMessage,
    };
    let data = null;

    const toArray = () => {
        return Promise.resolve(chats);
    };

    const find = (chat) => {
        return {
            toArray,
        };
    };

    const newMessage = {
        room: 'Some event chat',
        content: 'message',
        user: 'user',
        time: '15:00',
        avatar: 'my photo',
    };
    const insertOne = (message) => {
        chats.push(newMessage);
    };

    const remove = (room) => {
        chats.pop();
    };

    beforeEach(() => {
        chats = [{
            _id: '596b1d2cfef2e82704d679e4',
            room: 'Some event chat',
            user: 'user',
            content: 'some message',
            time: 'time',
            avatar: 'some avatar',
        }];

        sinon.stub(db, 'collection')
            .callsFake(() => {
                return { find, insertOne, remove };
            });
        sinon.stub(validator, 'isValidMessage')
            .callsFake(() => {
                return isValidMessage;
            });

        data = new ChatsData(db, validator);
    });

    afterEach(() => {
        db.collection.restore();
        validator.isValidMessage.restore();
    });

    describe('getLatestMessages()', () => {
        it('expect to return the latest messages in chat room', () => {
            data.getLatestMessages('Some event chat')
                .then((foundMessages) => {
                    expect(foundMessages).to.be.deep.equal(chats);
                });
        });
    });

    describe('addMessage()', () => {
        it('expect to add message if isValidMessage returns true', () => {
            const messageToAdd = {
                room: 'Some event chat',
                content: 'message',
                user: 'user',
                time: '15:00',
                avatar: 'my photo',
            };

            data.addMessage(messageToAdd);
            expect(chats).to.deep.include(new Message(messageToAdd));
        });

        it('expect not to add message if isValidMessage returns false', () => {
            validator.isValidMessage.restore();
            sinon.stub(validator, 'isValidMessage')
                .callsFake(() => {
                    return false;
                });

            const messageToAdd = {
                room: 'Some event chat',
                content: 'message',
                user: 'user',
                time: '15:00',
                avatar: 'my photo',
            };
            data.addMessage(messageToAdd);

            expect(chats).to.not.deep.include(new Message(messageToAdd));
        });
    });

    describe('removeChatRoom()', () => {
        it('expect to remove chat room', () => {
            data.removeChatRoom('Some event chat');
            expect(chats.length).to.be.equal(0);
        });
    });
});
