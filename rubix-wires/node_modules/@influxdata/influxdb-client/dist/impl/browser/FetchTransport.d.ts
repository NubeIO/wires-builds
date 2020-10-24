import { Transport, SendOptions, CommunicationObserver } from '../../transport';
import { ConnectionOptions } from '../../options';
/**
 * Transport layer that use browser fetch.
 */
export default class FetchTransport implements Transport {
    private connectionOptions;
    chunkCombiner: import("../../transport").ChunkCombiner;
    private defaultHeaders;
    constructor(connectionOptions: ConnectionOptions);
    send(path: string, body: string, options: SendOptions, callbacks?: Partial<CommunicationObserver<Uint8Array>> | undefined): void;
    request(path: string, body: any, options: SendOptions): Promise<any>;
    private fetch;
}
//# sourceMappingURL=FetchTransport.d.ts.map