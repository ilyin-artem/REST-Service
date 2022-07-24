import { AlbumEntity } from '../../albums/entities/album.entity';
import { ArtistEntity } from '../../artists/entities/artist.entity';
import { TrackEntity } from '../../tracks/entities/track.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('favs')
export class FavoriteEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('simple-array')
  artists: string[];

  @Column('simple-array')
  albums: string[];

  @Column('simple-array')
  tracks: string[];
}

export class FavoriteEntityResult {
  id: string;
  artists: ArtistEntity[];
  albums: AlbumEntity[];
  tracks: TrackEntity[];
}
