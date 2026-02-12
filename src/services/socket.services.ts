import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from '../environments/environments.prod';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket: Socket;

  constructor() {
    this.socket = io(environment.socketURL, {
      transports: ['websocket'],
    });
  }

  register(userId: number, role: string) {
    this.socket.emit('register', { userId, role });
  }

  onNewNotification(callback: (data: any) => void) {
    this.socket.on('new-notification', callback);
  }

  onDisconnect(callback: () => void) {
    this.socket.on('disconnect', callback);
  }

  disconnect() {
    this.socket.disconnect();
  }

  onLeaveStatusUpdate(callback: (data: any) => void) {
    this.socket.on("leave_status_update", callback);
  }
}
