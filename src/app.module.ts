import { Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { SearchService } from './search/search.service';
import { SongListController } from './songlist/songlist.controller';
import { ScheduleModule } from '@nestjs/schedule';
import { HttpModule, HttpService } from '@nestjs/axios';

import { config } from 'dotenv';
import { RadioEinsService } from './search/radioEins.service';
config();

const ELASTIC_SEARCH_HOST = process.env.SEARCHBOX_URL;

@Module({
  imports: [
    ElasticsearchModule.register({
      node: ELASTIC_SEARCH_HOST,
    }),
    ScheduleModule.forRoot(),
    HttpModule,    
  ],
  controllers: [AppController, SongListController],
  providers: [AppService, SearchService, RadioEinsService],
})
export class AppModule implements OnModuleInit {
  async onModuleInit() {
    await this.searchService.dropIndex().catch((e) => console.log(e));

    await this.radioEinsService.getBoardFromCategoryUrl('Top100Family')
      .then(( board ) => { this.searchService.indexBoard(board) });
    await this.radioEinsService.getBoardFromCategoryUrl('Top100Numbers')
      .then(( board ) => { this.searchService.indexBoard(board) })
    await this.radioEinsService.getBoardFromCategoryUrl('Top100Animals')
      .then(( board ) => { this.searchService.indexBoard(board) })
    await this.radioEinsService.getBoardFromCategoryUrl('Top100Drugs')
      .then(( board ) => { this.searchService.indexBoard(board) })
    await this.radioEinsService.getBoardFromCategoryUrl('Top100Eighties')
      .then(( board ) => { this.searchService.indexBoard(board) })
    await this.radioEinsService.getBoardFromCategoryUrl('Top100Mobility')
      .then(( board ) => { this.searchService.indexBoard(board) })
    await this.radioEinsService.getBoardFromCategoryUrl('Top100Instrumentals')
      .then(( board ) => { this.searchService.indexBoard(board) })

    await this.radioEinsService.getBoardFromCategoryUrl('Top100Radio')
      .then(( board ) => { this.searchService.indexBoard(board) });
    await this.radioEinsService.getBoardFromCategoryUrl('Top100Sex')
      .then(( board ) => { this.searchService.indexBoard(board) })
    await this.radioEinsService.getBoardFromCategoryUrl('Top100NDW')
      .then(( board ) => { this.searchService.indexBoard(board) })
    await this.radioEinsService.getBoardFromCategoryUrl('Top100Frauen')
      .then(( board ) => { this.searchService.indexBoard(board) })
    await this.radioEinsService.getBoardFromCategoryUrl('Top100Clothes')
      .then(( board ) => { this.searchService.indexBoard(board) })
    await this.radioEinsService.getBoardFromCategoryUrl('Top100Rock')
      .then(( board ) => { this.searchService.indexBoard(board) })
    await this.radioEinsService.getBoardFromCategoryUrl('Top100Ninties')
      .then(( board ) => { this.searchService.indexBoard(board) })
  }

  constructor(
    private readonly searchService: SearchService,
    private readonly radioEinsService: RadioEinsService,
  ) {}
}
