import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AlbumsModule } from './albums/albums.module';
import { ArtistsModule } from './artists/artists.module';
import { TracksModule } from './tracks/tracks.module';
import { FavoritesModule } from './favorites/favorites.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ormconfig } from './ormconfig';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    AlbumsModule,
    UsersModule,
    ArtistsModule,
    TracksModule,
    FavoritesModule,
    TypeOrmModule.forRoot(ormconfig),
    ConfigModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
