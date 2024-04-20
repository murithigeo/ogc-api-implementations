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
    const self_f_types = allowed_f_values.filter(obj => obj.f === current_f_param);
    const alternate_f_types = allowed_f_values.filter(obj => obj.f !== current_f_param);
    return { self_f_types, alternate_f_types };
}
