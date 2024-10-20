import { IEpisodeHost, IHost, IHostSocials } from "../../models";
import _map from "lodash/map";

interface ITickerWithTitles {
  title: string;
  text: string;
}
interface ISearchSocials {
  seatNum: number;
  name: string;
  socials: IHostSocials[];
  ticker: string[];
  tickerWithTitles: ITickerWithTitles[];
}

export const showTimeHostParser = (databaseHost: IHost[], episodeHost: IEpisodeHost[]) => {
  const searchHost: ISearchSocials[] = [];

  _map(episodeHost, (epHost: IEpisodeHost) => {
    const host = databaseHost.find(
      dbHost => dbHost._id === epHost.hostId || String(dbHost._id) === String(epHost.hostId)
    );

    if (host) {
      searchHost.push({
        seatNum: epHost.seatNum,
        name: host.name,
        socials: host.socials,
        ticker: host.socials.map(social => `${social.site}: ${social.username}`).concat(host.name),
        tickerWithTitles: host.socials
          .map(social => ({
            title: social.site as string,
            text: social.username
          }))
          .concat({ title: "Host", text: host.name })
      });
    }
  });

  return searchHost;
};
