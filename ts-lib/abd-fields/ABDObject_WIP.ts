// import ts0, { TS0List } from "@allblue/ts0"
// import ABDField from "./ABDField.ts";
// import ABDLong from "./ABDLong.ts";

// class ABDObject extends ABDField {

//     get fields() {
//         return this._fields;
//     }

//     get name() {
//         return this._name;
//     }

//     get objectStructs() {
//         return this._objectStructs;
//     }

//     constructor(properties = {}) {
//         super([], properties);

//         this._initialized = false;
//         this._name = null;

//         this._fields = new TS0List();
//         this._objectStructs = new TS0List();
//     }

//     addObjectStruct(objectStructName, objectField) {
//         this._objectStructs.set(objectStructName, objectField);
//     }

//     initialize(name) {
//         if (this._initialized)
//             return;
//         this._initialized = true;

//         this._name = name;

//         let fields = this.properties.$;
//         fields.Id = new ABDLong();
        
//         for (let fieldName in fields) {
//             let field = fields[fieldName];

//             if (!(field instanceof ABDField))
//                 throw new Error(`Object fields must be instancec of 'ABDField'.`);

//             this._fields.set(fieldName, field);
//         }
//     }

//     // setName(name)
//     // {
//     //     this._name = name;
//     // }

// }
// export default ABDObject;
