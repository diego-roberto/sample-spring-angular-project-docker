import { environment } from 'environments/environment';
import * as SockJs from 'sockjs-client';

export class CustomStompConfig {

    url = new SockJs(environment.backendUrl + '/ws');

    headers = {};

    heartbeat_in = 0;
    heartbeat_out = 20000;

    reconnect_delay = 5000;

    // debug = environment.profile == EnumEnvProfile.DEV;
    debug = false;
}
