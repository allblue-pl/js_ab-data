'use strict';

const
    js0 = require('js0'),

    RequestDef = require('./RequestDef')
;

class TableRequestDef extends RequestDef
{

    static Args_Select() {
        return {
            columns: [ js0.Iterable('string'), js0.Null, js0.Default(null) ],
            where: [ Array, js0.Default([]) ],
            orderBy: [ js0.Iterable(js0.PresetArray([ 'string', 'boolean' ])), 
                    js0.Default([]) ],
            groupBy: [ js0.Iterable('string'), js0.Null, js0.Default(null) ],
            limit: [ js0.PresetArray([ js0.Int, js0.Int ]), js0.Null, 
                    js0.Default(null) ],
            join: [ js0.Iterable(js0.Preset({
                type: [ js0.Enum([ 'left', 'inner' ]), js0.Default('left') ],
                prefix: 'string',
                table: 'string',
                on: js0.Iterable(js0.PresetArray([ 'string', 'string' ])),
                where: [ Array, js0.Default([]) ],
                columns: [ js0.Iterable('string'), js0.Null, js0.Default(null) ],
                    })), js0.Default([]) ],
        };
    }


    constructor()
    {
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