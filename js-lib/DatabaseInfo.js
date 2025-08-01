'use strict';

const
    // abMysql = require('ab-mysql'),
    js0 = require('js0'),

    FieldInfo = require('./FieldInfo'),
    TableInfo = require('./TableInfo')
;

class DatabaseInfo {
    static Compare(scheme, db_Info) {
        js0.args(arguments, require('./DataScheme'), DatabaseInfo);

        let ignored_TableNames_LC = scheme.getIgnored_TableNames();
        for (let i = 0; i < ignored_TableNames_LC.length; i++)
            ignored_TableNames_LC[i] = ignored_TableNames_LC[i].toLowerCase();

        let actions = {
            tables: {
                delete: [],
                create: [],
                alter: [],
            },
        };

        for (let db_TableInfo of db_Info.tableInfos) {
            if (ignored_TableNames_LC.includes(db_TableInfo.name.toLowerCase())) {
                console.warn(`Ignoring deleting '${tableName}'.`);
                continue;
            }

            if (!scheme.hasTable(db_TableInfo.name)) {
                actions.tables.delete.push(db_TableInfo.name);
                continue;
            }
        }

        for (let tableName of scheme.tableNames) {
            if (ignored_TableNames_LC.includes(tableName.toLowerCase())) {
                console.warn(`Ignoring creating '${tableName}'.`);
                continue;
            }

            let db_TableInfo = db_Info.getTableInfo_ByName(tableName);
            if (db_TableInfo === null) {
                actions.tables.create.push(scheme.getTableDef(tableName));
                continue;
            }

            let scheme_TableDef = scheme.getTableDef(tableName);
            let actions_Table = DatabaseInfo.Compare_Tables(scheme, scheme_TableDef, 
                    db_Info, db_TableInfo);
            if (actions_Table.delete.length > 0 || 
                    actions_Table.create.length > 0 ||
                    actions_Table.change.length > 0) {
                actions.tables.alter.push(actions_Table);
            }

            // if (actions_Table.change.length > 0) {
            //     actions.tables.delete.push(db_TableInfo.name);
            //     actions.tables.create.push(scheme_TableDef);

            //     actions_Table.delete = [];
            //     actions_Table.create = [];
            //     actions_Table.change = [];
            // }
        }

        return actions;
    }

    static CompareIndexes(scheme, db_Info) {
        js0.args(arguments, require('./DataScheme'), DatabaseInfo);

        let ignored_TableNames_LC = scheme.getIgnored_TableNames();
        for (let i = 0; i < ignored_TableNames_LC.length; i++)
            ignored_TableNames_LC[i] = ignored_TableNames_LC[i].toLowerCase();

        let actions = {
            tables: {
                alter: [],
            },
        };

        for (let db_TableInfo of db_Info.tableInfos) {
            if (ignored_TableNames_LC.includes(db_TableInfo.name.toLowerCase())) {
                console.warn(`Ignoring deleting '${tableName}'.`);
                continue;
            }

            if (!scheme.hasTable(db_TableInfo.name))
                continue;

            let scheme_TableDef = scheme.getTableDef(db_TableInfo.name);
            let actions_Table = DatabaseInfo.Compare_TableIndexes(scheme, 
                    scheme_TableDef, db_Info, db_TableInfo);
            if (actions_Table.pks_Delete ||
                    actions_Table.pks_Create ||
                    actions_Table.indexes_Delete.length > 0 ||
                    Object.keys(actions_Table.indexes_Create).length > 0)
                actions.tables.alter.push(actions_Table);
        }

        return actions;
    }

    static Compare_Fields(columnName, scheme, scheme_TableDef, scheme_Field, 
            db_Info, tableInfo__DB, db_FieldInfo) {
        js0.args(arguments, 'string', require('./DataScheme'), 
                require('./TableDef'), require('./fields/ABDField'), DatabaseInfo, 
                require('./TableInfo'), require('./FieldInfo'));
        // console.log('DB', db_FieldInfo);
        // console.log('Info', fieldInfo_Scheme);
        // console.log('###');

        if (!FieldInfo.CompareDBType(scheme_Field, db_Info.dbVersion, 
                db_FieldInfo.dbType)) {
            console.log(db_FieldInfo, scheme_Field);
            console.log(`# Table '${scheme_TableDef.name}'.` +
                  ` DB type '${db_FieldInfo.dbType}' does not match for column '${columnName}'.`);
            return true;
        }

        if (scheme_Field.notNull !== db_FieldInfo.notNull) {
            console.log(`# Table '${scheme_TableDef.name}'.` +
                  `'notNull' value '${db_FieldInfo.notNull}' does not match for` +
                  ` column '${columnName}'.`);
            return true;
        }

        // if (!FieldInfo.CompareDBExtra(scheme_Field, db_Info.dbVersion, 
        //         db_FieldInfo.dbExtra)) {
        //     console.log(`# Table '${scheme_TableDef.name}'.` +
        //           `DB extra '${db_FieldInfo.dbExtra}' does not match for column '${columnName}'.`);
        //     return true;
        // }

        return false;
    }

