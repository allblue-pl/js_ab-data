'use strict';

const
    js0 = require('js0')
;

class ABDField
{

    get properties() {
        return this._properties;
    }


    constructor(properties)
    {
        js0.args(arguments, js0.Preset({
            notNull: [ 'boolean', js0.Default(false) ],
        }));    

        this._properties = properties;
    }

    getType()
    {
        js0.virtual(this);
    }
        
    escape(value)
    {
        js0.args(arguments, null);

        return this.__escape(value);
    }

    escapeArray(arr)
    {
        js0.args(arguments, Array);

        let arr_Escaped = [];
        for (let val of arr)
            arr_Escaped.push(this.escape(val));

        return '(' + arr_Escaped.join(',') + ')';
    }


    __escape(value)
    {
        js0.virtual(this);
    }

}
module.exports = ABDField;
