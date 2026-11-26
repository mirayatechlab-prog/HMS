FROM python:3.13-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1

WORKDIR /app

RUN addgroup --system medicore && adduser --system --ingroup medicore medicore

COPY pyproject.toml requirements.lock ./
RUN pip install --upgrade pip && pip install --no-cache-dir -r requirements.lock

COPY alembic.ini ./
COPY alembic ./alembic
COPY app ./app

RUN chown -R medicore:medicore /app
USER medicore

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