    static Compare_Tables(scheme, scheme_TableDef, db_Info, db_TableInfo) {
        js0.args(arguments, require('./DataScheme'), require('./TableDef'),
                DatabaseInfo, require('./TableInfo'));

        let actions = {
            tableDef: scheme_TableDef,

            delete: [],
            create: [],
            change: [],
        };

        for (let db_FieldInfo of db_TableInfo.fieldInfos) {
            if (!scheme_TableDef.hasColumn(db_FieldInfo.name)) {
                console.log(`# Table '${scheme_TableDef.name}' field '${db_FieldInfo.name}'` +
                        ` does not exist in scheme.`);
                actions.delete.push(db_FieldInfo.name);
                continue;
            }
        }

        for (let [ columnName, column ] of scheme_TableDef.columns) {
            let db_FieldInfo = db_TableInfo.getFieldInfo_ByName(columnName);
            if (db_FieldInfo === null) {
                console.log(`# Table '${scheme_TableDef.name}' column '${columnName}'` +
                        ` does not exist in database.`);
                actions.create.push({
                    name: columnName,
                    field: column.field,
                });
                continue;
            }

            let scheme_Field = column.field;
            let actions_Fields = DatabaseInfo.Compare_Fields(columnName, scheme, 
                    scheme_TableDef, scheme_Field, db_Info, db_TableInfo, db_FieldInfo);
            if (actions_Fields) {
                actions.change.push({
                    name: columnName,
                    field: column.field,
                });
            }
        }

        return actions;
    }

    static Compare_TableIndexes(scheme, scheme_TableDef, db_Info, db_TableInfo) {
        js0.args(arguments, require('./DataScheme'), require('./TableDef'),
                DatabaseInfo, require('./TableInfo'));

        let actions = {
            tableDef: scheme_TableDef,
            
            pks_Delete: false,
            pks_Create: false,

            indexes_Delete: [],
            indexes_Create: {},
        };

        if (db_TableInfo.pks.length === scheme_TableDef.pks.length) {
            for (let i = 0; i < scheme_TableDef.pks.length; i++) {
                if (db_TableInfo.pks[i] !== scheme_TableDef.pks[i]) {
                    let scheme_PKs = scheme_TableDef.pks.join(', ');
                    let db_PKs = db_TableInfo.pks.join(', ');

                    console.log(`# Table '${scheme_TableDef.name}' pks '${db_PKs}'` +
                        ` do not match scheme pks '${scheme_PKs}'.`);
                    actions.pks_Delete = true;
                    actions.pks_Create = true;
                    break;
                }
            }
        } else {
            console.log(`# Table '${scheme_TableDef.name}' pks count` +
                    ` does not match.`);
            if (db_TableInfo.pks.length > 0)
                actions.pks_Delete = true;
            actions.pks_Create = true;
        }

        let db_IndexInfos = db_TableInfo.indexInfos;
        let scheme_Indexes = scheme_TableDef.indexes;

        /* Delete */
        for (let indexName in db_IndexInfos) {
            let db_IndexInfo = db_IndexInfos[indexName];
            
            if (!Object.keys(scheme_Indexes).includes(indexName)) {
                actions.indexes_Delete.push(indexName);
                delete db_IndexInfos[indexName];
                continue; 
            }

            if (db_IndexInfo.columnInfos.length !== 
                    scheme_Indexes[indexName].length) {
                actions.indexes_Delete.push(indexName);
                delete db_IndexInfos[indexName];
                continue; 
            }

            let deleting = false;
            for (let db_indexColumnInfo of db_IndexInfos[indexName].columnInfos) {
                // if (scheme_Indexes[indexName].length >=
                //         db_indexColumnInfo.position) {
                //     console.log(`# Table '${scheme_TableDef.name}' index '${indexName}'` +
                //             ` does not match columns count in the data scheme.`);
                //     console.log('A', indexName);   
                //     actions.indexes_Delete.push(indexName);
                //     delete db_IndexInfos[indexName];
                //     deleting = true;
                //     break;
                // }

                if (db_indexColumnInfo.name !== 
                        scheme_Indexes[indexName][db_indexColumnInfo.position].name) {
                    console.log(`# Table '${scheme_TableDef.name}' index '${indexName}'` +
                            ` at ${db_indexColumnInfo.position} does not match name ` +
                            ` of '${db_indexColumnInfo.name}'`);
                    actions.indexes_Delete.push(indexName);
                    delete db_IndexInfos[indexName];
                    deleting = true;
                    break;
                }

                if (db_indexColumnInfo.desc !== 
                        scheme_Indexes[indexName][db_indexColumnInfo.position].desc) {
                    console.log(`# Table '${scheme_TableDef.name}' index '${indexName}'` +
                            ` at ${db_indexColumnInfo.position} does not match 'desc'` +
                             ` of '${db_indexColumnInfo.name}'`);
                    actions.indexes_Delete.push(indexName);
                    delete db_IndexInfos[indexName];
                    deleting = true;
                    break;
                }
            }
            if (deleting)
                continue;
        }

        /* Create */
        for (let indexName in scheme_Indexes) {
            if (!Object.keys(db_IndexInfos).includes(indexName)) {
                actions.indexes_Create[indexName] = scheme_Indexes[indexName];
                continue; 
            }
        }

        return actions;
    }

