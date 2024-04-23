import { ContentNegotiationObject } from "../params/f";


export default async function changeLinkTypeForNestedLinks(linkOptions: ContentNegotiationObject, contentNegotiationValue: string, intendedType: string) {
    linkOptions.f === contentNegotiationValue ? linkOptions.type = intendedType : linkOptions;
    return linkOptions;
}