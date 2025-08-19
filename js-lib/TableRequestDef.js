const
    js0 = require('js0'),

    ABDField = require('./fields/ABDField'),
    RequestDef = require('./RequestDef')
;

class TableRequestDef extends RequestDef {
    static Args_Delete() {
        return {
            where: [ Array, js0.Default([]) ],
        };
    }

    static Args_Select() {
        return {
            assoc: [ 'boolean', js0.Default(true) ],
            selectColumns: [ js0.Iterable(js0.PresetArray(
                    [ 'string', js0.PresetArray([ 'string', ABDField ]) ])), 
                    js0.Null, js0.Default(null) ],
            selectColumnNames: [ js0.ArrayItems('string'), js0.Null, js0.Default(null) ],
            where: [ Array, js0.Default([]) ],
            orderBy: [ js0.Iterable(js0.PresetArray([ 'string', 'boolean' ])), 
                    js0.Default([]) ],
            groupBy: [ js0.Iterable('string'), js0.Null, js0.Default(null) ],
            limit: [ js0.PresetArray([ js0.Int, js0.Int ]), js0.Null, 
                    js0.Default(null) ],
            join: [ js0.Iterable(js0.Preset({
                selectColumns: [ js0.Iterable(js0.PresetArray(
                        [ 'string', js0.PresetArray([ 'string', ABDField ]) ])), 
                        js0.Null, js0.Default(null) ],
                selectColumnNames: [ js0.ArrayItems('string'), js0.Null, js0.Default(null) ],
                type: [ js0.Enum([ 'left', 'inner' ]), js0.Default('left') ],
                prefix: 'string',
                tableDef: require('./TableDef'),
                on: js0.Iterable(js0.PresetArray([ 'string', 'string' ])),
                where: [ Array, js0.Default([]) ],
                orderBy: [ js0.Iterable(js0.PresetArray([ 'string', 'boolean' ])), 
                        js0.Default([]) ],
                groupBy: [ js0.Iterable('string'), js0.Null, js0.Default(null) ],
                    })), js0.Default([]) ],
                query_OrderBy: [ 'string', js0.Null, js0.Default(null) ],
                // query_Where: [ 'string', js0.Null, js0.Default(null) ],
        };
    }


    constructor() {
        super();
        js0.args(arguments);
   
        this
            .defA('delete', 'w', {
                where: js0.ArrayItems(Array),
            }, {
                success: 'boolean',
                error: [ 'string', js0.Null ],
            })
            .defA('row', 'r',
                TableRequestDef.Args_Select(), {
                row: [ Array, js0.Null ],
                
                success: 'boolean',
                error: [ 'string', js0.Null ],
            })
            .defA('select', 'r',
                TableRequestDef.Args_Select(), {
                rows: [ Array, js0.Null ],

                success: 'boolean',
                error: [ 'string', js0.Null ],
            })
            .defA('set', 'w', {
                row: js0.RawObject,
            }, {
                success: 'boolean',
                error: [ 'string', js0.Null ],
            })
            .defA('update', 'w', {
                rows: js0.ArrayItems(js0.RawObject),
                keys: [ '_Id' ],
            }, {
                success: 'boolean',
                error: [ 'string', js0.Null ],
            });
    }
}
module.exports = TableRequestDef;