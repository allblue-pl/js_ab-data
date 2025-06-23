'use strict';

const
    // abMysql = require('ab-mysql'),
    js0 = require('js0'),

    FieldInfo = require('./FieldInfo'),
    TableInfo = require('./TableInfo')
;

class DatabaseInfo {

    static Compare(scheme, dbInfo_Scheme, dbInfo_DB) {
        js0.args(arguments, require('./scheme/DataScheme'), DatabaseInfo,
                DatabaseInfo);

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

        for (let tableInfo_DB of dbInfo_DB.tableInfos) {
            if (ignored_TableNames_LC.includes(tableInfo_DB.name))
                continue;

            let tableInfo_Scheme = dbInfo_Scheme.getTableInfo_ByName(tableInfo_DB.name);
            if (tableInfo_Scheme === null) {
                actions.tables.delete.push(tableInfo_DB);
                continue;
            }
        }

        for (let tableInfo_Scheme of dbInfo_Scheme.tableInfos) {
            let tableInfo_DB = dbInfo_DB.getTableInfo_ByName(tableInfo_Scheme.name);
            if (tableInfo_DB === null) {
                actions.tables.create.push(tableInfo_Scheme);
                continue;
            }

            if (ignored_TableNames_LC.includes(tableInfo_DB.name))
                continue;

            let actions_Alter = DatabaseInfo.Compare_Tables(tableInfo_DB, 
                    tableInfo_Scheme);
            if (actions_Alter.delete.length > 0 || actions_Alter.create.length > 0 ||
                    actions_Alter.change.length > 0) {
                actions.tables.alter.push(actions_Alter);
            }

            if (actions_Alter.change.length > 0) {
                actions.tables.delete.push(tableInfo_DB);
                actions.tables.create.push(tableInfo_Scheme);

                actions_Alter.delete = [];
                actions_Alter.create = [];
                actions_Alter.change = [];
            }
        }

        return actions;
    }

    static Compare_Fields(fieldInfo_DB, fieldInfo_Conf) {
        // console.log('DB', fieldInfo_DB);
        // console.log('Info', fieldInfo_Conf);
        // console.log('###');

        if (fieldInfo_DB.name !== fieldInfo_Conf.name ||
                !fieldInfo_Conf.types.includes(fieldInfo_DB.types[0]) || 
                fieldInfo_DB.key !== fieldInfo_Conf.key ||
                fieldInfo_DB.notNull !== fieldInfo_Conf.notNull) {
            
            console.log('#');
            console.log('DB', fieldInfo_DB);
            console.log('Conf', fieldInfo_Conf);

            return true;
        }    

        return false;
    }

    static Compare_Tables(tableInfo_DB, tableInfo_Scheme) {
        let actions = {
            tableInfo: tableInfo_Scheme,
            delete: [],
            create: [],
            change: [],
        };

        for (let fieldInfo_DB of tableInfo_DB.fieldInfos) {
            let fieldInfo_Conf = tableInfo_Scheme.getFieldInfo_ByName(fieldInfo_DB.name);
            if (fieldInfo_Conf === null) {
                actions.delete.push(fieldInfo_DB);
                continue;
            }
        }

        for (let fieldInfo_Conf of tableInfo_Scheme.fieldInfos) {
            let fieldInfo_DB = tableInfo_DB.getFieldInfo_ByName(fieldInfo_Conf.name);
            if (fieldInfo_DB === null) {
                actions.create.push(fieldInfo_Conf);
                continue;
            }

            let actions_Fields = DatabaseInfo.Compare_Fields(fieldInfo_DB, 
                    fieldInfo_Conf);
            if (actions_Fields) {
                console.warn('Modyfing columns not implemented. Rebuilding table.');
                actions.change.push(fieldInfo_Conf);
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


    get tableInfos() {
        return this._tableInfos;
    }


    constructor() {
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

    // compare_Fields(fieldInfo, fieldInfo_Conf)
    // {
    //     // console.log(fieldInfo.name, fieldInfo.type === fieldInfo_Conf.type,
    //     //         fieldInfo.key === fieldInfo_Conf.key, 
    //     //         fieldInfo.notNull === fieldInfo_Conf.notNull);
    // }

    // compare_Tables(tableInfo, tableInfo_Scheme, queries)
    // {
    //     // console.log('Comparing', tableInfo.name);

    //     let actions = false;

    //     for (let fieldInfo of tableInfo.fieldInfos) {
    //         let fieldInfo_Conf = tableInfo_Scheme.getFieldInfo_ByName(fieldInfo.name);
    //         if (fieldInfo_Conf === null) {
    //             actions = true;
    //             // console.log('Field', fieldInfo.name, 'DELETE');
    //             continue;
    //         }
    //     }

    //     for (let fieldInfo_Conf of tableInfo_Scheme.fieldInfos) {
    //         let fieldInfo = tableInfo.getFieldInfo_ByName(fieldInfo_Conf.name);
    //         if (fieldInfo === null) {
    //             actions = true
    //             // console.log('Field', fieldInfo_Conf.name, 'CREATE');
    //             continue;
    //         }

    //         this.compare_Fields(fieldInfo, fieldInfo_Conf);
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