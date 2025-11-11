import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket: Socket;

  constructor() {
    this.socket = io(environment.backendURL);
  }

  register(userId: number, role: string) {
    this.socket.emit('register', { userId, role });
  }

  onNewNotification(callback: (data: any) => void) {
    this.socket.on('new-notification', callback);
  }
}
