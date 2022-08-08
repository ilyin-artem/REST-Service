import {
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FavoritesService } from './../favorites/favorites.service';
import { Repository } from 'typeorm';
import { TrackDto } from './dto/track.dto';
import { TrackEntity } from './entities/track.entity';

@Injectable()
export class TracksService {
  constructor(
    @Inject(forwardRef(() => FavoritesService))
    private readonly favoritesService: FavoritesService,

    @InjectRepository(TrackEntity)
    private trackRepository: Repository<TrackEntity>,
  ) {}

  async create(trackDto: TrackDto): Promise<TrackEntity> {
    const track = this.trackRepository.create(trackDto);
    return await this.trackRepository.save(track);
  }
  async findAll(): Promise<TrackEntity[]> {
    return await this.trackRepository.find();
  }

  async findOne(id: string): Promise<TrackEntity> {
    const track = await this.trackRepository.findOne({ where: { id } });
    if (track) return track;
    throw new NotFoundException();
  }

  async update(id: string, trackDto: TrackDto): Promise<TrackEntity> {
    const track = await this.trackRepository.findOne({ where: { id } });
    if (track) {
      return await this.trackRepository.save(
        this.trackRepository.create({
          ...track,
          ...trackDto,
        }),
      );
    }
    throw new NotFoundException();
  }

  async remove(id: string): Promise<void> {
    const trackDeleted = await this.trackRepository.delete(id);
    if (trackDeleted.affected === 0) {
      throw new NotFoundException();
    }
    await this.favoritesService.removeTrack(id);
    return;
  }
  async removeArtist(id: string): Promise<void> {
    const tracks = await this.findAll();
    for (const track of tracks) {
      if (track.artistId === id)
        await this.update(track.id, { ...track, artistId: null });
    }
    return;
  }

  async removeAlbums(id: string): Promise<void> {
    const tracks = await this.findAll();
    for (const track of tracks) {
      if (track.albumId === id)
        await this.update(track.id, { ...track, albumId: null });
    }
    return;
  }
}
