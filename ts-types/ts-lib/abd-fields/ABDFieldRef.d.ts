export default class ABDFieldRef {
    #private;
    get columnName(): string;
    get tableName(): string;
    constructor(tableName: string, columnName: string);
}
