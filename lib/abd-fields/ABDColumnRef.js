
export default class ABDColumnRef {
    #columnName        ;
    #tableName        ;

    get columnName()         {
        return this.#columnName;
    }

    get tableName()         {
        return this.#tableName;
    }

    constructor(tableName        , columnName        ) {
        this.#tableName = tableName;
        this.#columnName = columnName;
    }
}