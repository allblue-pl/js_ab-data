export default class ABDColumnRef {
    #private;
    get columnName(): string;
    get tableName(): string;
    constructor(tableName: string, columnName: string);
}
