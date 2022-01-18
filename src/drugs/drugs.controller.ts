import { HttpService } from '@nestjs/axios';
import { Controller, Get, Param } from '@nestjs/common';
import { Board, BoardLineItem } from 'src/lists';
import { SearchService } from 'src/search/search.service';

function getSongListUrl(start: string, end: string) {
  return `https://playlist.funtip.de/playList.do?action=searching&remote=1&version=2&from=${start}&to=${end}&jsonp_callback=jQuery224044240703639644585_1627199132642&_=1627199132643`;
}

// eslint-disable-next-line  @typescript-eslint/no-var-requires
const { JSDOM } = require('jsdom');
const categoryUrl: Record<string, string> = {
  Top100Family: getSongListUrl('27-06-2021_09-00', '27-06-2021_19-00'),
  Top100Numbers: getSongListUrl('04-07-2021_09-00', '04-07-2021_19-00'),
  Top100Animals: getSongListUrl('11-07-2021_09-00', '11-07-2021_19-00'),
  Top100Drugs: getSongListUrl('18-07-2021_09-00', '18-07-2021_19-00'),
  Top100Eighties: getSongListUrl('25-07-2021_09-00', '25-07-2021_19-00'),
  Top100Mobility: getSongListUrl('01-08-2021_09-00', '01-08-2021_19-00'),
  Top100Instrumentals: getSongListUrl('08-08-2021_09-00', '08-08-2021_19-00'),
  Test: getSongListUrl('01-08-2021_06-00', '01-08-2021_08-00'),
};

@Controller('songlist')
export class DrugsController {
  constructor(
    private readonly searchService: SearchService,
    private readonly httpService: HttpService,
  ) {
    const url = categoryUrl['Top100Mobility'];

    if (url) {
      this.searchService.deleteCategory('Top100Mobility');
      this.fetchCategoryFromRadioEins(url).then((placements) => {
        const board: Board = {
          name: 'Top100Mobility',
          lines: placements,
        };
        this.searchService.indexBoard(board);
      });
    }
  }

  @Get(':category/:artist/:song')
  async searchSong(@Param() params) {
    console.log(params.category, params.artist, params.song);
    return this.searchService
      .searchSong(params.category, params.artist, params.song)
      .then((result) => {
        if (result?.body?.hits?.hits) {
          return result.body.hits.hits.map((item) => item._source);
        } else {
          return {};
        }
      });
  }

  @Get(':category/updateindex')
  async updateCategoryIndex(@Param() params) {
    const url = categoryUrl[params.category];

    if (url) {
      this.searchService.deleteCategory(params.category);
      const placements: BoardLineItem[] = await this.fetchCategoryFromRadioEins(
        url,
      );
      const board: Board = {
        name: params.category,
        lines: placements,
      };
      return this.searchService.indexBoard(board);
    } else {
      return [];
    }
  }

  @Get(':category/search')
  async searchByCategory(@Param() params) {
    if (categoryUrl[params.category]) {
      return await this.searchService
        .searchSongByCategory(params.category)
        .then((result) => {
          if (result?.body?.hits?.hits) {
            return result.body.hits.hits.map((item) => item._source);
          } else {
            return {};
          }
        });
    } else {
      return [];
    }
  }

  @Get(':category')
  async getCategoryByName(@Param() params) {
    const catUrl: string =
      categoryUrl[params.category] || categoryUrl['Top100Eighties'];
    return this.fetchCategoryFromRadioEins(catUrl);
  }

  private async fetchCategoryFromRadioEins(
    catUrl: string,
  ): Promise<BoardLineItem[]> {
    return new Promise((resolve) => {
      this.httpService
        .get(catUrl, {
          responseType: 'arraybuffer',
        })
        .subscribe((response) => {
          const listScript: string = response.data.toString('latin1');
          const top100Table = new RegExp('<table(.|\n)*?</table>');
          let currentPosition = 100;

          const { document } = new JSDOM(listScript.match(top100Table)[0])
            .window;
          const top100List = [
            ...document.querySelectorAll('tr td:nth-child(2)'),
          ];
          const result = top100List.map((tableRow) => {
            const songRow = tableRow.textContent
              .split('\\n                ')[2]
              .replace('        ', '');
            return {
              placement: currentPosition--,
              artist: songRow.split(' — ')[0],
              song: songRow.split(' — ')[1],
            };
          });
          resolve(result);
        });
    });
  }

  @Get()
  async getAll() {
    return new Promise((resolve) => {
      this.httpService
        .get(categoryUrl['Test'], {
          responseType: 'arraybuffer',
        })
        .subscribe((response) => {
          const listScript: string = response.data;
          const top100Table = new RegExp('<table(.|\n)*?</table>');
          let currentPosition = 100;

          const { document } = new JSDOM(listScript.match(top100Table)[0])
            .window;
          const top100List = [
            ...document.querySelectorAll('tr td:nth-child(2)'),
          ];
          const result = top100List.map((tableRow) => {
            const songRow = tableRow.textContent
              .split('\\n                ')[2]
              .replace('        ', '');
            return {
              placement: currentPosition--,
              artist: songRow.split(' — ')[0],
              song: songRow.split(' — ')[1],
            };
          });
          resolve(result);
        });
    });
  }
}
