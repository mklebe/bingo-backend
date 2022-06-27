import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { Board, songlist80s, songlistDrugs } from 'src/lists';

@Injectable()
export class SearchService {
  constructor(private readonly elasticsearchService: ElasticsearchService) { }

  async dropIndex(): Promise<any> {
    return this.elasticsearchService.indices
      .exists({ index: 'top100' })
      .then( async ({ body }) => {
        console.log('##### Fooooooo', body)
        if (body) {
          await this.elasticsearchService.indices
            .delete({
              index: 'top100',
            })
        }

        return this.elasticsearchService.indices.create({
          index: 'top100',
        });
      })
      .catch( (e) => {
        console.log('##### Error on dropping index')
        console.log( e )
      });
  }

  async deleteCategory(category: string): Promise<any> {
    return this.elasticsearchService.deleteByQuery({
      index: 'top100',
      body: {
        query: {
          bool: {
            must: {
              match: { category },
            },
          },
        },
      },
    });
  }

  async indexBoard(board: Board): Promise<any> {
    this.bulkSend(board.lines, board.name);
  }

  async searchSong(
    category: string,
    artist: string,
    song: string,
  ): Promise<any> {
    return this.elasticsearchService.search({
      index: 'top100',
      body: {
        query: {
          bool: {
            must: [
              {
                match: {
                  artist: {
                    query: artist,
                    operator: 'or',
                    analyzer: 'stop',
                    minimum_should_match: '75%',
                  },
                },
              },
              {
                match: {
                  song: {
                    query: song,
                    operator: 'or',
                    analyzer: 'stop',
                    minimum_should_match: '75%',
                  },
                },
              },
              { match: { category } },
            ],
          },
        },
      },
    });
  }

  async searchSongByCategory(category: string): Promise<any> {
    console.log(category);
    return this.elasticsearchService.search({
      index: 'top100',
      size: 100,
      body: {
        query: {
          bool: {
            must: [{ match: { category } }],
          },
        },
      },
    });
  }

  async index80sList() {
    this.bulkSend(songlist80s.lines, 'Top100Eighties');
  }

  async indexDrugList() {
    this.bulkSend(songlistDrugs.lines, 'Top100Drugs');
  }

  private bulkSend(batch: Array<any>, category: string) {
    const bulk = [];
    batch.map((song) => {
      bulk.push({ index: {} });
      bulk.push(Object.assign(song, { category }));
    });
    this.elasticsearchService
      .bulk({
        index: 'top100',
        body: bulk,
      })
      .catch((e) => {
        console.log(e);
      });
  }
}
