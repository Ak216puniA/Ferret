from channels.generic.websocket import AsyncJsonWebsocketConsumer

class AsyncSeasonRoundsConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        print("Reaching here..........")
        await self.accept()
        # return await super().connect()

    async def receive_json(self, content, **kwargs):
        return await super().receive_json(content, **kwargs)

    async def disconnect(self, code):
        return await super().disconnect(code)