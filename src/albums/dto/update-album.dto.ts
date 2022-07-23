import { IsNotEmpty, IsNumber, IsString, ValidateIf } from 'class-validator';
export class UpdateAlbumDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  year: number;

  @ValidateIf((_, value) => value !== null)
  @IsNotEmpty()
  @IsString()
  artistId: string | null;
}
