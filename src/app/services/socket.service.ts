import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket: Socket;

  constructor() {
    this.socket = io('http://localhost:5000'); 
  }

  // Emit event when a contact is locked
  emitLockContact(id: number, lockedBy: string): void {
    this.socket.emit('lockContact', { id, lockedBy });
  }

  // Emit event when a contact is unlocked
  emitUnlockContact(id: number): void {
    this.socket.emit('unlockContact', { id });
  }

  // Listen for locked contact events
  onContactLocked(): Observable<{ id: number; lockedBy: string }> {
    return new Observable((observer) => {
      this.socket.on('contactLocked', (data) => observer.next(data));
    });
  }

  // Listen for unlocked contact events
  onContactUnlocked(): Observable<{ id: number }> {
    return new Observable((observer) => {
      this.socket.on('contactUnlocked', (data) => observer.next(data));
    });
  }
}
