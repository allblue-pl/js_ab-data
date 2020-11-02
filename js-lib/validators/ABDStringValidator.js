// 'use strict';

// const
//     js0 = require('js0')
// ;

// export default class ABDStringValidator
// {

//     constructor(args)
//     {
//         js0.args(arguments, js0.Preset({
//             'notNull': [ 'boolean', js0.Default(true) ],
//             'required': [ 'boolean', js0.Default(true) ],
//             'minLength': [ js0.Int, js0.Null, js0.Default(null) ],
//             'maxLength': [ js0.Int, js0.Null, js0.Default(null) ],
//             'regexp': [ 'string', js0.Null, js0.Default(null) ],
//             'trim': [ 'boolean', js0.Default(false) ],
//             'chars': abStrings.GetsCharsRegexp_Basic('\r\n'),
//         }));

//         super(args);
//     }

//     __validate(value)
//     {
//         return;

//         // let args = this.getArgs();

//         // if (args['trim'])
//         //     value = trim(value);

//         // if (value === '') {
//         //     if (args['required'])
//         //         this.error(this.texts.notSet);

//         //     return;
//         // } else {
//         //     if (args['minLength'] !== null) {
//         //         if (mb_strlen(value) < args['minLength']) {
//         //             this.error(this.texts.get(
//         //                     'text_BelowMinLength', [args['minLength']]));
//         //         }
//         //     }

//         //     if (args['maxLength'] !== null) {
//         //         if (args['maxLength'] > 0)
//         //             if (mb_strlen(value) > args['maxLength'])
//         //                 this.error(this.texts.get(
//         //                     'text_AboveMaxLength', [args['maxLength']]));
//         //     }

//         //     if (args['regexp'] !== null) {
//         //         regexp = str_replace('#', '\\#', args['regexp'][0]);
//         //         if (!preg_match("#{regexp}#", value)) {
//         //             this.error(this.texts.get('text_WrongFormat',
//         //                 [args['regexp'][1]]));
//         //         }
//         //     }

//         //     if (args['chars'] !== null) {
//         //         chars = str_replace('#', '\\#', args['chars']);
//         //         // value = ' hello ';
//         //         // echo '#' . chars . '#' . value . '#';
//         //         if (!preg_match("#^[{chars}]*#", value)) {
//         //             preg_match_all("#[^{chars}]#", value, matches,
//         //                     PREG_SET_ORDER);
//         //             not_allowed_chars_arr = [];
//         //             foreach (matches as match) {
//         //                 if (match[0] === ' ')
//         //                     match[0] = '\' \'';

//         //                 if (!in_array(match[0], not_allowed_chars_arr))
//         //                     not_allowed_chars_arr[] = match[0];
//         //             }
//         //             not_allowed_chars = implode(', ', not_allowed_chars_arr);

//         //             not_allowed_chars = str_replace('\\\\', '&#92;', not_allowed_chars);
//         //             not_allowed_chars = str_replace('\\', '', not_allowed_chars);
//         //             not_allowed_chars = str_replace('&#92;', '\\', not_allowed_chars);

//         //             this.error(this.texts.get('text_NotAllowedCharacters',
//         //                 [ not_allowed_chars ]));
//         //         }
//         //     }
//         // }
//     }

// }