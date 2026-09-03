
export class abUUID_Class {
    #byteToHex: string[];
    #rnds8: Uint8Array<ArrayBuffer>;
    #state: State;

    constructor() {
        this.#rnds8 = new Uint8Array(16);
        this.#state = {
            msecs: -Infinity,
            seq: 0,
        };
        this.#byteToHex = [];
        for (let i = 0; i < 256; ++i)
            this.#byteToHex.push((i + 0x100).toString(16).slice(1));
    }

    generate(): string {
        let bytes: Uint8Array;

        const rnds = crypto.getRandomValues(this.#rnds8);

        this.#updateState(rnds);

        bytes = this.#getBytes(rnds);

        return this.#unsafeStringify(bytes);
    }

    getTime(uuid: string): number {
        const hexTimestamp = uuid.replace(/-/g, '').slice(0, 12);
        return parseInt(hexTimestamp, 16);
    }

    validate(uuid: string): boolean {
        return /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
                .test(uuid);
    }

    #getBytes(rnds: Uint8Array): Uint8Array {
        let offset = 0;

        let buf = new Uint8Array(16);
        offset = 0;

        // byte 0-5: timestamp (48 bits)
        buf[offset++] = (this.#state.msecs / 0x10000000000) & 0xff;
        buf[offset++] = (this.#state.msecs / 0x100000000) & 0xff;
        buf[offset++] = (this.#state.msecs / 0x1000000) & 0xff;
        buf[offset++] = (this.#state.msecs / 0x10000) & 0xff;
        buf[offset++] = (this.#state.msecs / 0x100) & 0xff;
        buf[offset++] = this.#state.msecs & 0xff;

        // byte 6: `version` (4 bits) | sequence bits 28-31 (4 bits)
        buf[offset++] = 0x70 | ((this.#state.seq >>> 28) & 0x0f);

        // byte 7: sequence bits 20-27 (8 bits)
        buf[offset++] = (this.#state.seq >>> 20) & 0xff;

        // byte 8: `variant` (2 bits) | sequence bits 14-19 (6 bits)
        buf[offset++] = 0x80 | ((this.#state.seq >>> 14) & 0x3f);

        // byte 9: sequence bits 6-13 (8 bits)
        buf[offset++] = (this.#state.seq >>> 6) & 0xff;

        // byte 10: sequence bits 0-5 (6 bits) | random (2 bits)
        buf[offset++] = ((this.#state.seq << 2) & 0xff) | (rnds[10] & 0x03);

        // bytes 11-15: random (40 bits)
        buf[offset++] = rnds[11];
        buf[offset++] = rnds[12];
        buf[offset++] = rnds[13];
        buf[offset++] = rnds[14];
        buf[offset++] = rnds[15];

        return buf;
    }

    #getSequence(rnds: Uint8Array): number {
        return ((rnds[6] & 0x7f) << 24) | (rnds[7] << 16) | (rnds[8] << 8) | rnds[9];
    }

    #unsafeStringify(arr: Uint8Array, offset = 0): string {
        return (
            this.#byteToHex[arr[offset + 0]] +
            this.#byteToHex[arr[offset + 1]] +
            this.#byteToHex[arr[offset + 2]] +
            this.#byteToHex[arr[offset + 3]] +
            '-' +
            this.#byteToHex[arr[offset + 4]] +
            this.#byteToHex[arr[offset + 5]] +
            '-' +
            this.#byteToHex[arr[offset + 6]] +
            this.#byteToHex[arr[offset + 7]] +
            '-' +
            this.#byteToHex[arr[offset + 8]] +
            this.#byteToHex[arr[offset + 9]] +
            '-' +
            this.#byteToHex[arr[offset + 10]] +
            this.#byteToHex[arr[offset + 11]] +
            this.#byteToHex[arr[offset + 12]] +
            this.#byteToHex[arr[offset + 13]] +
            this.#byteToHex[arr[offset + 14]] +
            this.#byteToHex[arr[offset + 15]]
        ).toLowerCase();
    }

    #updateState(rnds: Uint8Array): void {
        const now = Date.now();

        if (now > this.#state.msecs) {
            this.#state.seq = this.#getSequence(rnds);
            this.#state.msecs = now;
        } else {
            this.#state.seq = (this.#state.seq + 1) | 0;

            if (this.#state.seq === 0)
                this.#state.msecs++;
        }
    }
}
const abUUID = new abUUID_Class();
export default abUUID;

type State = {
  msecs: number;
  seq: number;
}