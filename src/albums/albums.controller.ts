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
import { AlbumsService } from './albums.service';
import { AlbumDto } from './dto/album.dto';
import { AlbumEntity } from './entities/album.entity';

@Controller('album')
export class AlbumsController {
  constructor(private readonly albumsService: AlbumsService) {}

  @Post()
  create(@Body() createAlbumDto: AlbumDto): Promise<AlbumEntity> {
    return this.albumsService.create(createAlbumDto);
  }

  @Get()
  findAll(): Promise<AlbumEntity[]> {
    return this.albumsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe()) id: string): Promise<AlbumEntity> {
    return this.albumsService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateAlbumDto: AlbumDto,
  ): Promise<AlbumEntity> {
    return this.albumsService.update(id, updateAlbumDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    return this.albumsService.remove(id);
  }
}
