/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Observable, catchError, map, of } from 'rxjs';
import * as geoip from 'geoip-lite';

@Injectable()
export class LocationService {

  constructor(private readonly httpService: HttpService) { }

  lookup(ipAddress: string): string | null {
    const geo = geoip.lookup(ipAddress);
    return geo?.country || null;
  }

  mockLookup(ipAddress: string): string | null {
    const geo = geoip.lookup(ipAddress);
    return geo?.country || null;
  }

  mockLookupbyapi(): Observable<string | null> {
    const apiUrl = `https://ipapi.co/json`;
    return this.httpService?.get(apiUrl).pipe(catchError(() => of(null)), map((res: any) => { if (res) { return res?.data?.country; } else { return null; } }));

  }


}