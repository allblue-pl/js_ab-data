'use strict';

const js0 = require('js0');

const ABDArray = require('./fields/ABDArray');
const ABDField = require('./fields/ABDField');
const ABDObject = require('./fields/ABDObject');


class Data
{

    get objectStructs() {
        return this._objectStructs;
    }


    constructor(objectDefinitions)
    {
        this._objectDefinitions = objectDefinitions;
        this._objectStructs = new js0.List();
    }

    initialize()
    {
        for (let objectStructName in this._objectDefinitions) {
            let objectStructField = this._objectDefinitions[objectStructName];
            objectStructField.initialize(objectStructName);

            this._objectStructs.set(objectStructName, objectStructField);
        }

        let objectFields = new Map(this._objectStructs);
        for (let [ objectFieldName, objectField ] of objectFields) {
            for (let [ fieldName, field ] of objectField.fields) {
                if (field instanceof ABDArray)
                    field = field.properties.$;

                if (!(field instanceof ABDObject))
                    continue;

                if (this._objectStructs.includes(field))
                    continue;

                field.initialize('$' + fieldName);
                objectField.addObjectStruct('$' + fieldName, field);
                objectFields.set('$' + fieldName, field);
            }
        }
    }

}

module.exports = Data;
