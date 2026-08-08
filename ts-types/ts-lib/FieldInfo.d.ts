import ABDField from "./abd-fields/ABDField.ts";
import DatabaseVersion from "./DatabaseVersion.ts";
export default class FieldInfo {
    #private;
    static CompareDBType(field: ABDField, dbVersion: DatabaseVersion, dbType: string, dbExtra: string): boolean;
    get dbExtra(): string;
    get dbType(): string;
    get name(): string;
    get notNull(): boolean;
    constructor(name: string, dbType: string, notNull: boolean, dbExtra: string);
}
