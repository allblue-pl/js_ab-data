import ts0, {                                                          } from "@allblue/ts0";
                                                              

class RequestDef {
    #actionDefs                                              ;


    constructor() {
        this.#actionDefs = {};
    }

    defA(actionName        , actionType         ,
            argsDef                                         ,
            successDef                                              ,
            failureDef                                               = {})             {
        this.defAction(actionName, actionType, argsDef, successDef, failureDef);

        return this;
    }

    defAction(actionName        , actionType         ,
            argsDef                                         ,
            successDef                                              ,
            failureDef                                               = {})             {
        // if (actionType === 'w') {
            // if (!('success' in resultDef))
            //     throw new Error(`No 'success' in action result definition.`);

            // if (resultDef.success !== 'boolean')
            //     throw new Error(`'success' part in action result must be a 'boolean'.`);
        // }

        this.#actionDefs[actionName] = {
            type: actionType,
            argsDef: argsDef,
            successDef: successDef,
            failureDef: failureDef,
        };

        return this;
    }

    extA(actionName        , argsDef                                         ,
            successDef                                              ,
            failureDef                                               = {})             {
        let actionDef = this.getActionDef(actionName);

        for (let argName in argsDef)
            actionDef.argsDef[argName] = argsDef[argName];
        for (let defName in successDef)
            actionDef.successDef[defName] = successDef[defName];
        for (let defName in failureDef)
            actionDef.failureDef[defName] = failureDef[defName];

        return this;
    }

    getADef(actionName        )                       {
        return this.getActionDef(actionName);
    }

    getActionDef(actionName        )                       {
        if (!(actionName in this.#actionDefs))
            throw new Error(`Action '${actionName}' does not exist.`);

        return this.#actionDefs[actionName];
    }

    getActionNames()                {
        return Object.keys(this.#actionDefs);
    }

    hasActionDef(actionName        )          {
        return actionName in this.#actionDefs;
    }

    undefA(actionName        )             {
        this.undefAction(actionName);

        return this;
    }

    undefAction(actionName        )             {
        if (!(actionName in this.#actionDefs))
            throw new Error(`Action '${actionName}' does not exist.`);

        delete this.#actionDefs[actionName];

        return this;
    }

}
export default RequestDef;

                             
                  
                                                     
                                                             
                                                             
  