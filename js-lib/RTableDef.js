'use strict';

const
    js0 = require('js0'),
    
    f = require('./fields'),

    TableDef = require('./TableDef')
;

class RTableDef extends TableDef {

    constructor(id, name, alias, columns) {   
        js0.args(arguments, 'int', 'string', 'string', Array);

        if (name[0] !== '_') {
            columns = [
                [ '_Id', f.Id({ notNull: true, }) ],
                [ '_Modified_DateTime', f.Long({ notNull: false, }) ],
                // [ '_Modified_DeviceId', fields.Long({}) ],
            ].concat(columns);
        }

        super(id, name, alias, columns);

        this.setPKs([ '_Id' ]);

        // this.addIndex('_Modified_DateTime', '_Modified_DateTime DESC');
    }

}
module.exports = RTableDef;