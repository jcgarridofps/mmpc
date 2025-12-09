from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

def sendWebSocketUpdate(groupName):
    
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        groupName,
        {
            "type": "send_update",
            "message": f"{groupName} updated"
        }
    )