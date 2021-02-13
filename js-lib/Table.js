'use strict';

const
    js0 = require('js0'),
    
    fields = require('./fields'),
    helper = require('./helper'),

    TableRequestDef = require('./scheme/TableRequestDef')
;

class Table
{

    get alias() {
        return this._alias;
    }

    get columns() {
        return this._columns;
    }

    get name() {
        return this._name;
    }

    get primaryKey() {
        return this._primaryKey;
    }

    get properties() {
        return this._properties;
    }

    constructor(id, name, alias, columns)
    {   
        js0.args(arguments, 'int', 'string', 'string', Array);

        this._id = id;
        this._name = name;
        this._alias = alias;
        this._primaryKey = null;
        this._columns = null;
        this._rowParser = null;
        this._columnValidators = {};

        if (name[0] !== '_') {
            columns = [
                [ '_Id', fields.Id({ notNull: true, }) ],
                [ '_Modified_DateTime', fields.Long({ notNull: false, }) ],
                // [ '_Modified_DeviceId', fields.Long({}) ],
            ].concat(columns);

            this.setPrimaryKey('_Id');
        }

        this._columns = new js0.List();
        for (let column of columns) {
            let name = column[0];
            let field = column[1];
            let fieldValidatorInfo = column.length > 2 ? column[2] : {};

            this._columns.set(name, {
                field: field,
                fieldValidator: field.getFieldValidator(fieldValidatorInfo),
            });
        }
    }

    addColumnValidator(columnName, fieldValidator)
    {
        js0.args(arguments, 'string', require('./validators/ABDFieldValidator'));

        if (!this.hasColumn(columnName))
            throw new Error(`Column '${columnName}' does not exist.`);

        if (!(columnName in this._columnValidators))
            this._columnValidators[columnName] = [];

        this._columnValidators[columnName].push(fieldValidator);

        return this;
    }

    async delete_Async(db, args = {})
    {
        js0.args(arguments, null, js0.Preset({
            where: [ Array, js0.Default([]) ],
        }, args));

        let tableName_DB = helper.quote(this.name);
        let query = `DELETE FROM ${tableName_DB}`;

        if (args.where !== null) {
            let where_Str = this.getQuery_Conditions(args.where);
            if (where_Str !== '')
                query += ' WHERE ' + where_Str;
        }

        await db.query_Execute_Async(query);
    }

    getColumn(columnName)
    {
        if (!this._columns.has(columnName))
            throw new Error(`Column '${columnName}' does not exist.`);

        return this._columns.get(columnName);
    }

    getColumn_Field(columnName)
    {
        return this.getColumn(columnName).field;
    }

    getColumnNames()
    {
        return this._columns.keys();
        // let columnNames = [];
        // for (let column of this._columns)
        //     columnNames.push(column.name);

        // return columnNames;
    }

    getTableId()
    {
        return this._id;
    }

    getTableName()
    {
        return this._name;
    }

    getValidatorInfo()
    {
        let validatorInfo = {};
        for (let [ columnName, column ] of this._columns)
            validatorInfo[columnName] = column.validatorInfos;

        return validatorInfo;
    }

    getQuery_Conditions(columnValues, tableOnly = false)
    {
        js0.args(arguments, Array, [ 'boolean', js0.Default ]);

        return this._getQuery_Conditions_Helper(columnValues, 'AND',
                tableOnly);
    }
    
    hasColumn(columnName)
    {
        return this._columns.has(columnName);
    }

    async row_Async(db, args = {})
    {
        js0.args(arguments, require('./native/Database'), 
                js0.Preset(TableRequestDef.Args_Select()));

        args.limit = [ 0, 1 ];

        let rows_DB = await this.select_Async(db, args);

        if (rows_DB.length === 0)
            return null;

        return rows_DB[0];
    }

    async select_Async(db, args = {})
    {
        js0.args(arguments, require('./native/Database'), 
                [ js0.RawObject, js0.Default ]);

        js0.typeE(args, js0.Preset(TableRequestDef.Args_Select()));

        let tableName_DB = helper.quote(this.name);
        let query = `SELECT * FROM ${tableName_DB}`;

        if (args.where !== null) {
            let where_Str = this.getQuery_Conditions(args.where);
            if (where_Str !== '')
                query += ' WHERE ' + where_Str;
        }

        if (args.orderBy.length > 0) {
            let orderBy_Arr = [];
            for (let orderBy of args.orderBy) {
                let column_Field = this.getColumn_Field(orderBy[0]);
                orderBy_Arr.push(column_Field.expr + orderBy[1] ? ' DESC' : '');
            }

            query += ' ORDER BY ' + orderBy_Arr.join(', ');
        }

        if (args.limit !== null)
            query += ` LIMIT ${args.limit[0]}, ${args.limit[1]}`;
        
        let columnTypes = [];
        for (let [ columnName, column ] of this.columns)
            columnTypes.push(column.field.getType());

        let rows_DB = await db.query_Select_Async(query, columnTypes);

        let rows = [];
        for (let result_Row of rows_DB) {
            let row = {};
            for (let i = 0; i < this.columns.size; i++) {
                row[this.columns.getKeyAt(i)] = this.columns.getAt(i).field
                        .unescape(result_Row[i]);
            }
            rows.push(row);
        }

        if (args.join.length > 0)
            rows = await this._join_Async(db, rows, args.join);

        return rows;
    }

