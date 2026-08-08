import ts0 from "@allblue/ts0"
import ABDField from "./abd-fields/ABDField.js";
import DatabaseVersion, {                   } from "./DatabaseVersion.js";

export default class FieldInfo {
    static CompareDBType(field          , dbVersion                 , 
            dbType        , dbExtra        )          {
        return field.compareDBType(dbVersion, dbType, dbExtra);
    }


    #dbExtra        ;
    #dbType        ;
    #name        ;
    #notNull         ;


    get dbExtra()         {
        return this.#dbExtra;
    }

    get dbType()         {
        return this.#dbType;
    }

    get name()         {
        return this.#name;
    }

    get notNull()          {
        return this.#notNull;
    }

    constructor(name        , dbType        , notNull         , dbExtra        ) {
        this.#name = name;
        this.#dbType = dbType;
        this.#notNull = notNull;
        this.#dbExtra = dbExtra;
    }
}