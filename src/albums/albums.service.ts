import {
  Injectable,
  NotFoundException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AlbumDto } from './dto/album.dto';
import { AlbumEntity } from './entities/album.entity';
import { TracksService } from './../tracks/tracks.service';
import { FavoritesService } from './../favorites/favorites.service';
import { Repository } from 'typeorm';

@Injectable()
export class AlbumsService {
  constructor(
    @Inject(forwardRef(() => TracksService))
    private readonly tracksService: TracksService,

    @Inject(forwardRef(() => FavoritesService))
    private readonly favoritesService: FavoritesService,
    @InjectRepository(AlbumEntity)
    private albumRepository: Repository<AlbumEntity>,
  ) {}

  async create(albumDto: AlbumDto): Promise<AlbumEntity> {
    const album = this.albumRepository.create(albumDto);
    return await this.albumRepository.save(album);
  }

  async findAll(): Promise<AlbumEntity[]> {
    return await this.albumRepository.find();
  }

  async findOne(id: string): Promise<AlbumEntity> {
    const album = await this.albumRepository.findOne({ where: { id } });
    if (album) return album;
    throw new NotFoundException();
  }

  async update(id: string, albumDto: AlbumDto): Promise<AlbumEntity> {
    const album = await this.albumRepository.findOne({ where: { id } });
    if (album) {
      return await this.albumRepository.save(
        this.albumRepository.create({
          ...album,
          ...albumDto,
        }),
      );
    }
    throw new NotFoundException();
  }

  async remove(id: string): Promise<void> {
    const result = await this.albumRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException();
    }

    await this.tracksService.removeAlbums(id);
    await this.favoritesService.removeAlbum(id);
    return;
  }
  async removeArtist(id: string): Promise<void> {
    const albums = await this.findAll();
    for (const album of albums) {
      if (album.artistId === id)
        await this.update(album.id, { ...album, artistId: null });
    }
    return;
  }
}
