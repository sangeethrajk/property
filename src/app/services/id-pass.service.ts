import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IdPassService {

  constructor() { }

  private n_ID!: number;

  setN_ID(value: number) {
    this.n_ID = value;
  }

  getN_ID() {
    return this.n_ID;
  }
}
