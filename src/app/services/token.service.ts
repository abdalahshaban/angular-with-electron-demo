import { Injectable } from '@angular/core';
const electron = (<any>window).require('electron');

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor() {
    this.getTokenData();
  }

  requestToken() {
    alert('insert hard token')
  }

  getTokenData() {
    electron.ipcRenderer.on('getTokenData', (event, data) => {
      console.log(event, 'event in services');
      console.log(data, 'data');

    });
  }


}
