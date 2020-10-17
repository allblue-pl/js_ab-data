'use strict';

const 
    js0 = require('js0'),
    
    ABDField = require('./ABDField'),

    helper = require('../helper')
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
        js0.args(arguments, [ js0.Null, js0.RawObject ]);

        if (value === null)
            return 'NULL';

        return `'` + helper.escapeString(JSON.stringify({ value: value })) + `'`;
    }

    __unescape(value)
    {
        if (value === null)
            return null;

        console.log(value);

        return JSON.parse(helper.unescapeString(value)).value;
    }

}
module.exports = ABDJSON;