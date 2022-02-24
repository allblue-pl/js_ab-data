'use strict';

const
    js0 = require('js0')
;

class FieldInfo
{

    static GetType_FromField(field)
    {
        js0.args(arguments, require('./fields/ABDField'));

        if (field instanceof require('./fields/ABDBool'))
            return [ 'tinyint(1)' ];
        // else if (field instanceof require('./fields/ABDDouble'))
        //     return `double`;
        else if (field instanceof require('./fields/ABDFloat'))
            return [ `float` ];
        else if (field instanceof require('./fields/ABDId'))
            return [ `bigint`, `bigint(20)` ];
        else if (field instanceof require('./fields/ABDInt'))
            return [ `int`, `int(11)` ];
        else if (field instanceof require('./fields/ABDJSON'))
            return [ `mediumtext` ];
        else if (field instanceof require('./fields/ABDLong'))
            return [ `bigint` ];
        else if (field instanceof require('./fields/ABDString'))
            return [ `varchar(` + field.size + `)` ];
        else if (field instanceof require('./fields/ABDTime'))
            return [ `bigint` ];

        throw new Error(`Unknown FieldInfo type of field '${field.constructor.name}'.`);
    }


    constructor(name, field, types, key, notNull)
    {
        js0.args(arguments, 'string', [ require('./fields/ABDField'), js0.Null ], 
                js0.ArrayItems('string'), 'string', 'boolean');

        this.name = name;
        this.field = field;
        this.types = types;
        this.key = '';
        this.notNull = notNull;
    }

    getQuery_Column()
    {
        return `${this.name} ${this.types[0]} ` + (this.notNull ? 'NOT NULL' : 'NULL');
    }

}
module.exports = FieldInfo;