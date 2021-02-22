'use strict';

const ABDField = require('./ABDField');


class ABDDouble extends ABDField
{

    constructor(properties)
    {
        super([], properties);
    }


    __getValidatorType()
    {
        return 'number';
    }

    __escape(value)
    {
        js0.args(arguments, 'number');

        return 
    }

}
module.exports = ABDDouble;