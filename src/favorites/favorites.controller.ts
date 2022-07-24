import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { FavoriteEntityResult } from './entities/favorite.entity';

@Controller('favs')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  findAll(): Promise<FavoriteEntityResult> {
    return this.favoritesService.findAll();
  }

  @Post('track/:id')
  addTrack(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    return this.favoritesService.addTrack(id);
  }

  @Delete('track/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeTrack(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    return this.favoritesService.removeTrack(id);
  }

  @Post('album/:id')
  addAlbum(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    return this.favoritesService.addAlbum(id);
  }

  @Delete('album/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeAlbum(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    return this.favoritesService.removeAlbum(id);
  }

  @Post('artist/:id')
  addArtist(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    return this.favoritesService.addArtist(id);
  }

  @Delete('artist/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeArtist(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    return this.favoritesService.removeArtist(id);
  }
}
