from django.http import StreamingHttpResponse
from asgiref.sync import sync_to_async

class AsyncStreamingHttpResponse(StreamingHttpResponse):

    async def __aiter__(self):
        if self.streaming:
            # Check if _iterator is already an async iterator
            if hasattr(self._iterator, '__anext__'):
                # It's an async iterator, yield from it directly
                async for item in self._iterator:
                    yield item
            else:
                # It's a sync iterator, use sync_to_async to iterate over it
                sync_iterator = self._iterator
                while True:
                    try:
                        chunk = await sync_to_async(next)(sync_iterator)
                        yield chunk
                    except StopIteration:
                        return  # Just return instead of breaking
        else:
            raise TypeError("The streaming content must be an iterator or an asynchronous iterator.")