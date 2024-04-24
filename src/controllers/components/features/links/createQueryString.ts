import { ExegesisContext } from "exegesis-express";

/**
 *
 * @param context
 * @param queryParamKeysToIgnore Query parameter keys not to add to the querystring
 * @returns returns a querystring that is appended to the url of the requested resource
 */

/*
export default async function filter_generateQueryParamString(context: ExegesisContext, queryParamKeysToIgnore: string[]): Promise<string> {
    let queryParamString: string = '?';
    queryParamKeysToIgnore.push('apiKey'); //Ignore the apiKey

    //Ignore the f parameter. This will be defined by link creation functions
    queryParamKeysToIgnore.push('f');

    for (const [key, value] of Object.entries(context.params.query)) {
        if (value !== undefined && !queryParamKeysToIgnore.includes(key)) {
            queryParamString += `&${key}=${encodeURIComponent(value as string | boolean | number)}`;
        };
    };
    if (await addApiKeyToQueryParamString(context) !== '') {
        queryParamString += await addApiKeyToQueryParamString(context);
    }
    return queryParamString;
};

*/

export default async function filter_generateQueryParamString(
  context: ExegesisContext,
  queryParamKeysToIgnore?: string[]
): Promise<string> {
  let queryParamString: string = "";
  let isFirstParam: boolean = true;
  queryParamKeysToIgnore.push("apiKey"); //Ignore the apiKey

  //Ignore the f parameter. This will be defined by link creation functions
  queryParamKeysToIgnore.push("f");

  for (const [key, value] of Object.entries(context.params.query)) {
    if (value !== undefined && !queryParamKeysToIgnore.includes(key)) {
      if (isFirstParam) {
        queryParamString += `?${key}=${encodeURIComponent(
          value as string | boolean | number
        )}`;
        isFirstParam = false;
      } else {
        queryParamString += `&${key}=${encodeURIComponent(
          value as string | boolean | number
        )}`;
      }
    }
  }
  if ((await addApiKeyToQueryParamString(context)) !== "") {
    queryParamString +=
      (isFirstParam ? "?" : "&") + (await addApiKeyToQueryParamString(context));
  }
  return queryParamString;
}
export async function addApiKeyToQueryParamString(context: ExegesisContext) {
  let apiKeyParamString = "";
  if (context.user && context.user.apiKey !== (undefined || null)) {
    apiKeyParamString += `&apiKey=${context.user.apiKey}`;
  }
  //console.log(apiKeyParamString)
  return apiKeyParamString;
}