    // static Create_FromConfig(database)
    // {
    //     let databaseInfo = new DatabaseInfo();

    //     for (let table of database.tables) {
    //         let tableInfo = new TableInfo(table.name);
    //         for (let [ fieldName, field ] of table.columns) {
    //             let fieldInfo = new FieldInfo(
    //                 fieldName,
    //                 FieldInfo.GetType_FromField(field),
    //                 '',
    //                 field.properties.notNull,
    //             );
    //             tableInfo.addFieldInfo(fieldInfo);
    //         }
    //         databaseInfo.addTableInfo(tableInfo);
    //     }

    //     return databaseInfo;
    // }

    // static async CreateFrom_DB_Async(db)
    // {
    //     let results = null;

    //     let databaseInfo = new DatabaseInfo();

    //     results = await db.query_SelectAsync('SHOW TABLES;');
    //     for (let row of results) {
    //         let tableName = row[Object.keys(row)[0]];

    //         let tableInfo = new TableInfo(tableName);

    //         results = await db.query_SelectAsync(`DESC \`${tableInfo.name}\`;`);
    //         for (let row of results) {
    //             tableInfo.addFieldInfo(new FieldInfo(
    //                 row.Field,
    //                 row.Type,
    //                 row.Key,
    //                 row.Null,
    //             ));
    //         }

    //         databaseInfo.addTableInfo(tableInfo);
    //     }

        

    //     return databaseInfo;
    // }


    get dbVersion() {
        return this._dbVersion;
    }

    get tableInfos() {
        return this._tableInfos;
    }


    constructor(dbVersion) {
        js0.args(arguments, require('./DatabaseVersion'));

        this._dbVersion = dbVersion;
        this._tableInfos = [];
    }

    addTableInfo(tableInfo) {
        this._tableInfos.push(tableInfo);
    }

    // compare(dbInfo_Scheme, queries)
    // {
    //     for (let tableInfo of this.tableInfos) {
    //         let tableInfo_Scheme = dbInfo_Scheme.getTableInfo_ByName(tableInfo.name);
    //         if (tableInfo_Scheme === null) {
    //             // console.log('Table', tableInfo.name, 'DELETE');
    //             continue;
    //         }
    //     }

    //     for (let tableInfo_Scheme of dbInfo_Scheme.tableInfos) {
    //         let tableInfo = this.getTableInfo_ByName(tableInfo_Scheme.name);
    //         if (tableInfo === null) {
    //             // console.log('Table', tableInfo_Scheme.name, 'CREATE');
    //             queries.create.push(tableInfo_Scheme.getQuery_Create());
    //             continue;
    //         }

    //         this.compare_Tables(tableInfo, tableInfo_Scheme);
    //     }

    // }

    // compare_Fields(fieldInfo, fieldInfo_Scheme)
    // {
    //     // console.log(fieldInfo.name, fieldInfo.type === fieldInfo_Scheme.type,
    //     //         fieldInfo.key === fieldInfo_Scheme.key, 
    //     //         fieldInfo.notNull === fieldInfo_Scheme.notNull);
    // }

    // compare_Tables(tableInfo, tableInfo_Scheme, queries)
    // {
    //     // console.log('Comparing', tableInfo.name);

    //     let actions = false;

    //     for (let fieldInfo of tableInfo.fieldInfos) {
    //         let fieldInfo_Scheme = tableInfo_Scheme.getFieldInfo_ByName(fieldInfo.name);
    //         if (fieldInfo_Scheme === null) {
    //             actions = true;
    //             // console.log('Field', fieldInfo.name, 'DELETE');
    //             continue;
    //         }
    //     }

    //     for (let fieldInfo_Scheme of tableInfo_Scheme.fieldInfos) {
    //         let fieldInfo = tableInfo.getFieldInfo_ByName(fieldInfo_Scheme.name);
    //         if (fieldInfo === null) {
    //             actions = true
    //             // console.log('Field', fieldInfo_Scheme.name, 'CREATE');
    //             continue;
    //         }

    //         this.compare_Fields(fieldInfo, fieldInfo_Scheme);
    //     }

    //     if (actions === true) 
    //         queries.delete.push(tableInfo_Scheme.getQuery_Delete());
    //         queries.create.push(tableInfo_Scheme.getQuery_Create());
    //     }
    // }

    getTableInfo_ByName(tableName) {
        for (let tableInfo of this.tableInfos) {
            if (tableInfo.name.toLowerCase() === tableName.toLowerCase())
                return tableInfo;
        }

        return null;
    }
}
module.exports = DatabaseInfo;