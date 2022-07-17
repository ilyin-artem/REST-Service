import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { v4 as uuidv4 } from 'uuid';
import { Track } from './interfaces/tracks.interface';

@Injectable()
export class TracksService {
  private tracks: Track[] = [];

  async create(createTrackDto: CreateTrackDto): Promise<Track> {
    const newTrack = {
      id: uuidv4(),
      ...createTrackDto,
    };
    this.tracks.push(newTrack);
    return newTrack;
  }

  async findAll(): Promise<Track[]> {
    return this.tracks;
  }

  async findOne(id: string): Promise<Track> {
    const track = this.tracks.find((track) => id === track.id);
    if (track) return track;
    throw new NotFoundException();
  }

  async update(id: string, updateTrackDto: UpdateTrackDto): Promise<Track> {
    const track = this.tracks.find((track) => id === track.id);
    if (track) {
      let updatedTrack: Track | null = null;
      this.tracks = this.tracks.map((track) =>
        track.id === id
          ? (updatedTrack = {
              ...track,
              ...updateTrackDto,
            })
          : track,
      );

      return updatedTrack;
    }
    throw new NotFoundException();
  }

  async remove(id: string): Promise<Track> {
    const track = this.tracks.find((track) => id === track.id);
    if (track) {
      this.tracks = this.tracks.filter((track) => track.id !== id);
      return;
    }
    throw new NotFoundException();
  }
}
