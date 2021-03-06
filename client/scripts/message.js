class Message 
{
    requestType = null;
    data = null;
    lastResponse = null;
    callback = null;
    eventHandler = null;

    constructor(req, d, clientHandler)
    {
        this.requestType = req;
        this.data = d;
        this.callback = clientHandler;

        this.handler = (backgroundResponse) =>
        {
            this.lastResponse = backgroundResponse;
            if (this.callback != null)
            {
                this.callback(backgroundResponse);
            }
            
        }
    }

    sendMessage()
    {
        let msg = {
            req: this.requestType,
            data: this.data
        };

        chrome.runtime.sendMessage(msg, this.handler);
    }
}

/*
Example usage:
    var myMessage = new Message();
    myMessage.requestType = "test";
    myMessage.data = data;
    myMessage.callback = (response) => {console.log(response);};
    myMessage.sendMessage();
    

    OR
    var msg = new Message("test", "test data", (response)=>{console.log(response);});
    msg.sendMessage();
*/