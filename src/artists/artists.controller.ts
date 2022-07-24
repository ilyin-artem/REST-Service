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
import { ArtistsService } from './artists.service';
import { ArtistDto } from './dto/artist.dto';
import { ArtistEntity } from './entities/artist.entity';

@Controller('artist')
export class ArtistsController {
  constructor(private readonly artistsService: ArtistsService) {}

  @Post()
  async create(@Body() createArtistDto: ArtistDto): Promise<ArtistEntity> {
    return this.artistsService.create(createArtistDto);
  }

  @Get()
  findAll(): Promise<ArtistEntity[]> {
    return this.artistsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe()) id: string): Promise<ArtistEntity> {
    return this.artistsService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateArtistDto: ArtistDto,
  ): Promise<ArtistEntity> {
    return this.artistsService.update(id, updateArtistDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    return this.artistsService.remove(id);
  }
}
