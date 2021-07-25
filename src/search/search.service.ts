import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { BoardLineItem, songlist80s, songlistDrugs } from 'src/lists';


@Injectable()
export class SearchService {
  constructor(
    private readonly elasticsearchService: ElasticsearchService,
  ) {}

  async dropIndex(): Promise<any> {
    await this.elasticsearchService.indices.delete({
      index: 'top100'
    })
    .catch(() => {
      console.log('### Could not drop indicies... continue... ###')
    })

    return this.elasticsearchService.indices.create({
      index: 'top100'
    })
  }

  async searchSong( category: string, artist: string, song: string ): Promise<any> {
    return this.elasticsearchService.search({ 
      index: 'top100',
      body: {
        query: {
          bool: {
            must: [
              { "match": { artist } },
              { "match": { song } },
              { "match": { category } }
            ]
          }
        }
      }
     })
  }

  async index80sList() {
    this.bulkSend(songlist80s.lines, 'Top100Eighties')
  }

  async indexDrugList() {
    this.bulkSend(songlistDrugs.lines, 'Top100Drugs')
  }

  private bulkSend( batch: Array<any>, category: string ) {
    const bulk = [];
    batch.map(( song ) => {
      bulk.push({index: {}})
      bulk.push(Object.assign(song, { category }));
    })
    this.elasticsearchService.bulk({
      index: 'top100',
      body: bulk,
    }).catch((e) => {
      console.log(e)
    });
  }
}
