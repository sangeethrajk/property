import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModeService {

  createScheme = false;
  editScheme = false;
  viewScheme = true;

  constructor() { }
}
