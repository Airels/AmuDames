import { Observable } from 'rxjs';

export class WebSocketService {
    webSocket!: WebSocket;

    constructor() {

    }

    public createObservableSocket(url: string) : Observable<String> {
        this.webSocket = new WebSocket(url);

        return new Observable((res: any) => {
            this.webSocket.onmessage = (message) => res.next(message.data);
            this.webSocket.onerror = (message) => res.error(message);
            this.webSocket.onclose = (message) => res.complete();
        });
    }

    public sendMessage(message: any) {
        this.webSocket.send(message);
    }
}