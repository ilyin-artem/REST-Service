import { IsNotEmpty, IsNumber, IsString, ValidateIf } from 'class-validator';

export class UpdateTrackDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @ValidateIf((_, value) => value !== null)
  @IsNotEmpty()
  @IsString()
  artistId: string | null;

  @ValidateIf((_, value) => value !== null)
  @IsNotEmpty()
  @IsString()
  albumId: string | null;

  @IsNumber()
  duration: number;
}
