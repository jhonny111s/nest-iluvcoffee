import { Module } from '@nestjs/common';
import { CoffeesController } from './coffees.controller';
import { CoffeesService } from './coffees.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Coffee } from './entity/coffee.entity';
import { Flavor } from './entity/flavor.entity';
import { EventEntity } from '../events/entities/event.entity/event.entity';
import { ConfigModule } from '@nestjs/config';

/* 
    controllers	- Which you can think of as our API Routes, that we want this module to instantiate.
    exports - Here we can list providers within this current module that should be made available anywhere this module is imported
    imports - Just as we saw in the AppModule, the imports Array gives us the ability to list OTHER modules that THIS module requires. Any exported providers of these imported modules are now fully available here as well.
    providers - Here we’re going to list our services that need to be instantiated by the Nest injector.  Any providers here will be available only within “THIS” module itself, unless added to the exports array we saw above.
*/
@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([Coffee, Flavor, EventEntity]),
  ],
  controllers: [CoffeesController],
  providers: [CoffeesService],
})
export class CoffeesModule {}
