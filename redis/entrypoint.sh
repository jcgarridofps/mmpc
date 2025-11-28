#!/bin/bash

# Replace environment variables in the Redis configuration template
envsubst < /usr/local/etc/redis/redis.template.conf > /usr/local/etc/redis/redis.conf

# Run Redis with configuration
exec redis-server /usr/local/etc/redis/redis.conf