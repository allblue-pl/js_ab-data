// 'use strict';

// const
//     js0 = require('js0')
// ;

// class ABDValidator
// {

//     constructor(args)
//     {
//         js0.args(arguments, js0.RawObject);

//         this._args = args;
//     }

//     __error($message = null)
//     {
//         $this->validator->fieldError($this->name, $message);
//     }

//     getArgs()
//     {
//         return $this->args;
//     }

//     public function getInfo()
//     {
//         return $this->info;
//     }

//     public function success($message = null)
//     {
//         $this->validator->fieldSuccess($this->name, $message);
//     }

//     public function validate(CValidator $validator, $name, $value)
//     {
//         $this->validator = $validator;
//         $this->name = $name;

//         if ($value === null) {
//             if ($this->args['notNull']) {
//                 if ($this->args['required'])
//                     $this->error(EC\HText::_('Forms:fields.notSet'));
//                 else
//                     $this->error(EC\HText::_('Forms:fields.notNull'));
//             }


//         } else
//             $this->_validate($value);

//         $this->name = null;
//         $this->validator = null;
//     }

//     __warning($message = null)
//     {
//         $this->validator->fieldWarning($this->name, $message);
//     }

//     __validate(&$value);

// }
// module.exports = ABDValidator;