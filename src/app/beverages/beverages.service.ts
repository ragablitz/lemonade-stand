import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Beverage } from './entities/beverage.entity';
import { BeverageSize } from './entities/beverage-size.entity';
import { CreateBeverageDto } from './dto/create-beverage.dto';
import { UpdateBeverageDto } from './dto/update-beverage.dto';
import { CreateBeverageSizeDto } from './dto/create-beverage-size.dto';

@Injectable()
export class BeveragesService {
  constructor(
    @InjectRepository(Beverage)
    private beverageRepository: Repository<Beverage>,
    @InjectRepository(BeverageSize)
    private beverageSizeRepository: Repository<BeverageSize>,
  ) {}

  async create(createBeverageDto: CreateBeverageDto): Promise<Beverage> {
    const existingBeverage = await this.beverageRepository.findOne({
      where: { name: createBeverageDto.name },
    });

    if (existingBeverage) {
      throw new ConflictException('Beverage with this name already exists');
    }

    const beverage = this.beverageRepository.create(createBeverageDto);
    const savedBeverage = await this.beverageRepository.save(beverage);

    if (createBeverageDto.sizes && createBeverageDto.sizes.length > 0) {
      const sizes = createBeverageDto.sizes.map(sizeDto => 
        this.beverageSizeRepository.create({
          ...sizeDto,
          price: parseFloat(sizeDto.price),
          beverageId: savedBeverage.id,
        })
      );
      await this.beverageSizeRepository.save(sizes);
    }

    return this.findOne(savedBeverage.id);
  }

  async findAll(): Promise<Beverage[]> {
    return this.beverageRepository.find({
      relations: ['sizes'],
      order: { name: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Beverage> {
    const beverage = await this.beverageRepository.findOne({
      where: { id },
      relations: ['sizes'],
    });

    if (!beverage) {
      throw new NotFoundException(`Beverage with ID ${id} not found`);
    }

    return beverage;
  }

  async update(id: number, updateBeverageDto: UpdateBeverageDto): Promise<Beverage> {
    const beverage = await this.findOne(id);

    if (updateBeverageDto.name && updateBeverageDto.name !== beverage.name) {
      const existingBeverage = await this.beverageRepository.findOne({
        where: { name: updateBeverageDto.name },
      });

      if (existingBeverage) {
        throw new ConflictException('Beverage with this name already exists');
      }
    }

    await this.beverageRepository.update(id, {
      ...updateBeverageDto,
      updatedAt: new Date(),
    });

    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const beverage = await this.findOne(id);
    await this.beverageRepository.remove(beverage);
  }

  // Beverage Size Management
  async createSize(beverageId: number, createSizeDto: CreateBeverageSizeDto): Promise<BeverageSize> {
    const beverage = await this.findOne(beverageId);

    const existingSize = await this.beverageSizeRepository.findOne({
      where: { beverageId, size: createSizeDto.size },
    });

    if (existingSize) {
      throw new ConflictException('Size already exists for this beverage');
    }

    const size = this.beverageSizeRepository.create({
      ...createSizeDto,
      beverageId,
    });

    return this.beverageSizeRepository.save(size);
  }

  async updateSize(beverageId: number, sizeId: number, updateSizeDto: Partial<CreateBeverageSizeDto>): Promise<BeverageSize> {
    const size = await this.beverageSizeRepository.findOne({
      where: { id: sizeId, beverageId },
    });

    if (!size) {
      throw new NotFoundException('Size not found for this beverage');
    }

    await this.beverageSizeRepository.update(sizeId, updateSizeDto);
    return this.beverageSizeRepository.findOne({ where: { id: sizeId } });
  }

  async removeSize(beverageId: number, sizeId: number): Promise<void> {
    const size = await this.beverageSizeRepository.findOne({
      where: { id: sizeId, beverageId },
    });

    if (!size) {
      throw new NotFoundException('Size not found for this beverage');
    }

    await this.beverageSizeRepository.remove(size);
  }
}