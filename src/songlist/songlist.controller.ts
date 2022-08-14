import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Board, BoardLineItem } from 'src/lists';
import { SearchService } from 'src/search/search.service';

import { categoryUrl } from 'src/categories';
import { RadioEinsService } from 'src/search/radioEins.service';
import { top100Rock } from 'src/top100Rock';

interface BulkSearchDto {
  song: string;
  artist: string;
}

@Controller('songlist')
export class SongListController {
  constructor(
    private readonly searchService: SearchService,
    private readonly radioEinsService: RadioEinsService,
  ) {}

  @Get(':category/:artist/:song')
  async searchSong(@Param() { artist, song, category }) {
    return this.searchService
      .searchSong(category, artist, song)
      .then((result) => {
        if (result?.body?.hits?.hits) {
          return result.body.hits.hits.map((item) => item._source);
        } else {
          return {};
        }
      });
  }


  @Post(':category/bulksearch')
  async searchBulk(
    @Param() { category },
    @Body() body: BulkSearchDto[]
  ) {
    const result = await Promise.all(
      body.map(async ({ song, artist }) => {
        const result = await this.searchService.searchSong(category, artist, song)
        .then((result) => {
          if (result?.body?.hits?.hits) {
            return result.body.hits.hits.map((item) => item._source)[0];
          } else {
            return {};
          }
        });
        return result
      })
    )
    return result
  }

  @Get(':category/updateindex')
  async updateCategoryIndex(@Param() params) {
    
    this.searchService.deleteCategory(params.category);
    const placements: BoardLineItem[] = await this.fetchCategoryFromRadioEins(
      params.category,
    );
    let board: Board;
    if( params.category === 'Top100Rock' ) {
      board = top100Rock;
    } else {
      board = {
        name: params.category,
        lines: placements,
      };
    }
    return this.searchService.indexBoard(board);
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
    const catName: string = params.category || 'Top100Eighties';
    if( params.category === "Top100Rock" ) {
      return top100Rock.lines.reverse()
    }

    return this.fetchCategoryFromRadioEins(catName);
  }

  private async fetchCategoryFromRadioEins(
    catUrl: string,
  ): Promise<BoardLineItem[]> {
    return (await this.radioEinsService.getBoardFromCategoryUrl(catUrl)).lines;
  }

  @Get()
  async getAll() {
    return Promise.resolve('Hello World');
  }
}
