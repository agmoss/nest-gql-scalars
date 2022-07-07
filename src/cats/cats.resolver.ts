import { ParseIntPipe, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { Cat, JSON } from '../graphql.schema';
import { CatsGuard } from './cats.guard';
import { CatsService } from './cats.service';
import { CreateCatDto } from './dto/create-cat.dto';

const pubSub = new PubSub();

@Resolver('Cat')
export class CatsResolver {
  constructor(private readonly catsService: CatsService) {}

  @Query('cats')
  @UseGuards(CatsGuard)
  async getCats() {
    return this.catsService.findAll();
  }

  @Query('jsonCats')
  @UseGuards(CatsGuard)
  async jsonCats(): Promise<JSON> {
    return this.catsService.jsonCats();
  }

  @Query('cat')
  async findOneById(
    @Args('id', ParseIntPipe)
    id: number,
  ): Promise<Cat> {
    return this.catsService.findOneById(id);
  }

  @Mutation('createCat')
  async create(@Args('createCatInput') args: CreateCatDto): Promise<Cat> {
    const createdCat = await this.catsService.create(args);
    pubSub.publish('catCreated', { catCreated: createdCat });
    return createdCat;
  }

  @Subscription('catCreated')
  catCreated() {
    return pubSub.asyncIterator('catCreated');
  }
}
