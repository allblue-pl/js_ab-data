'use strict';

const 
    js0 = require('js0'),
    
    ABDField = require('./ABDField'),

    ABDStringValidator = require('../validators/ABDStringValidator'),

    helper = require('../helper')
;

class ABDString extends ABDField
{

    get size() {
        return this._size;
    }

    constructor(size, properties = {})
    {
        js0.args(arguments, js0.Int, [ js0.RawObject, js0.Default ]);

        super([ size ], properties);

        this._size = size;
    }

    getType()
    {
        return 'String';
    }


    __getFieldValidator(fieldValidatorInfo)
    {
        if (!('maxLength' in fieldValidatorInfo))
            fieldValidatorInfo['maxLength'] = this.size;

        return new ABDStringValidator(fieldValidatorInfo);
    }

    __escape(value)
    {
        js0.args(arguments, [ js0.Null, 'string' ]);

        if (value === null)
            return 'NULL';

        return `'` + helper.escapeString(value) + `'`;
    }

    __unescape(value)
    {
        return value;
    }

}
module.exports = ABDString;
