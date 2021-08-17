import { Module } from '@nestjs/common';
import { PlayersModule } from './players/players.module';

@Module({
  controllers: [],
  providers: [],
  imports: [PlayersModule],
})
export class AppModule {}
