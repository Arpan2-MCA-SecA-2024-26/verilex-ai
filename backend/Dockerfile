FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .

RUN apt-get update && apt-get install -y \
    build-essential \
    gcc \
    g++ \
    libgl1 \
    libglib2.0-0 \
    default-libmysqlclient-dev \
    pkg-config \
    && pip install --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt

COPY . .

ENV PORT=8080

CMD ["gunicorn", "--bind", "0.0.0.0:8080", "--timeout", "300", "app:app"]