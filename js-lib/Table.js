'use strict';

const
    js0 = require('js0'),
    
    fields = require('./fields'),
    helper = require('./helper')
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

    constructor(name, alias, columns)
    {   
        js0.args(arguments, 'string', 'string', Array);

        this._name = name;
        this._alias = alias;
        this._primaryKey = null;
        this._columns = null;
        this._rowParser = null;

        if (name[0] !== '_') {
            columns = [
                [ '_Id', fields.Id({ notNull: true, }) ],
                [ '_Modified_DateTime', fields.Long({ notNull: true, }) ],
                [ '_Modified_DeviceId', fields.Long({}) ],
            ].concat(columns);

            this.setPrimaryKey('_Id');
        }

        this._columns = new js0.List();
        for (let column of columns) {
            let name = column[0];
            let field = column[1];
            let validatorInfo = field.getValidatorInfo(
                column.length > 2 ? column[2] : {});

            this._columns.set(name, {
                field: field,
                validatorInfos: [ validatorInfo ],
            });
        }
    }

    async delete_Async(db, parameters = {})
    {
        js0.args(arguments, null, js0.Preset({
            where: [ Array ],
        }));

        let tableName_DB = helper.quote(this.name);
        let query = `DELETE FROM ${tableName_DB}`;

        if (parameters.where !== null) {
            let where_Str = this.getQuery_Conditions(parameters.where);
            if (where_Str !== '')
            query += ' WHERE ' + where_Str;
        }

        console.log(query);

        let result = await db.query_Execute_Async(query);

        return {
            success: result.success,
            error: result.error,
        };
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

    async row_Async(db, parameters = {})
    {
        js0.args(arguments, require('./native/Database'), js0.Preset({
            columns: null,
            where: [ Array, js0.Default([]) ],
        }));

        parameters.limit = [ 0, 1 ];

        let result = await this.select_Async(db, parameters);

        if (result.rows === null)
            return result;

        if (result.rows.length === 0) {
            return {
                row: null,
                error: null,
            };
        }

        return {
            row: result.rows[0],
            error: null,
        };
    }

    async select_Async(db, parameters = {})
    {
        js0.args(arguments, require('./native/Database'), js0.Preset({
            columns: null,
            limit: [ js0.Null, js0.PresetArray([ 'int', 'int' ]), js0.Default(null) ],
            where: [ Array, js0.Default([]) ],
        }));

        let tableName_DB = helper.quote(this.name);
        let query = `SELECT * FROM ${tableName_DB}`;

        if (parameters.where !== null) {
            let where_Str = this.getQuery_Conditions(parameters.where);
            if (where_Str !== '')
            query += ' WHERE ' + where_Str;
        }

        if (parameters.limit !== null)
            query += ` LIMIT ${parameters.limit[0]}, ${parameters.limit[1]}`;
        
        let columnTypes = [];
        for (let [ columnName, column ] of this.columns)
            columnTypes.push(column.getType());

        let result = await db.query_Select_Async(query, columnTypes);

        if (result.error !== null) {
            return {
                rows: null,
                error: result.error,
            };
        }

        let rows = [];
        for (let result_Row of result.rows) {
            let row = {};
            for (let i = 0; i < this.columns.size; i++)
                row[this.columns.getKeyAt(i)] = this.columns.getAt(i).unescape(result_Row[i]);
            rows.push(row);
        }

        return {
            rows: rows,
            error: null,
        };
    }

    setPrimaryKey(primaryKey)
    {
        this._primaryKey = primaryKey;

        return this;
    }

    setRowParse(parserFn)
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

            if (row._Id === null) {
                row._Id = await db.getNextId_Async(this.getTableName());
                rows_Insert.push(row);
            } else {
                rows_Left.push(row);
                ids_ExistCheck.push(row[pk]);
            }

            if (this._columns.has('_Modified_DateTime'))
                row._Modified_DateTime = (new Date()).getTime();
        }

        let rows_Existing = [];
        if (ids_ExistCheck.length > 0) {
            let result = await this.select_Async(db, {
                where: [
                    [ pk, 'IN', ids_ExistCheck ],
                ],
            });

            if (result.error !== null)
                throw new Error('Cannot get existing rows.');

            rows_Existing = result.rows;
        }

        console.log('Existing', rows_Existing);

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
        if (this._columns.has('_Modified_DateTime'))
            columns.set('_Modified_DateTime', fields.Time({ notNull: true }));

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

        await db.transaction_Start_Async();

        console.log('Insert', query_Insert);
        console.log('Update', query_Update);
        
        if (query_Insert !== null) {
            let result_Insert = await db.query_Execute_Async(query_Insert);
            if (!result_Insert.success) {
                return {
                    success: false,
                    error: 'Insert: ' + result_Insert.error,
                };
            }
        }

        if (query_Update !== null) {
            let result_Update = await db.query_Execute_Async(query_Update);
            if (!result_Update.success) {
                return {
                    success: false,
                    error: 'Update: ' + result_Update.error,
                };
            }
        }

        let result_Transaction = await db.transaction_Finish_Async(true);
        if (!result_Transaction.success) {
            return {
                success: false,
                error: 'Transaction: ' + result_Transaction.error,
            };
        }

        return {
            success: true,
            error: null,
        };
    }


    async updateRequests_Async(db, action, rows)
    {
        js0.args(arguments, null, Array);

        let query = `INSERT INTO ${tableName_DB} (${columnNames_DB_Str})` +
                ` VALUES ${values_DB_Str}`
    }

    _getQuery_Conditions_Helper(columnValues, logicOperator, tableOnly = false)
    {
        js0.args(arguments, Array, 'string', [ 'boolean', js0.Default ]);

        if (columnValues.length === 2) {
            if (columnValues[0] !== 'OR' && columnValues[0] !== 'AND') 
                throw new Error(`Unknown 'columnCondition' logic operator '${columnValues[0]}'.`);
            
            console.log('Here');

            return this._getQuery_Conditions_Helper(columnValues[1],
                    columnValues[0], tableOnly);
        }

        let args = [];
        for (let columnCondition of columnValues) {
            if (!js0.type(columnCondition, Array)) {
                console.error('`columnValues`', columnValues);
                throw new Error('`columnCondition` must be an array.');
            }

            if (columnCondition.length === 2) {
                if (columnCondition[0] !== 'OR' && columnCondition[0] !== 'AND') 
                    throw new Error(`Unknown 'columnCondition' logic operator '${columnCondition[0]}'.`);
                args.push('(' + this._getQuery_Conditions_Helper(columnCondition[1],
                        columnCondition[0], tableOnly) + ')');
                continue;
            } else if (columnCondition.length !== 3) {
                console.error('Column condition:', columnCondition);
                throw new Error(`Wrong 'columnCondition' format.`);
            }

            let columnName = columnCondition[0];
            let sign = columnCondition[1];
            let value = columnCondition[2];

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

            args.push(`${columnName_DB} ${sign}${value_DB}`);
        }

        return args.join(` ${logicOperator} `);
    }

}
module.exports = Table;