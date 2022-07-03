function getSongListUrl(start: string, end: string): string {
    return `https://playlist.funtip.de/playList.do?action=searching&remote=1&version=2&from=${start}&to=${end}&jsonp_callback=jQuery224044240703639644585_1627199132642&_=1627199132643`;
  }
  
export const categoryUrl: Record<string, string> = {};
categoryUrl['Top100Family'] = getSongListUrl(
    '27-06-2021_09-00',
    '27-06-2021_19-00',
);
categoryUrl['Top100Numbers'] = getSongListUrl(
    '04-07-2021_09-00',
    '04-07-2021_19-00',
);
categoryUrl['Top100Animals'] = getSongListUrl(
    '11-07-2021_09-00',
    '11-07-2021_19-00',
);
categoryUrl['Top100Drugs'] = getSongListUrl(
    '18-07-2021_09-00',
    '18-07-2021_19-00',
);
categoryUrl['Top100Eighties'] = getSongListUrl(
    '25-07-2021_09-00',
    '25-07-2021_19-00',
);
categoryUrl['Top100Mobility'] = getSongListUrl(
    '01-08-2021_09-00',
    '01-08-2021_19-00',
);
categoryUrl['Top100Instrumentals'] = getSongListUrl(
    '08-08-2021_09-00',
    '08-08-2021_19-00',
);

categoryUrl['Top100Radio'] = getSongListUrl(
    '10-07-2022_09-00',
    '10-07-2022_19-00',
);
categoryUrl['Top100Sex'] = getSongListUrl(
    '17-07-2022_09-00',
    '17-07-2022_19-00',
);
categoryUrl['Top100NDW'] = getSongListUrl(
    '24-07-2022_09-00',
    '24-07-2022_19-00',
);
categoryUrl['Top100Frauen'] = getSongListUrl(
    '31-07-2022_09-00',
    '10-07-2022_19-00',
);
categoryUrl['Top100Clothes'] = getSongListUrl(
    '07-08-2022_09-00',
    '07-08-2022_19-00',
);
categoryUrl['Top100Rock'] = getSongListUrl(
    '14-08-2022_09-00',
    '14-08-2022_19-00',
);
categoryUrl['Top100Ninties'] = getSongListUrl(
    '21-08-2022_09-00',
    '21-08-2022_19-00',
);
