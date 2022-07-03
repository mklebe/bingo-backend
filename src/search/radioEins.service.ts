import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { BoardLineItem } from 'src/lists';
import { parseRadioPlaylist } from 'src/radioPlaylistParser';

@Injectable()
export class RadioEinsService {
  constructor(
    private readonly httpService: HttpService,
    ) { }

    getBoardFromCategoryUrl(catUrl: string): Promise<BoardLineItem[]> {
        return new Promise((resolve) => {
            this.httpService
              .get(catUrl, {
                responseType: 'arraybuffer',
              })
              .subscribe((response) => {
                const songListDocument = response.data.toString('latin1');
                const result: BoardLineItem[] = parseRadioPlaylist(songListDocument)
                resolve(result);
              });
          });
    } 

}
