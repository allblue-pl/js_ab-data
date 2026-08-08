import ts0, {                                                          } from "@allblue/ts0";
                                                              

class RequestDef {
    #actionDefs                                              ;


    constructor() {
        this.#actionDefs = {};
    }

    defA(actionName        , actionType         ,
            argsDef                                         ,
            resultDef                                              )             {
        this.defAction(actionName, actionType, argsDef, resultDef);

        return this;
    }

    defAction(actionName        , actionType         ,
            argsDef                                         ,
            resultDef                                              )             {
        // if (actionType === 'w') {
            // if (!('success' in resultDef))
            //     throw new Error(`No 'success' in action result definition.`);

            // if (resultDef.success !== 'boolean')
            //     throw new Error(`'success' part in action result must be a 'boolean'.`);
        // }

        this.#actionDefs[actionName] = {
            type: actionType,
            argsDef: argsDef,
            resultDef: resultDef,
        };

        return this;
    }

    extA(actionName        , argsDef                                         ,
            resultDef                                              )             {
        let actionDef = this.getActionDef(actionName);

        for (let argName in argsDef)
            actionDef.argsDef[argName] = argsDef[argName];
        for (let resultName in resultDef)
            actionDef.resultDef[resultName] = resultDef[resultName];

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

                             
                  
                                                     
                                                            
  