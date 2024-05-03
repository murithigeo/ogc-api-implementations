import {
  ExegesisPluginContext,
  ExegesisPlugin,
  ExegesisRunner,
} from "exegesis";
import authSeqInstance from "./models";
export async function apiKeyAuthenticator(
  pluginContext: ExegesisPluginContext,
  info: any
) {
  //Instantiate a new url, parse it and get 'apiKey'
  let apiKey = new URL(
    pluginContext.api.serverObject.url + pluginContext.req.url
  ).searchParams.get("apiKey");

  //Set a default apiKey for missing apiKeys
  if (!apiKey) {
    apiKey = "5ec2449c-9952-4c54-b897-5643bc1ba0a0";
  }

  const dbRes: any = await authSeqInstance.models.users.findOne({
    where: { apiKey: apiKey },
    attributes: {
      exclude: ["password", "saltValue","createdAt","updatedAt","deletedAt"],
    },
    raw: true,

    //@ts-expect-error
    includeIgnoreAttributes: false,
  });

  if (!dbRes) {
    return {
      type: "invalid",
      statusCode: 401,
      message: "Invalid apiKey",
    };
  }
  return {
    type: "success",
    user: {
      apiKey,
      username: dbRes.username,
    },
  };
}
