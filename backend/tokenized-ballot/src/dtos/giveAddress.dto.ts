import { ApiProperty } from '@nestjs/swagger';

export class GiveAddressDto {
  @ApiProperty({ type: String, required: true, default: 'Input Address' })
  walletAddress: string;
  contractAddress: string;
}
