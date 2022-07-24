import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AlbumsService } from 'src/albums/albums.service';
import { FavoritesService } from 'src/favorites/favorites.service';
import { Repository } from 'typeorm';
import { TracksService } from './../tracks/tracks.service';
import { ArtistDto } from './dto/artist.dto';
import { ArtistEntity } from './entities/artist.entity';
@Injectable()
export class ArtistsService {
  constructor(
    @Inject(forwardRef(() => TracksService))
    private readonly tracksService: TracksService,

    @Inject(forwardRef(() => AlbumsService))
    private readonly albumsService: AlbumsService,

    @Inject(forwardRef(() => FavoritesService))
    private readonly favoritesService: FavoritesService,

    @InjectRepository(ArtistEntity)
    private artistRepository: Repository<ArtistEntity>,
  ) {}

  async findAll(): Promise<ArtistEntity[]> {
    return await this.artistRepository.find();
  }

  async findOne(id: string): Promise<ArtistEntity> {
    const artist = await this.artistRepository.findOne({ where: { id } });
    if (artist) return artist;
    throw new NotFoundException();
  }

  async create(artistDto: ArtistDto): Promise<ArtistEntity> {
    const artist = this.artistRepository.create(artistDto);
    return await this.artistRepository.save(artist);
  }

  async remove(id: string): Promise<void> {
    const result = await this.artistRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException();
    }
    await this.tracksService.removeArtist(id);
    await this.albumsService.removeArtist(id);
    await this.favoritesService.removeArtist(id);
    return;
  }

  async update(id: string, artistDto: ArtistDto): Promise<ArtistEntity> {
    const artist = await this.artistRepository.findOne({ where: { id } });
    if (artist) {
      return await this.artistRepository.save(
        this.artistRepository.create({
          ...artist,
          ...artistDto,
        }),
      );
    }
    throw new NotFoundException();
  }
}
