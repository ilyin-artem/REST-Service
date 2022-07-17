import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { TracksService } from './tracks.service';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { Track } from './interfaces/track.interface';

@Controller('track')
export class TracksController {
  constructor(private readonly tracksService: TracksService) {}

  @Post()
  async create(
    @Body() createTrackDto: CreateTrackDto,
  ): Promise<Omit<Track, 'password'>> {
    return this.tracksService.create(createTrackDto);
  }

  @Get()
  findAll(): Promise<Track[]> {
    return this.tracksService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe()) id: string): Promise<Track> {
    return this.tracksService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() UpdateTrackDto: UpdateTrackDto,
  ): Promise<Track> {
    return this.tracksService.update(id, UpdateTrackDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', new ParseUUIDPipe()) id: string): Promise<Track> {
    return this.tracksService.remove(id);
  }
}
