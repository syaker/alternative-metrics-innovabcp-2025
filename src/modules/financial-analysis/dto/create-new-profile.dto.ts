import { ApiProperty } from '@nestjs/swagger';
import { DocumentType } from '@prisma/client';
import { IsEmail, IsEnum, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'user@example.com', description: 'User email' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'John Doe', description: 'Full name of the user' })
  @IsString()
  name: string;

  @ApiProperty({ example: '+1234567890', description: 'Phone number' })
  @IsString()
  phone: string;

  @ApiProperty({ example: '12345678', description: 'Document number' })
  @IsString()
  document: string;

  @ApiProperty({
    example: DocumentType.PASSPORT,
    enum: DocumentType,
    description: 'Type of document',
  })
  @IsEnum(DocumentType)
  documentType: DocumentType;
}
