import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { categoryUrl } from 'src/categories';
import { Board, BoardLineItem } from 'src/lists';
import { parseRadioPlaylist } from 'src/radioPlaylistParser';

@Injectable()
export class RadioEinsService {
  constructor(
    private readonly httpService: HttpService,
    ) { }

    private fixTop100RockList(inputLines: BoardLineItem[]): BoardLineItem[] {
      let lines = [...inputLines];
      lines.splice(21, 0, {
        artist: 'Napalm Death',
        placement: 79,
        song: 'You Suffer'
      })
      lines = lines.map((item, index) => {
        if(index >= 22) {
          const result = {
            ...item,
            placement: item.placement-1,
          }
          return result
        }
        return item;
      })

      return lines
    }

    getBoardFromCategoryUrl(categoryName: string): Promise<Board> {
      const catUrl = categoryUrl[categoryName];
      if (!catUrl) {
        return Promise.resolve({
          name: categoryName,
          lines: [],
        })
      }

      return new Promise((resolve) => {
          this.httpService
            .get(catUrl, {
              responseType: 'arraybuffer',
            })
            .subscribe((response) => {
              const songListDocument = response.data.toString('latin1');
              let lines: BoardLineItem[] = parseRadioPlaylist(songListDocument);
              if(categoryName === 'Top100Rock') {
                lines = this.fixTop100RockList(lines);
              }     
              const board: Board = {
                name: categoryName,
                lines
              }
              resolve(board);
            });
        });
    } 

}
