import { Injectable } from '@angular/core';
import { ElectronService } from 'ngx-electron';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor(private _electronService: ElectronService) {
    this.getTokenData();
  }

  requestToken() {
    alert('insert hard token');

  }

  getTokenData() {
    this._electronService.ipcRenderer.on('getTokenData', (event, data) => {
      console.log(event, 'event in services');
      console.log(data, 'data');

    });
  }


}
