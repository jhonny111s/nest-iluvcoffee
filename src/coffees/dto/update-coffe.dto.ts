/* export class UpdateCoffeDto {
  readonly name?: string;
  readonly brand?: string;
  readonly flavors?: string[];
}
 */

import { PartialType } from '@nestjs/mapped-types';
import { CreateCoffeDto } from './create-coffe.dto';

// each field is optional
export class UpdateCoffeDto extends PartialType(CreateCoffeDto) {}
