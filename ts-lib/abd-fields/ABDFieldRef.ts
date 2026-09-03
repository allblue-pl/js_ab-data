
export default class ABDFieldRef {
    #columnName: string;
    #tableName: string;

    get columnName(): string {
        return this.#columnName;
    }

    get tableName(): string {
        return this.#tableName;
    }

    constructor(tableName: string, columnName: string) {
        this.#tableName = tableName;
        this.#columnName = columnName;
    }
}