    setPrimaryKey(primaryKey)
    {
        this._primaryKey = primaryKey;

        return this;
    }

    setRowParser(parserFn)
    {
        js0.args(arguments, 'function');

        this._rowParser = parserFn;
    }

    async update_Async(db, rows)
    {
        js0.args(arguments, require('./native/Database'), 
                js0.ArrayItems(js0.RawObject));

        if (rows.length === 0) {
            return {
                success: true,
                error: null,
            };
        };

        let pk = this.primaryKey;

        let rows_Insert = [];
        let rows_Update = [];

        let ids_ExistCheck = [];
        let rows_Left = [];
        for (let i = 0; i < rows.length; i++) {
            let row = rows[i];

            if (!(pk in row))
                throw new Error(`No Primary Key '${pk}' set in row '${i}'.`);

            rows_Left.push(row);
            ids_ExistCheck.push(row[pk]);

            // console.log(row[pk], this.getColumn_Field(pk).unescape(row[pk]));

            // if (this._columns.has('_Modified_DateTime'))
            //     row._Modified_DateTime = null; // (new Date()).getTime();
        }

        let rows_Existing = [];
        if (ids_ExistCheck.length > 0) {
            let rows_DB = await this.select_Async(db, {
                columns: [ pk ],
                where: [
                    [ pk, 'IN', ids_ExistCheck ],
                ],
            });

            rows_Existing = rows_DB;
        }

        let ids_Existing = [];
        for (let row of rows_Existing)
            ids_Existing.push(row[pk]);

        for (let row of rows_Left) {
            if (ids_Existing.includes(row[pk]))
                rows_Update.push(row);
            else
                rows_Insert.push(row);
        }

        let columns = new Map();
        // if (this._columns.has('_Modified_DateTime'))
        //     columns.set('_Modified_DateTime', fields.Time({ notNull: true }));

        let row_0 = rows[0];
        if (!(pk in row_0))
            throw new Error(`No pk set in rows.`);
        for (let columnName in rows[0])
            columns.set(columnName, this.getColumn_Field(columnName));
        // foreach ($rows[$first_key] as $col_name => $col_val) {
        //     if (!$ignore_not_existing) {
        //         columns[$col_name] = $this->getColumn($col_name, true);
        //     } else {
        //         if ($this->columnExists($col_name, true))
        //             columns[$col_name] = $this->getColumn($col_name, true);
        //     }
        // }

        // for (let i = 0; i < rows.length; i++) {
        //     let row = rows[i];

        //     if (row._Id === null) {
        //         row._Id = await db.getNextId_Async(this.getTableName());
        //         rows_Insert.push(row);
        //     } else
        //         rows_Update.push(row);

        //     row._Modified_DateTime = (new Date()).getTime();
        // }

        let tableName_DB = helper.quote(this.name);

        let query_Insert = null;
        if (rows_Insert.length > 0) {
            /* Column Names */
            let columnNames_DB = [];
            for (let [ columnName, column ] of columns)
                columnNames_DB.push(helper.quote(columnName));
            let columnNames_DB_Str = columnNames_DB.join(',');
        
            let values_DB_Arr = [];
            let ids = [];
            for (let i = 0; i < rows_Insert.length; i++) {
                let row = rows_Insert[i];
                let row_DB = [];

                for (let [ columnName, column ] of columns) {
                    if (!(columnName in row))
                        throw new Error(`Columns inconsistency in row '${i}'.`);
                    let column_Value = row[columnName];

                    row_DB.push(column.escape(column_Value));
                }

                values_DB_Arr.push('(' + row_DB.join(',') + ')');
            }
            let values_DB_Str = values_DB_Arr.join(',');

            query_Insert = `INSERT INTO ${tableName_DB} (${columnNames_DB_Str})` +
                ` VALUES ${values_DB_Str}`;
        }

        let query_Update = null;
        let id_Column = columns.get(pk);
        if (rows_Update.length > 0) {
            query_Update = `UPDATE ${tableName_DB} SET`;

            let ids_DB = [];
            let values_Arr = [];
            for (let [ columnName, column ] of columns) {
                let cases_DB_Arr = [];

                /* pk */
                if (columnName === pk) {
                    for (let i = 0; i < rows_Update.length; i++) {
                        let row = rows_Update[i];
                        if (!(columnName in row))
                            throw new Error(`Columns inconsistency in row '${i}'.`);
                        ids_DB.push(id_Column.escape(row[pk]));
                    }
                    continue;
                }

                /* Not pk */
                let columnName_DB = helper.quote(columnName);
                let query_Update_Values = ` ${columnName_DB}=CASE `;
                for (let i = 0; i < rows_Update.length; i++) {
                    let row = rows_Update[i];
                    if (!(columnName in row))
                        throw new Error(`Columns inconsistency in row '${i}'.`);
                    let id_DB = id_Column.escape(row[pk]);
                    
                    let value_DB = null;
                    try {
                        value_DB = column.escape(row[columnName]);
                    } catch (e) {
                        console.error(e);
                        throw new Error(`Cannot escape column '${columnName}'.`);
                    }

                    cases_DB_Arr.push(`WHEN ${pk}=${id_DB} THEN ${value_DB}`);
                }
                query_Update_Values += cases_DB_Arr.join(' ');
                query_Update_Values += ' END';

                values_Arr.push(query_Update_Values);
            }
            query_Update += values_Arr.join(',');
            query_Update += ` WHERE ${pk} IN (` + ids_DB.join(',') + ')';
        }

        let localTransaction = false;
        console.log('Test 2', db.transaction_IsAutocommit());
        if (db.transaction_IsAutocommit()) {
            localTransaction = true;
            await db.transaction_Start_Async();
        }
        
        if (query_Insert !== null) {
            // console.log('INSERT', query_Insert);
            await db.query_Execute_Async(query_Insert);
            // let affectedRows = db.getAffectedRows_Async();
        }

        if (query_Update !== null) {
            // console.log('UPDATE', query_Update);
            await db.query_Execute_Async(query_Update);
            // let affectedRows = db.getAffectedRows_Async();
        }

        if (localTransaction)
            await db.transaction_Finish_Async(true);

        return {
            success: true,
            error: null,
        };
    }

