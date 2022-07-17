import { Module, forwardRef } from '@nestjs/common';
import { ArtistsController } from './artists.controller';
import { ArtistsService } from './artists.service';
import { TracksModule } from 'src/tracks/tracks.module';
import { AlbumsModule } from 'src/albums/albums.module';

@Module({
  providers: [ArtistsService],
  controllers: [ArtistsController],
  imports: [forwardRef(() => TracksModule), forwardRef(() => AlbumsModule)],
  exports: [ArtistsService],
})
export class ArtistsModule {}
