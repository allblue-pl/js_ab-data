'use strict';

const
    // abMysql = require('ab-mysql'),

    FieldInfo = require('./FieldInfo'),
    TableInfo = require('./TableInfo')
;

class DatabaseInfo
{

    static Compare(dbInfo_Scheme, dbInfo_DB)
    {
        let actions = {
            tables: {
                delete: [],
                create: [],
            },
        };

        for (let tableInfo of dbInfo_DB.tableInfos) {
            let tableInfo_Scheme = dbInfo_Scheme.getTableInfo_ByName(tableInfo.name);
            if (tableInfo_Scheme === null) {
                actions.tables.delete.push(tableInfo.name);
                continue;
            }
        }

        for (let tableInfo_Scheme of dbInfo_Scheme.tableInfos) {
            let tableInfo = dbInfo_DB.getTableInfo_ByName(tableInfo_Scheme.name);
            if (tableInfo === null) {
                console.log('CREATE', tableInfo_Scheme.name);
                actions.tables.create.push(tableInfo_Scheme.name);
                continue;
            }

            let actions_Tables = DatabaseInfo.Compare_Tables(tableInfo, 
                    tableInfo_Scheme);
            if (actions_Tables) {
                actions.tables.delete.push(tableInfo_Scheme.name);
                actions.tables.create.push(tableInfo_Scheme.name);
            }
        }

        return actions;
    }

    static Compare_Fields(fieldInfo_DB, fieldInfo_Conf)
    {
        if (fieldInfo_DB.name !== fieldInfo_Conf.name ||
                fieldInfo_DB.type !== fieldInfo_Conf.type || 
                fieldInfo_DB.key !== fieldInfo_Conf.key ||
                fieldInfo_DB.notNull !== fieldInfo_Conf.notNull) {
            
            return true;
        }    

        return false;
    }

    static Compare_Tables(tableInfo_DB, tableInfo_Scheme)
    {
        let actions = false;

        for (let fieldInfo_DB of tableInfo_DB.fieldInfos) {
            let fieldInfo_Conf = tableInfo_Scheme.getFieldInfo_ByName(fieldInfo_DB.name);
            if (fieldInfo_Conf === null) {
                // console.log('Field', fieldInfo_DB.name, 'DELETE');
                actions = true;
                continue;
            }
        }

        for (let fieldInfo_Conf of tableInfo_Scheme.fieldInfos) {
            let fieldInfo_DB = tableInfo_DB.getFieldInfo_ByName(fieldInfo_Conf.name);
            if (fieldInfo_DB === null) {
                // console.log('Field', fieldInfo_Conf.name, 'CREATE');
                actions = true;
                continue;
            }

            let actions_Fields = DatabaseInfo.Compare_Fields(fieldInfo_DB, 
                    fieldInfo_Conf);
            if (actions_Fields)
                actions = true;
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


    constructor()
    {
        this._tableInfos = [];
    }

    addTableInfo(tableInfo)
    {
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

    getTableInfo_ByName(tableName)
    {
        for (let tableInfo of this.tableInfos) {
            if (tableInfo.name.toLowerCase() === tableName.toLowerCase())
                return tableInfo;
        }

        return null;
    }

}
module.exports = DatabaseInfo;