    // async updateRequests_Async(db, action, rows)
    // {
    //     js0.args(arguments, null, Array);

    //     let query = `INSERT INTO ${tableName_DB} (${columnNames_DB_Str})` +
    //             ` VALUES ${values_DB_Str}`
    // }

    validateColumn(validator, validatorFieldName, columnName, value)
    {
        js0.args(arguments, require('./Validator'), 'string', 'string', null);

        validator.addField(validatorFieldName, value);

        let column = this.getColumn(columnName);
        // let column_ValidatorField = column.field.getFieldValidator(
        //         column.fieldValidatorInfo);

        validator.addFieldValidator(validatorFieldName, column.fieldValidator);
        if (columnName in this._columnValidators) {
            for (let fieldValidator of this._columnValidators[columnName])
                validator.addFieldValidator(validatorFieldName, fieldValidator);
        }
    }

    validateRow(validator, row, columns = null)
    {
        js0.args(arguments, require('./Validator'), js0.RawObject,
                [ js0.Null, js0.RawObject, js0.Default() ]);

        if (columns === null) {
            columns = {};
            for (let [ columnName, column ] of this.columns)
                columns[columnName] = columnName;
        }

        for (let columnName in columns) {
            if (!(columnName in row))
                throw new Error(`Column '${columnName}' not set in row.`);

            this.validateColumn(validator, columns[columnName], columnName,
                    row[columnName]);
        }
    }

    validateRow_Default(validator, row, ignoreColumns = [])
    {
        js0.args(arguments, require('./Validator'), js0.RawObject,
                [ Array, js0.Default() ]);

        let columns = {};
        for (let [ columnName, column ] of this.columns) {
            if (columnName === '_Modified_DateTime')
                continue;

            if (!ignoreColumns.includes(columnName))
                columns[columnName] = columnName;
        }

        this.validateRow(validator, row, columns);
    }

    validateRow_Default_Columns(validator, row, columnNames = [])
    {
        js0.args(arguments, require('./Validator'), js0.RawObject,
                [ Array, js0.Default() ]);

        let columns = {};
        for (let columnName of columnNames) {
            if (!this.hasColumn(columnName))
                throw new Error(`Column '${columnName}' does not exist.`);

            columns[columnName] = columnName;
        }

        this.validateRow(validator, row, columns);
    }


