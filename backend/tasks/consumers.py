import json
from channels.generic.websocket import WebsocketConsumer

class TaskConsumer(WebsocketConsumer):
    def connect(self):
        self.accept()

    def disconnect(self, close_code):
        pass

    def receive(self, text_data):
        data = json.loads(text_data)
        # handle incoming messages and broadcast updates
        self.send(text_data=json.dumps(data))