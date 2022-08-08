import { Module, forwardRef } from '@nestjs/common';
import { ArtistsController } from './artists.controller';
import { ArtistsService } from './artists.service';
import { TracksModule } from './../tracks/tracks.module';
import { AlbumsModule } from './../albums/albums.module';
import { FavoritesModule } from './../favorites/favorites.module';
import { ArtistEntity } from './entities/artist.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  providers: [ArtistsService],
  controllers: [ArtistsController],
  imports: [
    forwardRef(() => TracksModule),
    forwardRef(() => AlbumsModule),
    forwardRef(() => FavoritesModule),
    TypeOrmModule.forFeature([ArtistEntity]),
  ],
  exports: [ArtistsService],
})
export class ArtistsModule {}
