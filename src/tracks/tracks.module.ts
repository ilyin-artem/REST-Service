import { Module, forwardRef } from '@nestjs/common';
import { TracksService } from './tracks.service';
import { TracksController } from './tracks.controller';
import { FavoritesModule } from './../favorites/favorites.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrackEntity } from './entities/track.entity';

@Module({
  providers: [TracksService],
  controllers: [TracksController],
  imports: [
    forwardRef(() => FavoritesModule),
    TypeOrmModule.forFeature([TrackEntity]),
  ],
  exports: [TracksService],
})
export class TracksModule {}
