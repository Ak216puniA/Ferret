from channels.generic.websocket import AsyncJsonWebsocketConsumer

class AsyncSeasonRoundsConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        print(self.channel_layer)
        await self.accept()

    async def receive_json(self, content, **kwargs):
        print("Reply recieved from frontend!")
        print(content)
        return await super().receive_json(content, **kwargs)

    async def disconnect(self, code):
        return await super().disconnect(code)