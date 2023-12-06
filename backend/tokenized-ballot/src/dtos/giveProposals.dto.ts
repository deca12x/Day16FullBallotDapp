import { ApiProperty } from '@nestjs/swagger';

export class GiveProposalsDto {
  @ApiProperty({ type: [String], required: true, default: ['Input proposals'] })
  proposals: string[];
}
