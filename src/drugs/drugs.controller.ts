import { HttpService } from '@nestjs/axios';
import { Controller, Get, Param } from '@nestjs/common';
import { SearchService } from 'src/search/search.service';

const { JSDOM } = require('jsdom') 

@Controller('songlist')
export class DrugsController {
  constructor(
    private readonly searchService: SearchService,
    private readonly httpService: HttpService
  ) {}

  @Get()
  async getAll() {
    return new Promise((resolve, reject) => {
      this.httpService
        .get('https://playlist.funtip.de/playList.do?action=searching&remote=1&version=2&from=25-07-2021_09-00&to=25-07-2021_19-00&jsonp_callback=jQuery224044240703639644585_1627199132642&_=1627199132643')
        .subscribe(( response ) => {
          let listScript: string = response.data
          const top100Table = new RegExp('<table(.|\n)*?<\/table>')
          let currentPosition = 100;
  
          const { document } = new JSDOM( listScript.match(top100Table)[0] ).window;
          const top100List = [... document.querySelectorAll('tr td:nth-child(2)')]
          let result = top100List.map((tableRow) => {
            const songRow = tableRow.textContent.split('\\n                ')[2].replace('        ', '')
            return {
              placement: currentPosition--,
              artist: songRow.split(' — ')[0],
              song: songRow.split(' — ')[1],
            }
          })
          resolve(result);
        })
    });
  }
}
