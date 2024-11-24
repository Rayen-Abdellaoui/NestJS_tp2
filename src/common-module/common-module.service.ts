import { Injectable, Inject } from '@nestjs/common';

@Injectable()
export class CommonService {
  constructor(@Inject('UUID') private readonly uuidv4: () => string) {}

  generateUuid(): string {
    return this.uuidv4();
  }
}