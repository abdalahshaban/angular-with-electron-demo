import { Injectable } from '@angular/core';
import { ElectronService } from 'ngx-electron';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor(private _electronService: ElectronService) {
    this.getTokenData();

    this._electronService.ipcRenderer.on('testRes', (event, arg) => {
      console.log(event, 'event testRes');
      console.log(arg, 'arg testRes');
    })

  }

  requestToken() {
    alert('insert hard token');
    this._electronService.ipcRenderer.send('test', 'test angular')
  }

  getTokenData() {
    this._electronService.ipcRenderer.on('getTokenData', (event, data) => {
      console.log(event, 'event in services');
      console.log(data, 'data');

    });
  }


}
