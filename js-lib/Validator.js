// 'use strict';

// const
//     js0 = require('js0')
// ;

// class Validator
// {

//     constructor()
//     {
//         this._info =  {
//             'valid': true,
//             'fields': [],
//             'state': '',
//             'errors': [],
//         };
//     }

//     add(fieldName, fieldValue, fieldValidators)
//     {
//         js0.args(arguments, 'string', null, 
//                 js0.Iterable(require('./validators/ABDFieldValidators')));

//         this._fields_Add(fieldName, fieldValue);

//         for (let fieldValidator of fieldValidators)
//             this._fields_Add(fieldName, fieldValidator);
//     }

//     addFieldValidator(name, fieldValidator)
//     {
//         js0.args(arguments, 'string', require('./validators/ABDFieldValidators'));

//         throw new Error('Not implemented.');
//     }

//     getInfo()
//     {
//         return this._info;
//     }

//     error(message)
//     {
//         js0.args(arguments, 'string');

//         this._info['valid'] = false;
//         this._info['errors'].push(message);
//     }

//     fieldError(fieldName, message)
//     {
//         js0.args(arguments, 'string');

//         let field = this._fields_Get(fieldName);

//         this._info['valid'] = false;
//         this._info['state'] = 'error';

//         field['errors'].push(message);
//     }

//     isValid()
//     {
//         return this._info['valid'];
//     }


//     _fields_Add(fieldName, fieldValue)
//     {
//         this._info['fields'][fieldName] = {
//             'valid': true,
//             'value': field_value,
//             'state': '',
//             'errors': [],
//             'warnings': [],
//             'successes': [],
//         };

//         return this._info['fields'][fieldName];
//     }

//     _field_Get(fieldName)
//     {
//         if (!isset($this->info['fields'][$field_name]))
//             throw new \Exception("Field `{$field_name}` does not exist.");

//         return $this->info['fields'][$field_name];
//     }

//     _fields_Exists(fieldName)
//     {
//         return fieldName in this._info['fields'];
//     }

// }