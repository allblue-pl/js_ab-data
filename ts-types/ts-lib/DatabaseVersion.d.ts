declare class DatabaseVersion {
    #private;
    get type(): DatabaseType;
    get version(): DatabaseVersionNumber;
    constructor(type: DatabaseType, version: DatabaseVersionNumber);
}
export default DatabaseVersion;
export type DatabaseType = "mysql" | "scheme" | "sqlite";
export type DatabaseVersionNumber = [number, number, number];
