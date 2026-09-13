import { ts0Helper, TS0List } from "@allblue/ts0";
                                                          
                                          
                                                     
                                                             

export default class TableDefVariant {
    #columns                                        ;
    #columns_Extra                                        ;
    #def          ;
    #name        ;

    get columns()                                         {
        return this.#columns;
    }

    get columns_Extra()                                         {
        return this.#columns_Extra;
    }

    get def()           {
        return this.#def;
    }

    get name()         {
        return this.#name;
    }


    constructor(name        , tablDef          ) {
        this.#def = tablDef;   
        this.#columns = new TS0List();
        this.#columns_Extra = new TS0List();
        this.#name = name;
    }

    addColumns(columns                                                           )                  {
        for (let column of columns) 
            this.#columns.set(column[0], column[1]);

        return this;
    }

    addColumns_Extra(columns                                                           )                  {
        for (let column of columns) 
            this.#columns_Extra.set(column[0], column[1]);

        return this;
    }

    addTableColumns(prefix        , tableDef          , columnNames                     = null)                  {
        if (columnNames === null)
            columnNames = tableDef.getColumnNames();

        for (let columnName of columnNames) {
            let column = tableDef.getColumn(columnName);
            this.#columns.set(prefix + columnName, column.field);
        }

        return this;
    }

    addTableColumns_Extra(prefix        , tableDef          , columnNames                     = null)                  {
         if (columnNames === null)
            columnNames = tableDef.getColumnNames();

        for (let columnName of columnNames) {
            let column = tableDef.getColumn(columnName);
            this.#columns_Extra.set(prefix + columnName, column.field);
        }

        return this;
    }
}