import { Module } from '@nestjs/common';
import { AlbumsModule } from './albums/albums.module';
import { ArtistsModule } from './artists/artists.module';
import { TracksModule } from './tracks/tracks.module';
import { FavoritesModule } from './favorites/favorites.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ormconfig } from './ormconfig';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { AccessGuard } from './guards/access.guard';

@Module({
  imports: [
    AlbumsModule,
    UsersModule,
    ArtistsModule,
    TracksModule,
    FavoritesModule,
    TypeOrmModule.forRoot(ormconfig),
    AuthModule,
  ],

  providers: [
    {
      provide: APP_GUARD,
      useClass: AccessGuard,
    },
  ],
})
export class AppModule {}
