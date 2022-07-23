import { Module, forwardRef } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { FavoritesController } from './favorites.controller';
import { TracksModule } from 'src/tracks/tracks.module';
import { ArtistsModule } from './../artists/artists.module';
import { AlbumsModule } from './../albums/albums.module';
@Module({
  providers: [FavoritesService],
  controllers: [FavoritesController],
  imports: [
    forwardRef(() => TracksModule),
    forwardRef(() => ArtistsModule),
    forwardRef(() => AlbumsModule),
  ],
  exports: [FavoritesService],
})
export class FavoritesModule {}
