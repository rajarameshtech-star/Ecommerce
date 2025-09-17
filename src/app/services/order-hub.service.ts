import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderHubService {

  private connection!: signalR.HubConnection;
  private apiBaseUrl = environment.apiBaseUrl.replace('/api/', '/') + "order";

  constructor() { }

  /**
   * Starts the SignalR connection with authentication using JWT token.
   */
  startConnection(): Promise<void> {
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(this.apiBaseUrl, {
        accessTokenFactory: () => {
          const jwtToken = localStorage.getItem("jwt");
          if (!jwtToken) {
            console.error("JWT token not found in local storage.");
            throw new Error("JWT token is missing.");
          }
          return jwtToken;
        },
        transport: signalR.HttpTransportType.WebSockets
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();

    return this.connection.start()
      .then(() => {
        console.log('SignalR connection established successfully.');
        this.registerMessageHandlers(); // Register handlers after connection starts
      })
      .catch(err => {
        console.error('Error while starting SignalR connection:', err);
        throw err;
      });
  }

  /**
   * Registers message handlers for SignalR events.
   */
  private registerMessageHandlers(): void {
    if (!this.connection) {
      console.warn("SignalR connection is not initialized.");
      return;
    }

    // Example: Listening to a "ReceiveMessage" event
    this.connection.on('ReceiveMessage', (user: string, message: string) => {
      console.log(`Message received from ${user}: ${message}`);
    });
  }

  /**
   * Invokes the "TriggerUpdate" method on the SignalR hub.
   */
  triggerUpdate(): void {
    if (!this.connection || this.connection.state !== signalR.HubConnectionState.Connected) {
      console.warn("SignalR connection is not established.");
      return;
    }

    this.connection.invoke('TriggerUpdate')
      .then(() => console.log("TriggerUpdate invoked successfully."))
      .catch(err => console.error('Error invoking TriggerUpdate:', err));
  }

  /**
   * Stops the SignalR connection.
   */
  stopConnection(): Promise<void> {
    if (!this.connection) {
      console.warn("SignalR connection is not initialized.");
      return Promise.resolve();
    }

    return this.connection.stop()
      .then(() => console.log("SignalR connection stopped successfully."))
      .catch(err => console.error("Error while stopping SignalR connection:", err));
  }
}
