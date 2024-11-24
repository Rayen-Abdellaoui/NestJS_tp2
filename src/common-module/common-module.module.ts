import { Module } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CommonService } from './common-module.service';

@Module({
  providers: [
    CommonService,
    {
      provide: 'UUID',
      useValue: uuidv4,
    },
    CommonService,
  ],
  exports: ['UUID', CommonService],
})
export class CommonModule {}