import ts0, { ts0Assert, TS0AssertError, TS0List,                                     } from "@allblue/ts0"
import f from "./abd-fields/index.js";
import ABDFieldValidator, {                             } from "./abd-validators/ABDFieldValidator.js";
import Validator from "./Validator.js";
                                            
                                                     
                                            
                                            

class TableDef {
    #alias        ;
    #autoIncrementColumn             ;
    #columns                     ;
    #columnValidators                          ;
    #id        ;
    #indexes                     ;
    #name        ;
    #primaryKeys                    ;


    get alias()         {
        return this.#alias;
    }

    get autoIncrement()          {
        return this.#autoIncrementColumn !== null;
    }

    get columns()                      {
        return this.#columns;
    }

    get indexes()                      {
        return this.#indexes;
    }

    get name()         {
        return this.#name;
    }

    get pks()                {
        if (this.#autoIncrementColumn !== null)
            return [ this.#autoIncrementColumn ];

        ts0Assert(this.#primaryKeys !== null, "Table with 'ABDAutoIncremenet'`" +
                " column does not haves primary keys.");

        return this.#primaryKeys;
    }

    constructor(id        , name        , alias        , columns  
                                                                ) {
        this.#id = id;
        this.#name = name;
        this.#alias = alias;
        this.#primaryKeys = null;
        this.#autoIncrementColumn = null;
        this.#columnValidators = {};
        this.#indexes = {};

        this.#columns = new TS0List();
        for (let column of columns) {
            let name = column[0];
            let field = column[1];
            let fieldValidatorArgs = column[2];
            if (fieldValidatorArgs === undefined)
                fieldValidatorArgs = {};

            this.#columns.set(name, {
                field: field,
                fieldValidator: field.getFieldValidator(fieldValidatorArgs),
                index: this.#columns.size,
                select: name,
            });

            if (field instanceof f.ABDAutoIncrementId) {
                this.#autoIncrementColumn = name;
                this.#primaryKeys = null;
            }
        }
    }

    addColumnValidator(columnName        , fieldValidator                   )  
                     {
        if (!this.hasColumn(columnName))
            throw new Error(`Column '${columnName}' does not exist.`);

        if (!(columnName in this.#columnValidators))
            this.#columnValidators[columnName] = [];

        this.#columnValidators[columnName].push(fieldValidator);

        return this;
    }

    getColumn(columnName        )                     {
        if (!this.#columns.has(columnName))
            throw new Error(`Column '${columnName}' does not exist.`);

        return this.#columns.get(columnName);
    }

    getColumn_Field(columnName        )           {
        return this.getColumn(columnName).field;
    }

    getColumnIndex(columnName        )         {
        return this.getColumn(columnName).index;
    }

    getColumnNames()                {
        return this.#columns.getKeys();
    }

    getColumnValidators(columnName        )                           {
        let column = this.getColumn(columnName);
        let validators = [ column.fieldValidator ];
        if (!(columnName in this.#columnValidators))
            return validators;

        for (let columnValidator of this.#columnValidators[columnName])
            validators.push(columnValidator);

        return validators;
    }

    getSelectColumnInfo(columnName        )                       {
        let column = this.getColumn(columnName);

        return [ column.select, column.field ];
    }

    getTableId()         {
        return this.#id;
    }

    getTableName()         {
        return this.#name;
    }

    getValidatorInfos()                         {
        let validatorInfo                         = {};
        for (let [ columnName, column ] of this.#columns) {
            validatorInfo[columnName] = {
                field: {
                    type: column.fieldValidator.getType(),
                    args: column.fieldValidator.args,
                },
                validators: [],
            };

            if (columnName in this.#columnValidators) {
                for (let columnValidator of this.#columnValidators[columnName]) {
                    validatorInfo[columnName].validators.push({
                        type: columnValidator.getType(),
                        args: columnValidator.args,
                    });
                }
            }
        }

        return validatorInfo;
    }
    
    hasColumn(columnName        )          {
        return this.#columns.has(columnName);
    }

    setIndexes(indexes                                                   )           {
        for (let indexName in indexes) {
            for (let indexColumn of indexes[indexName]) {
                let columnName = indexColumn[0];
                if (!this.hasColumn(columnName))
                        throw new Error(`Index column '${columnName}' does not exist.`);
            }
        }
        
        this.#indexes = {};
        for (let indexName in indexes) {
            this.#indexes[this.name + '-' + indexName] = [];
            for (let indexColumn of indexes[indexName]) {
                this.#indexes[this.name + '-' + indexName].push({
                    name: indexColumn[0], 
                    desc: indexColumn[1],
                });
            }
        }

        return this;
    }

    setPKs(primaryKeys               )           {
        if (this.#autoIncrementColumn !== null)
            throw new Error(`Cannot set PKs for the table with 'ABDAutoIncrement' column.`);

        for (let columnName of primaryKeys) {
            if (!this.hasColumn(columnName))
                throw new Error(`Cannot set PKs. Column '${columnName}' does not exist.`);
            if (!this.#columns.get(columnName).field.notNull)
                throw new Error(`Primary Key '${columnName}' must be 'notNull'.`);
        }

        this.#autoIncrementColumn = null;
        this.#primaryKeys = primaryKeys;

        return this;
    }

    validateColumn(validator           , validatorFieldName        , 
            columnName        , value             )       {
        validator.addField(validatorFieldName, value);

        let column = this.getColumn(columnName);
        // let column_ValidatorField = column.field.getFieldValidator(
        //         column.fieldValidatorInfo);

        validator.addFieldValidator(validatorFieldName, column.fieldValidator);
        if (columnName in this.#columnValidators) {
            for (let fieldValidator of this.#columnValidators[columnName])
                validator.addFieldValidator(validatorFieldName, fieldValidator);
        }
    }

    validateRow(validator           , row                                     , 
            columns                                      = null)       {
        if (columns === null) {
            columns = {};
            for (let [ columnName, column ] of this.columns)
                columns[columnName] = columnName;
        }

        for (let columnName in columns) {
            if (!(columnName in row))
                throw new Error(`Column '${columnName}' not set in row.`);
            if (typeof row[columnName] === 'undefined')
                throw new Error(`Column '${columnName}' is 'undefined' in row.`);

            this.validateColumn(validator, columns[columnName], columnName,
                    row[columnName]);
        }
    }

    validateRow_Default(validator           , row                                     , 
            ignoreColumns                = [])       {
        let columns                                 = {};
        for (let [ columnName, column ] of this.columns) {
            if (columnName === '_Modified_DateTime')
                continue;

            if (!ignoreColumns.includes(columnName))
                columns[columnName] = columnName;
        }

        this.validateRow(validator, row, columns);
    }

    validateRow_Default_Columns(validator           , row                                     , 
            columnNames                = [])       {
        let columns                                 = {};
        for (let columnName of columnNames) {
            if (!this.hasColumn(columnName))
                throw new Error(`Column '${columnName}' does not exist.`);

            columns[columnName] = columnName;
        }

        this.validateRow(validator, row, columns);
    }
}
export default TableDef;


                                                               
                 
                  
    

                           
                    
                                      
                  
                   
  
                                                               

                                                                                 

                                                             
            
                     
                           
      
                       
                     
                           
       
   