'use strict';

const
    js0 = require('js0'),
    
    fields = require('./fields'),
    helper = require('./helper'),

    Table = require('./Table'),
    TableRequestDef = require('./scheme/TableRequestDef')
;

class RTable extends Table
{

    constructor(id, name, alias, columns)
    {   
        js0.args(arguments, 'int', 'string', 'string', Array);

        if (name[0] !== '_') {
            columns = [
                [ '_Id', fields.Id({ notNull: true, }) ],
                [ '_Modified_DateTime', fields.Long({ notNull: false, }) ],
                // [ '_Modified_DeviceId', fields.Long({}) ],
            ].concat(columns);
        }

        super(id, name, alias, columns);

        this.setPKs([ '_Id' ]);
    }

}
module.exports = RTable;