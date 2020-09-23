'use strict';

const 
    js0 = require('js0'),

    Database = require('../Database'),
    
    ABDField = require('./ABDField')
;

class ABDJSON extends ABDField
{

    get size() {
        return this._size;
    }

    constructor(properties = {})
    {
        js0.args(arguments, [ js0.RawObject, js0.Default ]);
        super(properties);
    }

    getType()
    {
        return 'String';
    }


    __escape(value)
    {
        js0.args(arguments, [ j0.Null, js0.RawObject ]);

        if (value === null)
            return 'NULL';

        return `'` + Database.EscapeString(JSON.encode({ value: value })) + `'`;
    }

    __unescape(value)
    {
        if (value === null)
            return null;

        return JSON.descode(value).value;
    }

}
module.exports = ABDJSON;