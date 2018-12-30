const  {WebSocketServer} = require("../server");
let server;
beforeAll(()=> {
    server = new WebSocketServer(3030);
});

describe("Test client(puppeter) send message to server", () => {
    it('Should be able to receive a message from client', async (done) => {
        const clientMsg = () => 'outroTexto';
        await page.exposeFunction('clientMsg', clientMsg);
        //Server
        server.onReceive = (msg) => {
            expect(msg).toBe(clientMsg());
            done();
        }
        //Client
        await page.evaluate(() => {
            return new Promise((resolve,_)=>{
                const client = new WebSocket("ws://localhost:3030");
                client.onopen = async () => {
                    client.send(await clientMsg());
                    resolve(true)
                };
             });
            
        });

    });
  });

afterAll(()=> {
    server.close();
});