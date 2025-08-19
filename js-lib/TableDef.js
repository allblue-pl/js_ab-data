const
    js0 = require('js0'),
    
    f = require('./fields')
;

class Table {
    get alias() {
        return this._alias;
    }

    get autoIncrement() {
        return this._autoIncrement !== null;
    }

    get columns() {
        return this._columns;
    }

    get indexes() {
        return this._indexes;
    }

    get name() {
        return this._name;
    }

    get pks() {
        if (this._autoIncrementColumn !== null)
            return [ this._autoIncrementColumn ];

        return this._primaryKeys;
    }

    constructor(id, name, alias, columns) {   
        js0.args(arguments, 'int', 'string', 'string', Array);

        this._id = id;
        this._name = name;
        this._alias = alias;
        this._primaryKeys = null;
        this._autoIncrementColumn = null;
        this._columns = null;
        this._columnValidators = {};
        this._indexes = {};

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

            if (field instanceof f.ABDAutoIncrementId) {
                this._autoIncrementColumn = name;
                this._primaryKeys = null;
            }
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
    }

    getColumnValidators(columnName) {
        js0.args(arguments, 'string');

        let column = this.getColumn(columnName);
        let validators = [ column.fieldValidator ];
        if (!(columnName in this._columnValidators))
            return validators;

        for (let columnValidator of this._columnValidators(columnName))
            validators.push(columnValidator);

        return validators;
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
    
    hasColumn(columnName) {
        js0.args(arguments, 'string');

        return this._columns.has(columnName);
    }

    setIndexes(indexes) {
        js0.args(arguments, js0.ObjectItems(js0.ArrayItems(
                js0.PresetArray([ 'string', 'boolean' ]))));
        
        for (let indexName in indexes) {
            for (let indexColumn of indexes[indexName]) {
                let columnName = indexColumn[0];
                if (!this.hasColumn(columnName))
                        throw new Error(`Index column '${columnName}' does not exist.`);
            }
        }
        
        this._indexes = [];
        for (let indexName in indexes) {
            this._indexes[this.name + '-' + indexName] = [];
            for (let indexColumn of indexes[indexName]) {
                this._indexes[this.name + '-' + indexName].push({
                    name: indexColumn[0], 
                    desc: indexColumn[1],
                });
            }
        }

        return this;
    }

    setPKs(primaryKeys) {
        js0.args(arguments, js0.ArrayItems('string'));

        if (this._autoIncrementColumn !== null)
            throw new Error(`Cannot set PKs for the table with 'ABDAutoIncrement' column.`);

        for (let columnName of primaryKeys) {
            if (!this.hasColumn(columnName))
                throw new Error(`Cannot set PKs. Column '${columnName}' does not exist.`);
            if (!this._columns.get(columnName).field.notNull)
                throw new Error(`Primary Key '${columnName}' must be 'notNull'.`);
        }

        this._autoIncrementColumn = null;
        this._primaryKeys = primaryKeys;

        return this;
    }

    setRowParser(parserFn) {
        js0.args(arguments, 'function');

        this._rowParser = parserFn;
    }

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
}
module.exports = Table;