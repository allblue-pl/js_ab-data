import ts0, { TS0PresetType, type TS0Preset, type TS0ValueType } from "@allblue/ts0";
import abText from "ab-text";
import DataScheme from "./DataScheme.ts";
import DataStore from "./DataStore.ts";
import DatabaseInfo from "./DatabaseInfo.ts";
import DatabaseVersion from "./DatabaseVersion.ts";
import Device from "./Device.ts";
import FieldInfo from "./FieldInfo.ts";
import IndexInfo from "./IndexInfo.ts";
import RTableDef from "./RTableDef.ts";
import RequestDef from "./RequestDef.ts";
import RequestProcessor from "./RequestProcessor.ts";
import Response from "./Response.ts";
import ResponseResult from "./ResponseResult.ts";
import SelectColumnType from "./SelectColumnType.ts";
import TableDef from "./TableDef.ts";
import TableInfo from "./TableInfo.ts";
// import TableRequestDef from "./TableRequestDef.ts";
import Validator from "./Validator.ts";
import { default as ABDField, default as Field } from "./abd-fields/ABDField.ts";
import abdFields from "./abd-fields/index.ts";
import lang_PL_ABData from "./languages/pl.ab-data.ts";
import abdValidators from "./abd-validators/index.ts";

export { DataScheme, DataStore, RequestDef, Response, ResponseResult as ResponseResult };

class abData_Class {
    #debug: boolean;


    get debug(): boolean {
        return this.#debug;
    }

    get fields(): typeof abdFields {
        return abdFields;
    }

    get validators(): typeof abdValidators {
        return abdValidators;
    }

    get version(): number {
        return 0;
    }

    get ABDField(): typeof ABDField {
        return ABDField;
    }

    get Device(): typeof Device {
        return Device;
    }

    get DataScheme(): typeof DataScheme {
        return DataScheme;
    }

    get DataStore(): typeof DataStore {
        return DataStore;
    }

    get DatabaseInfo(): typeof DatabaseInfo {
        return DatabaseInfo;
    }

    get DatabaseVersion(): typeof DatabaseVersion {
        return DatabaseVersion;
    }

    get Field(): typeof Field {
        return Field;
    }

    get FieldInfo(): typeof FieldInfo {
        return FieldInfo;
    }

    get IndexInfo(): typeof IndexInfo {
        return IndexInfo;
    }

    get Response(): typeof Response {
        return Response;
    }

    get Result(): typeof ResponseResult {
        return ResponseResult;
    }

    get RequestDef(): typeof RequestDef {
        return RequestDef;
    }

    get RequestProcessor(): typeof RequestProcessor {
        return RequestProcessor;
    }

    get RTableDef(): typeof RTableDef {
        return RTableDef;
    }

    get SelectColumnType(): typeof SelectColumnType {
        return SelectColumnType;
    }

    get TableDef(): typeof TableDef {
        return TableDef;
    }

    get TableInfo(): typeof TableInfo {
        return TableInfo;
    }

    // get TableRequestDef(): typeof TableRequestDef {
    //     return TableRequestDef;
    // }

    get Validator(): typeof Validator {
        return Validator;
    }


    constructor() {
        this.#debug = false;

        abText.add('pl.abData', lang_PL_ABData);
    }

    error(errorTitle: string, error: Error): void {
        if (!this.debug)
            return;

        console.error(errorTitle, error);
    }

    setDebug(debug: boolean): void {
        this.#debug = debug;
    }
}
const abData = new abData_Class();
export default abData;