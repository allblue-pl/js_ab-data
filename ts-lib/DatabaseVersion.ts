import ts0 from "@allblue/ts0"

class DatabaseVersion {
    #type: DatabaseType;
    #version: DatabaseVersionNumber;

    get type(): DatabaseType {
        return this.#type;
    }

    get version(): DatabaseVersionNumber {
        return this.#version;
    }

    constructor(type: DatabaseType, version: DatabaseVersionNumber) {
        this.#type = type,
        this.#version = [...version];
    }
}
export default DatabaseVersion;

export type DatabaseType = "mysql"|"scheme"|"sqlite";
export type DatabaseVersionNumber = [ number, number, number ];