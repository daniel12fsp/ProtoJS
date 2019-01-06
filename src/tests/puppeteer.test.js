const { WebSocketServer } = require("../server");
let server;
beforeAll(() => {
    server = new WebSocketServer(3030);
    page.on('console', (msg) => console.log('PAGE LOG:', msg.text));
});


describe("Test client(puppeter) send message to server", () => {
    it('Should Client be able to send a text', clientSendMsg("outroTexto"));
    it('Should Client be able to send a number', clientSendMsg(1, "1"));
    // TODO: Make possible to client send binary data
    xit('Should Client be able to send a buffer', clientSendMsg(new Int8Array([0x48, 0x61, 0x70, 0x70, 0x79, 0x20, 0x4e, 0x65, 0x77, 0x20, 0x59, 0x65, 0x61, 0x72, 0x21]).buffer));
    xit('Should Client be able to send a undefined', clientSendMsg(undefined));
});

describe("Test server send message to client", () => {
    it('Should Server be able to send a text', serverSendMsg("outroTexto"));
    it('Should Server be able to send a number', serverSendMsg(1, "1"));
});

afterAll(() => {
    server.close();
});


function clientSendMsg(message, expected) {
    expected = expected || message;
    return async function (done) {

        //Server
        server.onReceive = (msg) => {
            expect(msg).toBe(expected);
            done();
        }
        //Client
        await page.evaluate((message) => {
            return new Promise((resolve, _) => {
                const socket = new WebSocket("ws://localhost:3030");
                socket.onopen = async () => {
                    socket.send(message);
                    resolve(true)
                };
            });

        }, message);

    }
}

function serverSendMsg(message, expected) {
    expected = expected || message;
    return async function (done) {
        // Client
        await page.evaluate(() => {
            return new Promise(async (resolve, _) => {
                window.socket = new WebSocket("ws://localhost:3030");
                window.socket.onopen = resolve;

            })
        });

        // Server
        //Delay this send message when handle is not ready
        setTimeout(() => server.send(message));

        // Client
        const result = await page.evaluate(() => {
            return new Promise(async (resolve, _) => {
                window.socket.onmessage = function (event) {
                    resolve(event.data);
                }
            })
        });
        expect(result).toBe(expected);
        //Server
        done();

    }
}