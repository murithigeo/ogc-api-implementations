import { ExegesisContext } from "exegesis-express";

export interface ContentNegotiationObject {
    f: string;
    type: string;
}

export async function initializeF(context: ExegesisContext, allowed_f_values: ContentNegotiationObject[]) {
    const current_f_param = !context.params.query.f ? 'json' : context.params.query.f;
    /**
     * @param nonDuplicated_ContentTypes Ensure that the f value is not duplicated
     */
    const selfOptions = allowed_f_values.filter(obj => obj.f === current_f_param);
    if(selfOptions.length>1){
        throw new Error('Only one link object can have the `self` rel prop')
    }
    const alternateOptions = allowed_f_values.filter(obj => obj.f !== current_f_param);
    
    return { selfOptions, alternateOptions };
}
