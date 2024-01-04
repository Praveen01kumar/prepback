/* eslint-disable prettier/prettier */

import { SetMetadata } from '@nestjs/common';
export const AllowedCountries = (...countries: string[]) => SetMetadata('allowedCountries', countries);
