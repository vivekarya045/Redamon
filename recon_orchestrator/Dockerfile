FROM python:3.11-slim

WORKDIR /app

# Retry helper for transient package index/network failures.
RUN printf '#!/bin/sh\nmax=5; n=0; until "$@"; do n=$((n+1)); [ $n -ge $max ] && exit 1; echo "Retry $n/$max ..."; sleep $((n*5)); done\n' \
    > /usr/local/bin/retry && chmod +x /usr/local/bin/retry

# Install Docker CLI for container management and curl for healthcheck
ENV DEBIAN_FRONTEND=noninteractive
RUN apt-get update && apt-get install -y \
    docker.io \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN retry pip install --no-cache-dir --retries 5 --timeout 120 -r requirements.txt

# Copy application code
COPY *.py .

# Run the FastAPI application
CMD ["uvicorn", "api:app", "--host", "0.0.0.0", "--port", "8010"]
