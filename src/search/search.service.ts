import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { BoardLineItem, songlist80s, songlistDrugs } from 'src/lists';


@Injectable()
export class SearchService {
  constructor(
    private readonly elasticsearchService: ElasticsearchService,
  ) {}

  async dropIndex(): Promise<any> {
    return this.elasticsearchService.indices.delete({
      index: '_all'
    })
      .catch(() => {
        console.log('### Could not drop indicies... continue... ###')
      })
  }

  async createIndex() {
    return this.elasticsearchService.index({
      index: 'top100',
      type: 'document',
      id: '1',
      body: {
        placement: 0,
        song: '',
        artist: 'Dummy Data',
        category: 'none'
      }
    })
  }

  async searchSong( artist: string ): Promise<any> {

    return this.elasticsearchService.search({ 
      index: 'top100',
      q: artist,
     })
  }

  async index80sList() {
    const bulk = [];
    songlist80s.lines.map(( song ) => {
      bulk.push({index: {}})
      bulk.push(Object.assign(song, {category: 'Top100Eighties'}));
    })
    this.elasticsearchService.bulk({
      index: 'top100',
      body: bulk,
    }).catch((e) => {
      console.log(e)
    });
  }

  async indexDrugList() {
    const bulk = [];
    songlistDrugs.lines.map(( song ) => {
      bulk.push({index: {}})
      bulk.push(Object.assign(song, {category: 'Top100Drugs'}));
    })
    this.elasticsearchService.bulk({
      index: 'top100',
      body: bulk,
    }).catch((e) => {
      console.log(e)
    });
  }
}
