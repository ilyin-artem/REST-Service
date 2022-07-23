import {
  Injectable,
  NotFoundException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { v4 as uuidv4 } from 'uuid';
import { Album } from './interfaces/album.interface';
import { TracksService } from './../tracks/tracks.service';
import { FavoritesService } from './../favorites/favorites.service';

@Injectable()
export class AlbumsService {
  constructor(
    @Inject(forwardRef(() => TracksService))
    private readonly tracksService: TracksService,

    @Inject(forwardRef(() => FavoritesService))
    private readonly favoritesService: FavoritesService,
  ) {}
  private albums: Album[] = [];

  async create(createAlbumDto: CreateAlbumDto): Promise<Album> {
    const newAlbum = {
      id: uuidv4(),
      ...createAlbumDto,
    };
    this.albums.push(newAlbum);
    return newAlbum;
  }

  async findAll(): Promise<Album[]> {
    return this.albums;
  }

  async findOne(id: string): Promise<Album> {
    const album = this.albums.find((album) => id === album.id);
    if (album) return album;
    throw new NotFoundException();
  }

  async update(id: string, updateAlbumDto: UpdateAlbumDto): Promise<Album> {
    const album = this.albums.find((album) => id === album.id);
    if (album) {
      let updatedAlbum: Album | null = null;
      this.albums = this.albums.map((album) =>
        album.id === id
          ? (updatedAlbum = {
              ...album,
              ...updateAlbumDto,
            })
          : album,
      );

      return updatedAlbum;
    }
    throw new NotFoundException();
  }

  async remove(id: string): Promise<Album> {
    const album = this.albums.find((album) => id === album.id);
    if (album) {
      await this.tracksService.removeAlbums(id);
      await this.favoritesService.removeAlbum(id);
      this.albums = this.albums.filter((album) => album.id !== id);
      return;
    }
    throw new NotFoundException();
  }
  async removeArtist(id: string): Promise<void> {
    this.albums = this.albums.map((album) =>
      album.artistId === id ? { ...album, artistId: null } : album,
    );
    return;
  }
}
