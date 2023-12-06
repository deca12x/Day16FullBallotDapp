import { ApiProperty } from '@nestjs/swagger';

export class GiveNumberDto {
  @ApiProperty({ type: Number, required: true, default: 'Number of proposals' })
  number: number;
  voteWeight: number;
}
