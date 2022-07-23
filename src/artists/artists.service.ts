import {
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { v4 as uuidv4 } from 'uuid';
import { Artist } from './interfaces/artist.interface';
import { TracksService } from './../tracks/tracks.service';
import { AlbumsService } from './../albums/albums.service';
import { FavoritesService } from './../favorites/favorites.service';

@Injectable()
export class ArtistsService {
  constructor(
    @Inject(forwardRef(() => TracksService))
    private readonly tracksService: TracksService,

    @Inject(forwardRef(() => AlbumsService))
    private readonly albumsService: AlbumsService,

    @Inject(forwardRef(() => FavoritesService))
    private readonly favoritesService: FavoritesService,
  ) {}
  private artists: Artist[] = [];

  async create(createArtistDto: CreateArtistDto): Promise<Artist> {
    const newArtist = {
      id: uuidv4(),
      ...createArtistDto,
    };
    this.artists.push(newArtist);
    return newArtist;
  }

  async findAll(): Promise<Artist[]> {
    return this.artists;
  }

  async findOne(id: string): Promise<Artist> {
    const artist = this.artists.find((artist) => id === artist.id);
    if (artist) return artist;
    throw new NotFoundException();
  }

  async update(id: string, updateArtistDto: UpdateArtistDto): Promise<Artist> {
    const artist = this.artists.find((artist) => id === artist.id);
    if (artist) {
      let updatedArtist: Artist | null = null;
      this.artists = this.artists.map((artist) =>
        artist.id === id
          ? (updatedArtist = {
              ...artist,
              ...updateArtistDto,
            })
          : artist,
      );

      return updatedArtist;
    }
    throw new NotFoundException();
  }

  async remove(id: string): Promise<Artist> {
    const artist = this.artists.find((artist) => id === artist.id);
    if (artist) {
      await this.tracksService.removeArtist(id);
      await this.albumsService.removeArtist(id);
      await this.favoritesService.removeArtist(id);
      this.artists = this.artists.filter((artist) => artist.id !== id);
      return;
    }
    throw new NotFoundException();
  }
}
