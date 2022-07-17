import {
  forwardRef,
  Inject,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { TracksService } from 'src/tracks/tracks.service';
import { AlbumsService } from '../albums/albums.service';
import { Album } from '../albums/interfaces/album.interface';
import { ArtistsService } from '../artists/artists.service';
import { Artist } from '../artists/interfaces/artist.interface';
import { Track } from '../tracks/interfaces/track.interface';
import {
  FavoritesIds,
  FavoritesResponse,
} from './interfaces/favorite.interface';

@Injectable()
export class FavoritesService {
  constructor(
    @Inject(forwardRef(() => TracksService))
    private readonly tracksService: TracksService,

    @Inject(forwardRef(() => AlbumsService))
    private readonly albumsService: AlbumsService,

    @Inject(forwardRef(() => ArtistsService))
    private readonly artistsService: ArtistsService,
  ) {}

  private favorites: FavoritesIds = { tracks: [], albums: [], artists: [] };

  async findAll(): Promise<FavoritesResponse> {
    const tracks: Track[] = await Promise.allSettled(
      this.favorites.tracks.map((trackId) =>
        this.tracksService.findOne(trackId),
      ),
    ).then((res) =>
      res.map((item) => (item as unknown as PromiseFulfilledResult<any>).value),
    );
    const albums: Album[] = await Promise.allSettled(
      this.favorites.albums.map((albumId) =>
        this.albumsService.findOne(albumId),
      ),
    ).then((res) =>
      res.map((item) => (item as unknown as PromiseFulfilledResult<any>).value),
    );
    const artists: Artist[] = await Promise.allSettled(
      this.favorites.artists.map((artistId) =>
        this.artistsService.findOne(artistId),
      ),
    ).then((res) =>
      res.map((item) => (item as unknown as PromiseFulfilledResult<any>).value),
    );
    return { artists, albums, tracks };
  }

  async addTrack(id: string): Promise<void> {
    try {
      await this.tracksService.findOne(id);
    } catch {
      throw new UnprocessableEntityException();
    }
    this.favorites.tracks.push(id);
    return;
  }

  async removeTrack(id: string): Promise<void> {
    this.favorites.tracks = this.favorites.tracks.filter(
      (trackId) => trackId !== id,
    );
    return;
  }

  async addAlbum(id: string): Promise<void> {
    try {
      await this.albumsService.findOne(id);
    } catch {
      throw new UnprocessableEntityException();
    }
    this.favorites.albums.push(id);
    return;
  }

  async removeAlbum(id: string): Promise<void> {
    this.favorites.albums = this.favorites.albums.filter(
      (albumId) => albumId !== id,
    );
    return;
  }

  async addArtist(id: string): Promise<void> {
    try {
      await this.artistsService.findOne(id);
    } catch {
      throw new UnprocessableEntityException();
    }
    this.favorites.artists.push(id);
    return;
  }

  async removeArtist(id: string): Promise<void> {
    this.favorites.artists = this.favorites.artists.filter(
      (artistId) => artistId !== id,
    );
    return;
  }
}
