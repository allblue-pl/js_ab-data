'use strict';

const 
    js0 = require('js0'),

    Database = require('../Database'),
    
    ABDField = require('./ABDField')
;

class ABDString extends ABDField
{

    get size() {
        return this._size;
    }

    constructor(size, properties = {})
    {
        js0.args(arguments, js0.Int, [ js0.RawObject, js0.Default ]);
        super(properties);

        this._size = size;
    }

    getType()
    {
        return 'String';
    }


    __escape(value)
    {
        js0.args(arguments, [ js0.Null, 'string' ]);

        if (value === null)
            return 'NULL';

        return `'` + Database.EscapeString(value) + `'`;
    }

    __unescape(value)
    {
        return value;
    }

}
module.exports = ABDString;
