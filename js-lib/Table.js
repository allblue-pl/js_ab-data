'use strict';

const
    js0 = require('js0'),
    
    fields = require('./fields'),

    Database = require('./Database')
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

        if (name[0] !== '_') {
            columns = [
                [ '_Id', fields.Id({ notNull: true, }) ],
                [ '_Modified_DateTime', fields.Time({ notNull: true, }) ],
                [ '_Modified_DeviceId', fields.Long({}) ],
            ].concat(columns);

            this.setPrimaryKey('_Id');
        }
        this._columns = new js0.List(columns);
    }

    async delete_Async(db, parameters = {})
    {
        js0.args(arguments, null, js0.Preset({
            where: [ Array ],
        }));

        let tableName_DB = Database.Quote(this.name);
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

    getTableName()
    {
        return this._name;
    }

    getQuery_Conditions(columnValues, tableOnly = false)
    {
        js0.args(arguments, Array, [ 'boolean', js0.Default ]);

        return this._getQuery_Conditions_Helper(columnValues, 'AND',
                tableOnly);
    }

    async select_Async(db, parameters = {})
    {
        js0.args(arguments, null, js0.Preset({
            columns: null,
            where: [ Array, js0.Default([]) ],
        }));

        let tableName_DB = Database.Quote(this.name);
        let query = `SELECT * FROM ${tableName_DB}`;

        if (parameters.where !== null) {
            let where_Str = this.getQuery_Conditions(parameters.where);
            if (where_Str !== '')
            query += ' WHERE ' + where_Str;
        }

        console.log(query);
        
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
                row[this.columns.getKeyAt(i)] = result_Row[i];
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

    async update_Async(db, rows)
    {
        js0.args(arguments, null, js0.ArrayItems(js0.RawObject));

        console.log(rows);

        if (rows.length === 0) {
            return {
                success: true,
                error: null,
            };
        };

        let rows_Insert = [];
        let rows_Update = [];

        let ids_ExistCheck = [];
        let rows_Left = [];
        for (let i = 0; i < rows.length; i++) {
            let row = rows[i];

            if (!('_Id' in row))
                throw new Error(`No '_Id' set in row '${i}'.`);

            if (row._Id === null) {
                row._Id = await db.getNextId_Async(this.getTableName());
                rows_Insert.push(row);
            } else {
                rows_Left.push(row);
                ids_ExistCheck.push(row['_Id']);
            }

            row._Modified_DateTime = (new Date()).getTime();
        }

        let rows_Existing = [];
        if (ids_ExistCheck.length > 0) {
            let result = await this.select_Async(db, {
                where: [
                    [ '_Id', 'IN', ids_ExistCheck ],
                ],
            });

            if (result.error !== null)
                throw new Error('Cannot get existing rows.');

            rows_Existing = result.rows;
        }

        let ids_Existing = [];
        for (let row of rows_Existing)
            ids_Existing.push(row['_Id']);

        for (let row of rows_Left) {
            if (ids_Existing.includes(row._Id))
                rows_Update.push(row);
            else
                rows_Insert.push(row);
        }

        let columns = new Map();
        columns.set('_Modified_DateTime', fields.Time({ notNull: true }));

        let row_0 = rows[0];
        if (!('_Id' in row_0))
            throw new Error(`No '_Id' set in rows.`);
        for (let columnName in rows[0])
            columns.set(columnName, this.getColumn(columnName));
        // foreach ($rows[$first_key] as $col_name => $col_val) {
        //     if (!$ignore_not_existing) {
        //         columns[$col_name] = $this->getColumn($col_name, true);
        //     } else {
        //         if ($this->columnExists($col_name, true))
        //             columns[$col_name] = $this->getColumn($col_name, true);
        //     }
        // }

        for (let i = 0; i < rows.length; i++) {
            let row = rows[i];

            if (row._Id === null) {
                row._Id = await db.getNextId_Async(this.getTableName());
                rows_Insert.push(row);
            } else
                rows_Update.push(row);

            row._Modified_DateTime = (new Date()).getTime();
        }

        let tableName_DB = Database.Quote(this.name);

        let query_Insert = null;
        if (rows_Insert.length > 0) {
            /* Column Names */
            let columnNames_DB = [];
            for (let [ columnName, column ] of columns)
                columnNames_DB.push(Database.Quote(columnName));
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
        let id_Column = columns.get('_Id');
        if (rows_Update.length > 0) {
            query_Update = `UPDATE ${tableName_DB} SET`;

            let ids_DB = [];
            let values_Arr = [];
            for (let [ columnName, column ] of columns) {
                let cases_DB_Arr = [];

                /* '_Id' */
                if (columnName === '_Id') {
                    for (let i = 0; i < rows_Update.length; i++) {
                        let row = rows_Update[i];
                        if (!(columnName in row))
                            throw new Error(`Columns inconsistency in row '${i}'.`);
                        ids_DB.push(id_Column.escape(row['_Id']));
                    }
                    continue;
                }

                /* Not '_Id' */
                let columnName_DB = Database.Quote(columnName);
                let query_Update_Values = ` ${columnName_DB}=CASE `;
                for (let i = 0; i < rows_Update.length; i++) {
                    let row = rows_Update[i];
                    if (!(columnName in row))
                        throw new Error(`Columns inconsistency in row '${i}'.`);
                    let id_DB = id_Column.escape(row['_Id']);
                    
                    let value_DB = null;
                    try {
                        value_DB = column.escape(row[columnName]);
                    } catch (e) {
                        throw new Error(`Cannot escape column '${columnName}'.`);
                    }

                    cases_DB_Arr.push(`WHEN _Id=${id_DB} THEN ${value_DB}`);
                }
                query_Update_Values += cases_DB_Arr.join(' ');
                query_Update_Values += ' END';

                values_Arr.push(query_Update_Values);
            }
            query_Update += values_Arr.join(',');
            query_Update += ' WHERE _Id IN (' + ids_DB.join(',') + ')';
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

        let args = [];
        for (let columnCondition of columnValues) {
            if (!js0.type(columnCondition, Array))
                throw new Error('`columnCondition` must be an array.');

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

            let column = this.getColumn(columnName);

            // let columnName_DB = tableOnly ? Database.Quote(columnName) :
            //         this.getColumn(columnName).expression;
            let columnName_DB = Database.Quote(columnName);

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