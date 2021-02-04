'use strict';

// const 
// ;


class validators_Class
{

    get ABDEmailValidator() { return require('./ABDEmailValidator'); };
    get ABDIntValidator() { return require('./ABDIntValidator'); };    
    get ABDJSONValidator() { return require('./ABDJSONValidator'); };
    get ABDFloatValidator() { return require('./ABDFloatValidator'); };
    get ABDLongValidator() { return require('./ABDLongValidator'); };
    get ABDStringValidator() { return require('./ABDStringValidator'); };


    Email(args = {})
    {
        return new this.ABDEmailValidator(args);
    }

    Int(args = {})
    {
        return new this.ABDIntValidator(args);
    }

    JSON(args = {})
    {
        return new this.ABDJSONValidator(args);
    }

    Float(args = {})
    {
        return new this.ABDFloatValidator(args);
    }

    Long(args = {})
    {
        return new this.ABDLongValidator(args);
    }

    String(args = {})
    {
        return new this.ABDStringValidator(args);
    }

}
module.exports = new validators_Class();