    _getQuery_Conditions_Helper(columnValues, logicOperator, tableOnly = false)
    {
        js0.args(arguments, Array, [ 'string', js0.Null ], [ 'boolean', js0.Default ]);

        if (columnValues.length === 0)
            return '';

        let type = this._getQuery_Conditions_Helper_GetType(columnValues);

        if (type === 'conjuctionArray') {
            return this._getQuery_Conditions_Helper(columnValues[1],
                    columnValues[0], tableOnly);
        }

        if (type === 'conjuction') {
            if (logicOperator === null)
                logicOperator = 'AND';
                
            let args = [];
            for (let columnCondition of columnValues) {
                let columnCondition_Str = this._getQuery_Conditions_Helper(columnCondition,
                        null, tableOnly);
                if (columnCondition_Str !== '')
                    args.push('(' + columnCondition_Str + ')');
            }

            return args.join(` ${logicOperator} `)
        }

        if (type === 'condition') {
            let columnName = columnValues[0];
            let sign = columnValues[1];
            let value = columnValues[2];

            let column = this.getColumn_Field(columnName);

            // let columnName_DB = tableOnly ? Database.Quote(columnName) :
            //         this.getColumn(columnName).expression;
            let columnName_DB = helper.quote(columnName);

            let value_DB = null;
            if (sign === null) {
                value_DB = value;
                sign = '';
            } else {
                if (value === null) {
                    if (sign === '=')
                        value_DB = 'IS NULL';
                    else if (sign === '<>')
                        value_DB = 'IS NOT NULL';
                    else
                        throw new Error(`Unknown '${sign}' and 'null' conjuction.`);

                    sign = '';
                } else {
                    if (js0.type(value, Array))
                        value_DB = ' ' + column.escapeArray(value);
                    else
                        value_DB = ' ' + column.escape(value);
                }
            }

            return `${columnName_DB} ${sign}${value_DB}`;
        }

        throw new Error(`Unknown 'columnValues' type.`);
    }

    _getQuery_Conditions_Helper_GetType(columnValues)
    {
        if (columnValues.length === 2) {
            if (columnValues[0] === 'OR' || columnValues[0] === 'AND') {
                if (columnValues[1] instanceof Array)
                    return 'conjuctionArray';
            }
        }

        let isConjuction = true;
        for (let columnValue of columnValues) {
            if (!(columnValue instanceof Array))
                isConjuction = false;
        }
        if (isConjuction)
            return 'conjuction';

        if (columnValues.length === 3) 
            return 'condition';

        console.error('Condition column values:', columnValues);
        throw new Error('Wrong condition format.');
    }

    async _join_Async(db, rows, joinArgs)
    {
        js0.args(arguments, require('../native/Database'), Array, 
                TableRequestDef.Args_Select().join);

        let rows_Joined = [];
        for (let row of rows)
            rows_Joined.push(row);

        for (let join of joinArgs) {
            let table = join.table;

            for (let on of join.on) {
                if (!this.hasColumn(on[1])) {
                    throw new Error(`Join column '${on[1]}' from base table ` +
                            `'${this.getTableName()}' does not exist.`);
                }

                if (!table.hasColumn(on[0])) {
                    throw new Error(`Join column '${on[0]}' from join table ` +
                            `'${table.getTableName()}' does not exist.`);
                }
            }

            let columnNames = null;
            if (join.columns === null)
                columnNames = table.getColumnNames();
            else {
                columnNames = [];
                for (let columnName of join.columns) {
                    if (!table.hasColumn(columnName)) {
                        throw new Error(`Column '${columnName}' in 'columns'` +
                                ` in join '${join.table}' does not exist.`);
                    }

                    columnNames.push(columnName);
                }
            }

            if (rows.length === 0) 
                continue;

            // let join_Rows = null;

            let on_ColValues = {};
            let groupBy_Arr = [];
            for (let on of join.on) {
                on_ColValues[on[0]] = [];
                groupBy_Arr.push(on[0]);
            }

            for (let row of rows) {
                for (let on of join.on)
                    on_ColValues[on[0]].push(row[on[1]]);
            }

            let where = [ join.where ];
            for (let on of join.on) {
                if (on_ColValues[on[0]].length > 0) {
                    where.push(
                        [ on[0], 'IN', on_ColValues[on[0]] ],
                    );
                }
            }

            let join_Rows = await table.select_Async(db, {
                columns: columnNames,
                where: where,
                limit: null,
                groupBy: groupBy_Arr,
                join: [],
            });

            let rows_Joined_New = [];
            for (let row of rows) {
                let join_Row_Matched = null;
                for (let join_Row of join_Rows) {
                    let joinFound = true;
                    for (let on of join.on) {
                        if (row[on[1]] !== join_Row[on[0]]) {
                            joinFound = false;
                            break;
                        }
                    }

                    if (joinFound) {
                        join_Row_Matched = join_Row;
                        break;
                    }
                }

                if (joinArgs.type === 'inner' && join_Row_Matched === null)
                    continue;
            
                rows_Joined_New.push(row);

                for (let columnName of columnNames) {
                    row[join['prefix'] + columnName] = join_Row_Matched === null ?
                            null : join_Row_Matched[columnName];
                }
            }

            rows_Joined = rows_Joined_New;
        }

        return rows_Joined;
    }

}
module.exports = Table;