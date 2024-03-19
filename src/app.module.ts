import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoffeesModule } from './coffees/coffees.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { configTypeORM, config } from './config/config';

@Module({
  imports: [
    ConfigModule.forRoot(config),
    CoffeesModule,
    TypeOrmModule.forRootAsync({
      useFactory: () => configTypeORM,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
