import { SubscribeMessage, WebSocketGateway, OnGatewayConnection, MessageBody, ConnectedSocket, OnGatewayDisconnect, WebSocketServer } from '@nestjs/websockets';
import { ILedChangeDTO, IButtonPressDTO } from "@johny-five/interfaces";
import { Socket, Server } from 'socket.io';

@WebSocketGateway()
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private arduinos: Socket[] = [];
  @WebSocketServer()
  server: Server

  @SubscribeMessage('identifyAsArduino')
  handleArduino(
    @ConnectedSocket() client: Socket
  ) {
    this.arduinos.push(client);
    console.log('New arduino found: ' + client.id);
  }

  @SubscribeMessage('updateLED')
  handleLEDChange(
    @MessageBody() data: ILedChangeDTO
  ) {
    if (this.arduinos.length) {
      this.emitToArduinos('updateLED', data);
      return { resCode: 1, msg: 'Succes!' };
    }

    return { resCode: 0, msg: 'Failed, no arduinos found...' }
  }

  emitToArduinos(event: string, data: ILedChangeDTO) {
    this.arduinos.forEach((arduino) => {
      arduino.emit(event, data);
    });
  }

  @SubscribeMessage('arduinoDisconnect')
  handleArduinoDisconnect(
    @ConnectedSocket() client: Socket
  ) {
    console.log('Arduino disconnected: ' + client.id);
    this.arduinos = this.arduinos.filter(socket => socket.id != client.id);
  }

  @SubscribeMessage('buttonPressed')
  handeButtonPress(
    @MessageBody() data: IButtonPressDTO
  ) {
    this.server.emit('buttonPressed', data);
  }

  handleConnection() {
    console.log('Client connected')
  }

  handleDisconnect() {
    console.log('Client disconnected');
  }
}