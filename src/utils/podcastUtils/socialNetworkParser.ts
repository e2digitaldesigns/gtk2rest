import { IEpisodeSocials, ISocialNetworks } from "models";
const _map = require("lodash/map");

interface ISearchSocials {
  order: number;
  site: string;
  username: string;
}

export const socialNetworkParser = (
  databaseSocials: ISocialNetworks[],
  episodeSocials: IEpisodeSocials[]
) => {
  const searchSocials: ISearchSocials[] = [];

  _map(episodeSocials, (epSocial: IEpisodeSocials) => {
    const social = databaseSocials.find(
      dbSocial =>
        dbSocial._id === epSocial.socialId || String(dbSocial._id) === String(epSocial.socialId)
    );

    if (social) {
      searchSocials.push({
        order: epSocial.order,
        site: social.site,
        username: social.username
      });
    }
  });

  return searchSocials;
};
