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

    get pks() {
        return this._primaryKeys;
    }

    get properties() {
        return this._properties;
    }

    constructor(id, name, alias, columns) {   
        js0.args(arguments, 'int', 'string', 'string', Array);

        this._id = id;
        this._name = name;
        this._alias = alias;
        this._primaryKeys = null;
        this._autoIncrement = null;
        this._columns = null;
        this._rowParser = null;
        this._columnValidators = {};

        this._columns = new js0.List();
        for (let column of columns) {
            let name = column[0];
            let field = column[1];
            let fieldValidatorInfo = column.length > 2 ? column[2] : {};

            this._columns.set(name, {
                field: field,
                fieldValidator: field.getFieldValidator(fieldValidatorInfo),
                index: this._columns.size,
                select: name,
            });
        }
    }

    addColumnValidator(columnName, fieldValidator) {
        js0.args(arguments, 'string', require('./validators/ABDFieldValidator'));

        if (!this.hasColumn(columnName))
            throw new Error(`Column '${columnName}' does not exist.`);

        if (!(columnName in this._columnValidators))
            this._columnValidators[columnName] = [];

        this._columnValidators[columnName].push(fieldValidator);

        return this;
    }

    async delete_Async(db, args = {}, transactionId = null) {
        js0.args(arguments, require('./native/Database'), [ js0.RawObject,
                js0.Default ], [ 'int', js0.Null, js0.Default ]);
        js0.typeE(args, js0.Preset(TableRequestDef.Args_Select()));

        let tableName_DB = helper.quote(this.name);
        let query = `DELETE FROM ${tableName_DB}`;

        if (args.where !== null) {
            let where_Str = this.getQuery_Conditions(args.where);
            if (where_Str !== '')
                query += ' WHERE ' + where_Str;
        }

        await db.query_Execute_Async(query, transactionId);
    }

    getColumn(columnName) {
        if (!this._columns.has(columnName))
            throw new Error(`Column '${columnName}' does not exist.`);

        return this._columns.get(columnName);
    }

    getColumn_Field(columnName) {
        return this.getColumn(columnName).field;
    }

    getColumnIndex(columnName) {
        js0.args(arguments, 'string');

        return this.getColumn(columnName).index;
    }

    getColumnNames() {
        return this._columns.keys();
        // let columnNames = [];
        // for (let column of this._columns)
        //     columnNames.push(column.name);

        // return columnNames;
    }

    getSelectColumnInfo(columnName) {
        js0.args(arguments, 'string');

        let column = this.getColumn(columnName);

        return [ column.select, column.field ];
    }

    getTableId() {
        return this._id;
    }

    getTableName() {
        return this._name;
    }

    getValidatorInfos() {
        let validatorInfo = {};
        for (let [ columnName, column ] of this._columns) {
            validatorInfo[columnName] = {
                field: {
                    type: column.fieldValidator.getType(),
                    args: column.fieldValidator.args,
                },
                validators: [],
            };

            if (columnName in this._columnValidators) {
                for (let columnValidator of this._columnValidators[columnName]) {
                    validatorInfo[columnName].validators.push({
                        type: columnValidator.getType(),
                        args: columnValidator.args,
                    });
                }
            }
        }

        return validatorInfo;
    }

    getQuery_Conditions(columnValues, selectColumns = null) {
        js0.args(arguments, Array, [ js0.Iterable(js0.PresetArray([ 'string', 
                js0.PresetArray([ 'string', fields.ABDField ]) ])), js0.Null, 
                js0.Default ]);

        if (selectColumns === null) {
            selectColumns = new js0.List();
            for (let [ columnName, column ] of this.columns) {
                selectColumns.set(columnName, 
                        [ column.select, column.field ]);
            }
        }

        return this._getQuery_Conditions_Helper(columnValues, 'AND',
                selectColumns);
    }
    
    hasColumn(columnName) {
        return this._columns.has(columnName);
    }

    async row_Async(db, args = {}, transactionId = null) {
        js0.args(arguments, require('./native/Database'), [ js0.RawObject,
                js0.Default ], [ 'int', js0.Null, js0.Default ]);
        js0.typeE(args, js0.Preset(TableRequestDef.Args_Select()));

        args.limit = [ 0, 1 ];

        let rows_DB = await this.select_Async(db, args, transactionId);

        if (rows_DB.length === 0)
            return null;

        return rows_DB[0];
    }

    async select_Async(db, args = {}, transactionId = null) {
        js0.args(arguments, require('./native/Database'), [ js0.RawObject, 
                js0.Default ], [ 'int', js0.Null, js0.Default ]);

        js0.typeE(args, js0.Preset(TableRequestDef.Args_Select()));

        if (args.selectColumns === null) {
            args.selectColumns = new js0.List();
            for (let [ columnName, column ] of this.columns) {
                args.selectColumns.set(columnName, 
                        [ column.select, column.field ]);
            }
        }
        let selectColumns_Select_Arr = [];
        let selectColumns_Types = [];
        for (let [ columnName, selectColumnInfo ] of args.selectColumns) {
            selectColumns_Select_Arr.push(
                    `${selectColumnInfo[0]} AS ${columnName}`);
            selectColumns_Types.push(selectColumnInfo[1].getSelectType());
        }

        let tableName_DB = helper.quote(this.name);
        let query = `SELECT ` + selectColumns_Select_Arr.join(',') + 
                ` FROM ${tableName_DB}`;

        if (args.where !== null) {
            let where_Str = this.getQuery_Conditions(args.where);
            if (where_Str !== '')
                query += ' WHERE ' + where_Str;
        }

        if (args.groupBy !== null)
            query += ` GROUP BY ` + args.groupBy.join(',');

        if (args.orderBy.length > 0) {
            let orderBy_Arr = [];
            for (let orderBy of args.orderBy) {
                let column_Field = this.getColumn_Field(orderBy[0]);
                let columnName = helper.quote(orderBy[0]);
                orderBy_Arr.push(columnName + (orderBy[1] ? ' DESC' : ''));
            }

            query += ' ORDER BY ' + orderBy_Arr.join(', ');
        }

        if (args.limit !== null)
            query += ` LIMIT ${args.limit[0]}, ${args.limit[1]}`;

        let rows_DB = await db.query_Select_Async(query, selectColumns_Types, 
                transactionId);

        let rows = [];
        for (let result_Row of rows_DB) {
            let row = null;
            if (args.assoc) {
                row = {};
                for (let i = 0; i < args.selectColumns.size; i++) {
                    row[args.selectColumns.getKeyAt(i)] = 
                            args.selectColumns.getAt(i)[1].unescape(result_Row[i]);
                }
            } else {
                row = [];
                for (let i = 0; i < args.selectColumns.size; i++) {
                    row.push(args.selectColumns.getAt(i)[1].unescape(
                            result_Row[i]));
                }
            }

            rows.push(row);
        }

        if (args.join.length > 0) {
            rows = await this._join_Async(db, rows, args.join, args.assoc, 
                transactionId);
        }

        return rows;
    }

    async select_ByPKs_Async(db, keySets, args = {}, transactionId = null) {
        js0.args(arguments, require('./native/Database'), 
                js0.ArrayItems(Array), [ js0.RawObject, js0.Default ],
                [ 'int', js0.Null, js0.Default ]);

        js0.typeE(args, js0.Preset(TableRequestDef.Args_Select()));

        args.where = [ 'OR', [] ];
        for (let keys of keySets) {
            if (keys.length !== this.pks.length) {
                throw new Error('Keys do not match primary keys: ' + 
                        keys.join(', ') + ` != ` + this.pks.join(', '));
            }

            let keyPair_Where = [ 'AND', [] ];
            for (let i = 0; i < keys.length; i++)
                keyPair_Where[1].push([ this.pks[i], '=', keys[i] ]);
                
            args.where[1].push(keyPair_Where);
        }

        return await this.select_Async(db, args, transactionId);
    }

    setAutoIncrement(columnName) {
        js0.args(arguments, 'string');

        if (!this.hasColumn(columnName))
            throw new Error(`Auto increment column '${columnName}' does not exist.`);
        if (!(this.getColumn(columnName).field instanceof fields.ABDAutoIncrementId)) {
            throw new Error(`Auto increment column '${columnName}'` +
                    ` must be of type ABDAutoIncrementId.`);
        }

        this._autoIncrement = columnName;
        this._primaryKeys = null;

        return this;
    }

    setPKs(primaryKeys) {
        js0.args(arguments, js0.ArrayItems('string'));

        for (let columnName of primaryKeys) {
            if (!this.hasColumn(columnName))
                throw new Error(`Primary key column '${columnName}' does not exist.`);
        }

        this._autoIncrement = null;
        this._primaryKeys = primaryKeys;

        return this;
    }

    setRowParser(parserFn) {
        js0.args(arguments, 'function');

        this._rowParser = parserFn;
    }

    async update_Async(db, rows, transactionId = null, 
            ignoreNotExistingColumns = false) {
        js0.args(arguments, require('./native/Database'), js0.ArrayItems(
                js0.RawObject), [ 'int', js0.Null, js0.Default ], [ 'boolean', 
                js0.Default ]);

        if (rows.length === 0)
            return;

        let pks = this.pks;
        let pks_Included = true;
        if (this._autoIncrement)
            pks_Included = false;
        else {
            for (let pk of pks) {
                if (!(pk in rows[0]))
                    throw new Error(`Primary Key '${pk}' doesn not exist in row.`);
            }
        }

        let columns = {};
        for (let columnName in rows[0]) {
            if (!ignoreNotExistingColumns) {
                columns[columnName] = this.getColumn(columnName, true);
            } else {
                if (this.hasColumn(columnName, true))
                    columns[columnName] = this.getColumn(columnName, true);
            }
        }

        let localTransaction = false;
        if (transactionId === null) {
            transactionId = await db.transaction_Start_Async();
            localTransaction = true;
        }

        let rows_All = rows;
        for (let i = 0; i < rows_All.length; i += 100) {
            let rows = rows_All.slice(i, Math.min(i + 100, rows_All.length));

            let rows_WithNullPKs = [];
            let rows_WithNullPKs_Indexes = [];
            let rows_WithPKs = [];
            let rows_WithPKs_Indexes = [];

            for (let i = 0; i < rows.length; i++) {
                let row = rows[i];

                if (Object.keys(columns).length !== Object.keys(row).length) {
                    console.error(rows);
                    throw new Error(`Wrong columns number in row ${i}` +
                            ` (inconsistency with first row).`);
                }

                for (let columnName in columns) {
                    if (!(columnName in row)) {
                        throw new Error(`Inconsistent/unknown column` +
                                ` '${columnName}' in row ${i}.`);
                    }
                }

                let isNew = true;
                for (let pk in pks) {
                    if (row[pk] !== null) {
                        isNew = false;
                        break;
                    }
                }

                if (isNew) {
                    rows_WithNullPKs.push(row);
                    rows_WithNullPKs_Indexes.push(i);
                } else {
                    rows_WithPKs.push(row);
                    rows_WithPKs_Indexes.push(i);
                }
            }

            let rows_PKs_ToCheck = [];
            for (let row of rows_WithPKs) {
                let row_PKs = [];
                for (let pk of pks)
                    row_PKs.push(row[pk]);
                rows_PKs_ToCheck.push(row_PKs);
            }

            let rows_Insert = [];
            let rows_Insert_Indexes = [];
            let rows_Update = [];
            let rows_Update_Indexes = [];

            let rows_Existing = pks_Included ? await this.select_ByPKs_Async(db,
                    rows_PKs_ToCheck, {}, transactionId) : [];

            for (let i = 0; i < rows_WithPKs.length; i++) {
                let row_WithPKs = rows_WithPKs[i];
                let match = false;
                for (let row_Existing of rows_Existing) {
                    match = true;
                    for (let pk of pks) {
                        if (columns[pk].field.parse(row_WithPKs[pk]) !== 
                                row_Existing[pk]) {
                            match = false;
                            break;
                        }
                    }

                    if (match)
                        break;
                }

                if (match) {
                    rows_Update.push(row_WithPKs);
                    rows_Update_Indexes.push(rows_WithPKs_Indexes[i]);
                } else {
                    rows_Insert.push(row_WithPKs);
                    rows_Insert_Indexes.push(rows_WithPKs_Indexes[i]);
                }
            }

            for (let i = 0; i < rows_WithNullPKs.length; i++) {
                let row_WithNullPKs = rows_WithNullPKs[i];
                rows_Insert.push(row_WithNullPKs);
                rows_Insert_Indexes.push(rows_WithNullPKs[i]);
            }

            /* DB */
            let tableName_DB = helper.quote(this.name);

            /* Update */
            if (rows_Update.length > 0 && (Object.keys(rows[0]).length > pks.length)) {
                let update_ColumnQueries_Arr = [];
                for (let columnName in columns) {
                    if (pks.includes(columnName))
                        continue;

                    let columnName_DB = helper.quote(columnName);
                    let update_ColumnQuery = `${columnName_DB}=(CASE`;
                    for (let i = 0; i < rows_Update.length; i++) {
                        let row = rows_Update[i];
                        update_ColumnQuery += " WHEN ";
                        let pks_Match_Arr = [];
                        try {
                            for (let pk of pks) {
                                pks_Match_Arr.push(helper.quote(pk) + '=' + 
                                        columns[pk].field.escape(row[pk]));
                            }
                            update_ColumnQuery += '(' + pks_Match_Arr.join(' AND ') + ')';
                            update_ColumnQuery += ' THEN ' +  
                                    columns[columnName].field.escape(row[columnName]);
                        } catch (e) {
                            console.error(e);
                            throw new Error('Error thrown parsing column' +
                                 ` '${columnName}' in row '${rows_Update_Indexes[i]}' -> ` + 
                                 e.toString());
                        }
                    }
                    update_ColumnQuery += ' END)';
                    update_ColumnQueries_Arr.push(update_ColumnQuery);
                }

                let update_Where_Arr = [];
                for (let i = 0; i < rows_Update.length; i++) {
                    let row = rows_Update[i];
                    let pks_Match_Arr = [];
                    for (let pk of pks) {
                        try {
                            pks_Match_Arr.push(helper.quote(pk) + '=' + 
                                    columns[pk].field.escape(row[pk]));
                        } catch (e) {
                            console.error(e);
                            throw new Error('Error thrown parsing column' +
                                ` '${pk}' in row '${rows_Update_Indexes[i]}' -> ` + 
                                e.toString());
                        }
                    }
                    update_Where_Arr.push('(' + pks_Match_Arr.join(' AND ') + ')');
                }

                let update_Query = `UPDATE ${tableName_DB} SET ` +  
                        update_ColumnQueries_Arr.join(',') + ` WHERE ` + 
                        update_Where_Arr.join(' OR ');

                await db.query_Execute_Async(update_Query, transactionId);
            }

            /* Insert */
            if (rows_Insert.length > 0) {
                let valuesArr_DB = [];
                for (let i = 0; i < rows_Insert.length; i++) {
                    let row = rows_Insert[i];
                    let row_DB = [];
                    for (let columnName in columns) {
                        let column = columns[columnName];
                        try {
                            row_DB.push(column.field.escape(row[columnName]));
                        } catch (e) {
                            console.error(e);
                            throw new Error('Error thrown parsing column' +
                                ` '${columnName}' in row '${rows_Insert_Indexes[i]}' -> ` + 
                                e.toString());
                        }
                        
                    }

                    valuesArr_DB.push('(' + row_DB.join(',') + ')');
                }

                /* Column Names */
                let columnNames_DB = [];
                for (let columnName in columns)
                    columnNames_DB.push(helper.quote(columnName));
                let columnNames_DB_Str = columnNames_DB.join(',');

                /* Values */
                let values_DB = valuesArr_DB.join(',');

                let insert_Query = `INSERT INTO ${tableName_DB} (${columnNames_DB_Str})` +
                        ` VALUES ${values_DB}`;

                await db.query_Execute_Async(insert_Query, transactionId);
            }
        }

        /* Commit */
        if (localTransaction)
            await db.transaction_Finish_Async(true, transactionId);
    }

    updateWhere() {
        throw new Error('Not implemented yet.');
    }

    // async updateRequests_Async(db, action, rows)
    // {
    //     js0.args(arguments, null, Array);

    //     let query = `INSERT INTO ${tableName_DB} (${columnNames_DB_Str})` +
    //             ` VALUES ${values_DB_Str}`
    // }

    validateColumn(validator, validatorFieldName, columnName, value) {
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

    validateRow(validator, row, columns = null) {
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
            if (typeof row[columnName] === 'undefined')
                throw new Error(`Column '${columnName}' is 'undefined' in row.`);

            this.validateColumn(validator, columns[columnName], columnName,
                    row[columnName]);
        }
    }

    validateRow_Default(validator, row, ignoreColumns = []) {
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

    validateRow_Default_Columns(validator, row, columnNames = []) {
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


    _getQuery_Conditions_Helper(columnValues, logicOperator, selectColumns) {
        js0.args(arguments, Array, [ 'string', js0.Null ], [ js0.Iterable(
            js0.PresetArray([ 'string', js0.PresetArray([ 'string', 
            fields.ABDField ]) ])), js0.Null, js0.Default(null) ]);

        if (columnValues.length === 0)
            return '';

        let type = this._getQuery_Conditions_Helper_GetType(columnValues);

        if (type === 'conjuctionArray') {
            return this._getQuery_Conditions_Helper(columnValues[1],
                    columnValues[0], selectColumns);
        }

        if (type === 'conjuction') {
            if (logicOperator === null)
                logicOperator = 'AND';
                
            let args = [];
            for (let columnCondition of columnValues) {
                let columnCondition_Str = this._getQuery_Conditions_Helper(
                        columnCondition, null, selectColumns);
                if (columnCondition_Str !== '')
                    args.push('(' + columnCondition_Str + ')');
            }

            return args.join(` ${logicOperator} `)
        }

        if (type === 'condition') {
            let columnName = columnValues[0];
            let sign = columnValues[1];
            let value = columnValues[2];

            if (!selectColumns.has(columnName)) {
                throw new Error(`Column '${columnName}' does not exist in` +
                        ` 'selectColumns' for where condition.`);
            }

            let columnField = selectColumns.get(columnName)[1];

            // let columnName_DB = tableOnly ? Database.Quote(columnName) :
            //         this.getColumn(columnName).expression;
            let columnName_DB = helper.quote(columnName);

            let value_DB = null;
            if (sign === null) {
                value_DB = value;
                sign = '';
            } else {
                if (typeof value === 'undefined') {
                    throw new Error(`Value of '${columnName}' in query` +
                        ` conditions cannot be 'undefined'.`);
                } else if (value === null) {
                    if (sign === '=')
                        value_DB = 'IS NULL';
                    else if (sign === '<>')
                        value_DB = 'IS NOT NULL';
                    else
                        throw new Error(`Unknown '${sign}' and 'null' conjuction.`);

                    sign = '';
                } else {
                    try {
                        if (js0.type(value, Array))
                            value_DB = ' ' + columnField.escapeArray(value);
                        else
                            value_DB = ' ' + columnField.escape(value);
                    } catch (e) {
                        console.error('Cannot parse query condition:', 
                            columnValues);
                        throw Error('Cannot parse query condition -> ' + 
                                e.toString());
                    }
                }
            }

            return `${columnName_DB} ${sign}${value_DB}`;
        }

        throw new Error(`Unknown 'columnValues' type.`);
    }

    _getQuery_Conditions_Helper_GetType(columnValues) {
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

    async _join_Async(db, rows, joinArgs, assoc, transactionId) {
        js0.args(arguments, require('../native/Database'), Array, 
                TableRequestDef.Args_Select().join, 'boolean', 
                [ 'int', js0.Null ]);

        let rows_Joined = [];
        for (let row of rows)
            rows_Joined.push(row);

        for (let joinIndex = 0; joinIndex < joinArgs.length; joinIndex++) {
            let join = joinArgs[joinIndex];
            let table = join.table;

            if (join.selectColumns === null) {
                join.selectColumns = new js0.List();
                for (let columnName of table.getColumnNames()) {
                    join.selectColumns.set(columnName, 
                            table.getSelectColumnInfo(columnName));
                }
            }

            for (let on of join.on) {
                if (!this.hasColumn(on[1])) {
                    /* Check joined tables for column. */
                    let columnExists = false;
                    for (let i = 0; i < joinIndex; i++) {
                        if (on[1].indexOf(joinArgs[i].prefix) !== 0)
                            continue;

                        if (joinArgs[i].table.hasColumn(on[1].substring(
                                    joinArgs[i].prefix.length))) {
                            columnExists = true;
                            break;
                        }                       
                    }

                    if (!columnExists) {
                        throw new Error(`Join column '${on[1]}' from base table ` +
                                `'${this.getTableName()}' does not exist.`);
                    }
                }

                let joinTableHasColumn = false;
                for (let selectColumn of join.selectColumns) {
                    if (selectColumn[0] === on[0]) {
                        joinTableHasColumn = true;
                        break;
                    }
                }

                if (!joinTableHasColumn) {
                    throw new Error(`Join column '${on[0]}' from join table ` +
                            `'${table.getTableName()}' does not exist in 'selectColumns'.`);
                }
            }

            if (rows.length === 0) 
                continue;

            // let join_Rows = null;

            let on_ColValues = {};
            for (let on of join.on)
                on_ColValues[on[0]] = [];

            for (let row of rows) {
                for (let on of join.on) {
                    if (assoc)
                        on_ColValues[on[0]].push(row[on[1]]);
                    else
                        on_ColValues[on[0]].push(row[this.getColumnIndex(on[1])]);
                }
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
                assoc: assoc,
                selectColumns: join.selectColumns, 
                where: where,
                orderBy: join.orderBy,
                limit: null,
                groupBy: join.groupBy,
                join: [],
            }, transactionId);

            let rows_Joined_New = [];
            for (let row of rows_Joined) {
                let join_Row_Matched = null;
                for (let join_Row of join_Rows) {
                    let joinFound = true;
                    for (let on of join.on) {
                        if (assoc) {
                            if (row[on[1]] !== join_Row[on[0]]) {
                                joinFound = false;
                                break;
                            }
                        } else {
                            if (row[this.getColumnIndex(on[1])] !== 
                                    join_Row[table.getColumnIndex(on[0])]) {
                                joinFound = false;
                                break;
                            }
                        }
                    }

                    if (joinFound) {
                        join_Row_Matched = join_Row;
                        break;
                    }
                }

                if (join.type === 'inner' && join_Row_Matched === null)
                    continue;

                rows_Joined_New.push(row);

                for (let columnName of join.selectColumns.getKeys()) {
                    if (assoc) {
                        row[join['prefix'] + columnName] = join_Row_Matched === null ?
                                null : join_Row_Matched[columnName];
                    } else
                        row.push(join_Row_Matched === null ?
                                null : join_Row_Matched[
                                table.getColumnIndex(columnName)]);
                }
            }

            rows_Joined = rows_Joined_New;
        }

        return rows_Joined;
    }

}
module.exports = Table;