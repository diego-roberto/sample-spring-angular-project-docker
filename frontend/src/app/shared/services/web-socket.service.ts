import { environment } from 'environments/environment';
import { EnumEnvProfile } from 'environments/EnumEnvProfile';
import { CustomStompConfig } from 'app/shared/util/stomp.config';
import { Injectable } from '@angular/core';
import { StompService, StompState } from '@stomp/ng2-stompjs';
import { Message } from '@stomp/stompjs';
import * as SockJs from 'sockjs-client';

@Injectable()
export class WebSocketService {

    private readonly appEndpoint = '/app';

    private readonly userEndpoint = '/user';

    constructor(private stompService: StompService) {
        if (environment.profile == EnumEnvProfile.DEV) {
            stompService.state
                .map((state: number) => StompState[state])
                .subscribe((status: string) => {
                    console.log(`WebSocket Status: ${status}`);
                });
        }
    }

    connect(topic: string) {
        return this.stompService.subscribe(topic).map((message: Message) => {
            if (message.headers['content-type'] && /(application\/json)/.test(message.headers['content-type'])) {
                return Object.assign(JSON.parse(message.body));
            }
            return message.body;
        });
    }

    connectForUser(topic: String) {
        return this.connect(this.userEndpoint + topic);
    }

    send(channel: string, payload) {
        this.stompService.publish(this.appEndpoint + channel, JSON.stringify(payload));
    }

    disconnect() {
        this.stompService.disconnect();
    }
}
