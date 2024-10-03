import { UserMessageIgnoreSchemaModel } from "../../../models/ignoreList.model";

export async function getIgnoreList(channel: string) {
  try {
    const ignoreListRaw = await UserMessageIgnoreSchemaModel.find({
      channel
    }).select({
      channel: 1,
      username: 1
    });

    const ignoreList: string[] = ignoreListRaw.map(ignoreList =>
      String(ignoreList.username).toLowerCase()
    );

    return ignoreList;
  } catch (error) {
    return [];
  }
}
