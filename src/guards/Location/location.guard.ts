/* eslint-disable prettier/prettier */
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { LocationService } from 'src/services/country.service';

@Injectable()
export class LocationGuard implements CanActivate {

    constructor(private reflector: Reflector, private GeoService: LocationService) { }
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const allowedCountries = this.reflector.get<string[]>('allowedCountries', context.getHandler());
        if (!allowedCountries) { return true; }
        const request = context.switchToHttp().getRequest();
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const userIpAddress = request.ip;

        // with dynamic getting ip by geoip-lite
        // const userCountry: any = this.GeoService.lookup(userIpAddress);

        // with static getting ip by geoip-lite 172.146.77.93 GB
        const userCountry:any = this.GeoService.mockLookup('122.160.255.233');

        // with dynamic getting ip by https://ipapi.co/json
        // const userCountry: any = this.GeoService.mockLookupbyapi().subscribe((res: any) => {
        //     if (!res || !allowedCountries.includes(res)) {
        //         throw new UnauthorizedException('Invalid location');
        //     }
        //     return true;
        // });

        if (!userCountry || !allowedCountries.includes(userCountry)) {
            throw new UnauthorizedException('Invalid location');
        }
        return true;

    }
}
