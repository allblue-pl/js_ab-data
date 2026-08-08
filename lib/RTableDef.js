import f from "./abd-fields/index.js";
import TableDef from "./TableDef.js";
                                                                         
                                                   
                                                                                  
                                                   
                                                                                  
                                                   
                                                           
                                                     
                                               
                                                 
                                                   
                                                   
                                                       
                                                   
                                                   
                                                                                  
                                                                                    
                                                                                
                                                                                  
                                                                                  
                                                                                      

class RTableDef extends TableDef {
    constructor(id        , name        , alias        , columns             ) {   
        if (name[0] !== '_') {
            columns = [
                [ '_Id', f.Id() ],
                [ '_Modified_DateTime', f.Long({ notNull: false, }) ],
                ...columns
            ]
        }

        super(id, name, alias, columns);

        this.setPKs([ '_Id' ]);

        // this.addIndex('_Modified_DateTime', '_Modified_DateTime DESC');
    }
}
export default RTableDef;

                                                         
                                                     
                                                     
                                                     
                                                         
                                                       
                           
                                                   
                                                     
                                                     
                                                         
                                                       
                                                     
