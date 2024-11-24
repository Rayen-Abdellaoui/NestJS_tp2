import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cv } from './entities/cv.entity';
import { CreateCvDto } from './dto/create-cv.dto';
import { UpdateCvDto } from './dto/update-cv.dto';

@Injectable()
export class CvService {
  constructor(
    @InjectRepository(Cv)
    private cvRepository: Repository<Cv>,
  ) {}

  async create(createCvDto: CreateCvDto): Promise<Cv> {
    const cv = this.cvRepository.create(createCvDto);
    return await this.cvRepository.save(cv);
  }

  async findOne(id: string): Promise<Cv> {  
    return this.cvRepository.findOne({ where: { id } });
  }

  async findAll(): Promise<Cv[]> {
    return this.cvRepository.find();
  }

  async update(id: string, updateCvDto: UpdateCvDto): Promise<Cv> {  
    await this.cvRepository.update(id, updateCvDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {  
    await this.cvRepository.delete(id);
  }
}
