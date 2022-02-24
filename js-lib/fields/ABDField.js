'use strict';

const
    js0 = require('js0')
;

class ABDField
{

    get args() {
        return this._args;
    }

    get properties() {
        return this._properties;
    }


    constructor(args, properties)
    {
        js0.args(arguments, Array, js0.RawObject);
        js0.typeE(properties, js0.Preset({
            notNull: [ 'boolean', js0.Default(false) ],
        }));

        this._args = args;
        this._properties = properties;
    }

    getType()
    {
        js0.virtual(this);
    }

    escape(value)
    {
        js0.args(arguments, null);

        if (value === null)
            return 'NULL';

        return js0.rtn('string', this.__escape(value));
    }

    escapeArray(arr)
    {
        js0.args(arguments, Array);

        let arr_Escaped = [];
        for (let val of arr)
            arr_Escaped.push(this.escape(val));

        return '(' + arr_Escaped.join(',') + ')';
    }

    getFieldValidator(fieldValidatorInfo)
    {
        js0.args(arguments, js0.RawObject);

        if (!('notNull' in fieldValidatorInfo))
            fieldValidatorInfo['notNull'] = this.properties['notNull'];

        return js0.rtn(require('../validators/ABDFieldValidator'),
                this.__getFieldValidator(fieldValidatorInfo));
    }

    parse(value)
    {
        if (value === null)
            return null;

        return this.__parse(value);
    }

    unescape(value)
    {
        if (value === null)
            return null;

        return this.__unescape(value);
    }


    __unescape(value)
    { 
        return value;
    }

    __getFieldValidator(fieldValidatorInfo) { js0.virtual(this); }
    __escape(value) { js0.virtual(this); }
    __parse(value) { js0.virtual(this); }

}
module.exports = ABDField;
