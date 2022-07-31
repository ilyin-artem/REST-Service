import {
  forwardRef,
  Inject,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { TracksService } from './../tracks/tracks.service';
import { AlbumsService } from './../albums/albums.service';
import { ArtistsService } from './../artists/artists.service';
import {
  FavoriteEntity,
  FavoriteEntityResult,
} from './entities/favorite.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class FavoritesService {
  constructor(
    @Inject(forwardRef(() => TracksService))
    private readonly tracksService: TracksService,

    @Inject(forwardRef(() => AlbumsService))
    private readonly albumsService: AlbumsService,

    @Inject(forwardRef(() => ArtistsService))
    private readonly artistsService: ArtistsService,

    @InjectRepository(FavoriteEntity)
    private favoriteRepository: Repository<FavoriteEntity>,
  ) {}

  async getFavsId(): Promise<string> {
    const favsAll = await this.favoriteRepository.find();
    if (favsAll.length) {
      return favsAll[0].id;
    }
    const favs = await this.favoriteRepository.save(
      this.favoriteRepository.create({
        artists: [],
        albums: [],
        tracks: [],
      }),
    );

    return favs.id;
  }

  async findAll(): Promise<FavoriteEntityResult> {
    const favsId = await this.getFavsId();
    const favs = await this.favoriteRepository.findOne({
      where: { id: favsId },
    });

    const tracks = [];
    for (const trackId of favs.tracks) {
      try {
        const trackData = await this.tracksService.findOne(trackId);
        tracks.push(trackData);
      } catch {}
    }

    const albums = [];
    for (const albumId of favs.albums) {
      try {
        const albumData = await this.albumsService.findOne(albumId);
        albums.push(albumData);
      } catch {}
    }

    const artists = [];
    for (const artistId of favs.artists) {
      try {
        const artistData = await this.artistsService.findOne(artistId);
        artists.push(artistData);
      } catch {}
    }

    return { ...favs, artists, albums, tracks };
  }

  async addTrack(id: string): Promise<void> {
    try {
      const track = await this.tracksService.findOne(id);
      const favsId = await this.getFavsId();
      const favs = await this.favoriteRepository.findOne({
        where: { id: favsId },
      });

      await this.favoriteRepository.save(
        this.favoriteRepository.create({
          ...favs,
          tracks: [...new Set([...favs.tracks, track.id])],
        }),
      );
      return;
    } catch {
      throw new UnprocessableEntityException();
    }
  }

  async removeTrack(id: string): Promise<void> {
    const favsId = await this.getFavsId();

    const favs = await this.favoriteRepository.findOne({
      where: { id: favsId },
    });

    const updatedTrackId = favs.tracks.filter((idTrack) => idTrack !== id);

    await this.favoriteRepository.save(
      this.favoriteRepository.create({
        ...favs,
        tracks: updatedTrackId,
      }),
    );
    return;
  }

  async addArtist(id: string): Promise<void> {
    try {
      const favsId = await this.getFavsId();
      const artist = await this.artistsService.findOne(id);
      const favs = await this.favoriteRepository.findOne({
        where: { id: favsId },
      });
      await this.favoriteRepository.save(
        this.favoriteRepository.create({
          ...favs,
          artists: [...new Set([...favs.artists, artist.id])],
        }),
      );
      return;
    } catch {
      throw new UnprocessableEntityException();
    }
  }

  async removeArtist(id: string): Promise<void> {
    const favsId = await this.getFavsId();
    const favs = await this.favoriteRepository.findOne({
      where: { id: favsId },
    });

    const updatedArtistId = favs.artists.filter((idArtist) => idArtist !== id);

    await this.favoriteRepository.save(
      this.favoriteRepository.create({
        ...favs,
        artists: updatedArtistId,
      }),
    );
    return;
  }

  async addAlbum(id: string): Promise<void> {
    try {
      const favsId = await this.getFavsId();
      const album = await this.albumsService.findOne(id);
      const favs = await this.favoriteRepository.findOne({
        where: { id: favsId },
      });

      await this.favoriteRepository.save(
        this.favoriteRepository.create({
          ...favs,
          albums: [...new Set([...favs.albums, album.id])],
        }),
      );
      return;
    } catch {
      throw new UnprocessableEntityException();
    }
  }

  async removeAlbum(id: string): Promise<void> {
    const favsId = await this.getFavsId();
    const favs = await this.favoriteRepository.findOne({
      where: { id: favsId },
    });

    const updatedTrackId = favs.albums.filter((idAlbum) => idAlbum !== id);

    await this.favoriteRepository.save(
      this.favoriteRepository.create({
        ...favs,
        albums: updatedTrackId,
      }),
    );
    return;
  }
}
