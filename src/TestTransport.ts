import Message from './Message.js';
import Transport from './Transport.js';

export default class TestTransport extends Transport {




    message(message: Message) {
        console.log('test transport got message', message);
    }
}