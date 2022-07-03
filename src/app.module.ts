import { Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { SearchService } from './search/search.service';
import { DrugsController } from './drugs/drugs.controller';
import { ScheduleModule } from '@nestjs/schedule';
import { HttpModule, HttpService } from '@nestjs/axios';

import { config } from 'dotenv';
import { RadioEinsService } from './search/radioEins.service';
import { categoryUrl } from './categories';
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
  controllers: [AppController, DrugsController],
  providers: [AppService, SearchService, RadioEinsService],
})
export class AppModule implements OnModuleInit {
  async onModuleInit() {
    await this.searchService.dropIndex().catch((e) => console.log(e));

    this.searchService.index80sList().catch((e) => console.log(e));
    this.searchService.indexDrugList().catch((e) => console.log(e));
  }

  constructor(
    private readonly searchService: SearchService,
  ) {}
}
