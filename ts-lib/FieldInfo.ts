import ts0 from "@allblue/ts0"
import ABDField from "./abd-fields/ABDField.ts";
import DatabaseVersion, { type DatabaseType } from "./DatabaseVersion.ts";

export default class FieldInfo {
    static CompareDBType(field: ABDField, dbVersion: DatabaseVersion, 
            dbType: string, dbExtra: string): boolean {
        return field.compareDBType(dbVersion, dbType, dbExtra);
    }


    #dbExtra: string;
    #dbType: string;
    #name: string;
    #notNull: boolean;


    get dbExtra(): string {
        return this.#dbExtra;
    }

    get dbType(): string {
        return this.#dbType;
    }

    get name(): string {
        return this.#name;
    }

    get notNull(): boolean {
        return this.#notNull;
    }

    constructor(name: string, dbType: string, notNull: boolean, dbExtra: string) {
        this.#name = name;
        this.#dbType = dbType;
        this.#notNull = notNull;
        this.#dbExtra = dbExtra;
    }
}