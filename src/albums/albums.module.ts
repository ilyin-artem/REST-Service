import { Module, forwardRef } from '@nestjs/common';
import { AlbumsService } from './albums.service';
import { AlbumsController } from './albums.controller';
import { TracksModule } from './../tracks/tracks.module';
import { FavoritesModule } from './../favorites/favorites.module';

@Module({
  controllers: [AlbumsController],
  providers: [AlbumsService],
  imports: [forwardRef(() => TracksModule), forwardRef(() => FavoritesModule)],
  exports: [AlbumsService],
})
export class AlbumsModule {}
