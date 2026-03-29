import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateFridgeDto, UpdateFridgeDto } from 'src/domain/fridge/dto/fridge.dto';
import { FridgeService } from 'src/service/fridge/fridge.service';

@Controller('fridge')
export class FridgeController {
  constructor(private readonly fridgeService: FridgeService) {}

  @Get('recommend/:memberId')
  recommendRecipe(@Param('memberId') memberId: string) {
    return this.fridgeService.recommendRecipe(Number(memberId));
  }

  @Post()
  create(@Body() dto: CreateFridgeDto) {
    return this.fridgeService.create(dto);
  }

  @Get(':memberId')
  findAll(@Param('memberId') memberId: string) {
    return this.fridgeService.findAll(Number(memberId));
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateFridgeDto) {
    return this.fridgeService.update(Number(id), dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.fridgeService.remove(Number(id));
  }
}