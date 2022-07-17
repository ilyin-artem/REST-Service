import { Module, forwardRef } from '@nestjs/common';
import { TracksService } from './tracks.service';
import { TracksController } from './tracks.controller';
import { FavoritesModule } from './../favorites/favorites.module';

@Module({
  providers: [TracksService],
  controllers: [TracksController],
  imports: [forwardRef(() => FavoritesModule)],
  exports: [TracksService],
})
export class TracksModule {}
