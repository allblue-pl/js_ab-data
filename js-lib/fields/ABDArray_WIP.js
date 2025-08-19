const 
    js0 = require('js0'),

    ABDField = require('./ABDField')
;


class ABDArray extends ABDField {

    constructor(properties) {
        super([], properties);
    }

    
    __parse(value) {
        js0.args(arguments, Array);

        return value;
    }

}
module.exports = ABDArray;