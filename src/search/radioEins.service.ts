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
              const lines: BoardLineItem[] = parseRadioPlaylist(songListDocument);
              const board: Board = {
                name: categoryName,
                lines
              }
              resolve(board);
            });
        });
    } 

}
