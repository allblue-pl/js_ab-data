'use strict';

const
    js0 = require('js0')
;

export default class Wrapper
{

    constructor(dataStore, db)
    {
        js0.args(arguments, require('../DataStore'), require('./Database'));

        this.dataStore = dataStore;
        this.db = db;

        let nad = new abNative.ActionsSetDef()
            .addWeb('Table_Select', {
                tableName: 'string',
                args: js0.RawObject,
            }, {
                rows: [ js0.Null, Array ],
                error: [ js0.Null, 'string' ],
            }, async (args) => {
                if (!this.db.initialized)
                    await this.db.init_Async();
                
                try {
                    let table = this.dataStore.getTable(args.tableName);
                    let rows = await table.select_Async(this.dataStore.db,
                            args.args);

                    return {
                        rows: rows,
                        error: null,
                    };
                } catch (e) {
                    console.error('ABData Wrapper', e);

                    return {
                        rows: null,
                        error: e.message,
                    }
                }
            })
            .addWeb('Table_Update', {
                tableName: 'string',
                args: js0.RawObject,
            }, {
                success: 'boolean',
                error: [ js0.Null, 'string' ],
            }, async (args) => {
                if (!this.db.initialized)
                    await this.db.init_Async();
                
                try {
                    let table = this.dataStore.getTable(args.tableName);
                    let success = await table.select_Async(this.dataStore.db,
                            args.args);

                    return {
                        rows: rows,
                        error: null,
                    };
                } catch (e) {
                    console.error('ABData Wrapper', e);

                    return {
                        rows: null,
                        error: e.message,
                    }
                }
            });
        
        this.nativeActions = abNative.addActionsSet('ABData', nad);
    }

}