import { Module, forwardRef } from '@nestjs/common';
import { AlbumsService } from './albums.service';
import { AlbumsController } from './albums.controller';
import { TracksModule } from './../tracks/tracks.module';

@Module({
  controllers: [AlbumsController],
  providers: [AlbumsService],
  imports: [forwardRef(() => TracksModule)],
  exports: [AlbumsService],
})
export class AlbumsModule {}
