'use strict';

const
    abData = require('.'),

    f = abData.fields,
    s = abData.scheme
;


let tSys_Bulls = new abData.Table('Sys_Bulls', 's_b', [
    [ 'Client__Id', f.Id({ notNull: false, }) ],

    [ 'Name', f.String(64, { notNull: true, }), {
        required: false,
    }],
    [ 'FullName', f.String(64, { notNull: true, }), {
        required: false,
    }],
    [ 'Nr', f.String(20, { notNull: true, }), {
        required: true,
        regexp: [ '^[A-Z0-9]{0,14}$', 'AB123456789012' ],
    }],
    [ 'ManufacturerNr', f.String(9, { notNull: true, }), {
        required: false,
    }],
    [ 'Race', f.String(2, { notNull: true, }), {
        required: false,
    }],

    [ 'Added_Date', f.DateTime({ notNull: true, }) ],
    [ 'Added_User__Id', f.Long({ notNull: true, }) ],
    [ 'Added_Identificator', f.String(64, { notNull: true, }) ],
]);

let v = new abData.Validator();

// tSys_Bulls.validateColumn(v, 'Nr', 'Nr', 'AB123456789012');
tSys_Bulls.validateRow(v, {
    'Nr': 'AB123456789012',
}, {
    'Nr': 'Nr',
});

if (!v.isValid()) {
    for (let fieldName in v.getInfo().fields) {
        if (!v.getInfo().fields.valid)
            console.log(fieldName, v.getInfo().fields[fieldName].errors);
    }
} else
    console.log('Valid!');


// let v = new abData.Validator();

// v.addField('test1', 'My test string');
// v.addFieldValidator('test1', abData.validators.String());

// v.addField('test2', '5');
// v.addFieldValidator('test2', abData.validators.Int({
//     minValue: 1,
//     maxValue: 10,
// }));

// console.log(v.isValid());

// if (!v.isValid()) {
//     console.log(v.getInfo().fields['test1'].errors);
//     console.log(v.getInfo().fields['test2'].errors);
// }

// console.log(v.getInfo());