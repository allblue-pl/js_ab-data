import ts0, { TS0PresetType,                                   } from "@allblue/ts0";
import abText from "ab-text";
import DataScheme from "./DataScheme.js";
import DataStore from "./DataStore.js";
import DatabaseInfo from "./DatabaseInfo.js";
import DatabaseVersion from "./DatabaseVersion.js";
import Device from "./Device.js";
import FieldInfo from "./FieldInfo.js";
import IndexInfo from "./IndexInfo.js";
import RTableDef from "./RTableDef.js";
import RequestDef from "./RequestDef.js";
import RequestProcessor from "./RequestProcessor.js";
import Response from "./Response.js";
import ResponseResult from "./ResponseResult.js";
import SelectColumnType from "./SelectColumnType.js";
import TableDef from "./TableDef.js";
import TableInfo from "./TableInfo.js";
// import TableRequestDef from "./TableRequestDef.ts";
import Validator from "./Validator.js";
import { default as ABDField, default as Field } from "./abd-fields/ABDField.js";
import abdFields from "./abd-fields/index.js";
import lang_PL_ABData from "./languages/pl.ab-data.js";
import abdValidators from "./abd-validators/index.js";

export { DataScheme, DataStore, RequestDef, Response, ResponseResult as ResponseResult };

class abData_Class {
    #debug         ;


    get debug()          {
        return this.#debug;
    }

    get fields()                   {
        return abdFields;
    }

    get validators()                       {
        return abdValidators;
    }

    get version()         {
        return 0;
    }

    get ABDField()                  {
        return ABDField;
    }

    get Device()                {
        return Device;
    }

    get DataScheme()                    {
        return DataScheme;
    }

    get DataStore()                   {
        return DataStore;
    }

    get DatabaseInfo()                      {
        return DatabaseInfo;
    }

    get DatabaseVersion()                         {
        return DatabaseVersion;
    }

    get Field()               {
        return Field;
    }

    get FieldInfo()                   {
        return FieldInfo;
    }

    get IndexInfo()                   {
        return IndexInfo;
    }

    get Response()                  {
        return Response;
    }

    get Result()                        {
        return ResponseResult;
    }

    get RequestDef()                    {
        return RequestDef;
    }

    get RequestProcessor()                          {
        return RequestProcessor;
    }

    get RTableDef()                   {
        return RTableDef;
    }

    get SelectColumnType()                          {
        return SelectColumnType;
    }

    get TableDef()                  {
        return TableDef;
    }

    get TableInfo()                   {
        return TableInfo;
    }

    // get TableRequestDef(): typeof TableRequestDef {
    //     return TableRequestDef;
    // }

    get Validator()                   {
        return Validator;
    }


    constructor() {
        this.#debug = false;

        abText.add('pl.abData', lang_PL_ABData);
    }

    error(errorTitle        , error       )       {
        if (!this.debug)
            return;

        console.error(errorTitle, error);
    }

    setDebug(debug         )       {
        this.#debug = debug;
    }
}
const abData = new abData_Class();
export default abData;