# AGENTS.md - Guidelines for AI Agents

This document provides guidelines for AI coding agents working in this repository.

## Project Overview

- **Project name**: TinyMagiq FDE Training
- **Python version**: 3.13
- **Package manager**: uv

## Build / Run Commands

### Install dependencies
```bash
uv sync
```

### Run a single Python file
```bash
uv run python path/to/file.py
```

### Run the FastAPI backend

The backend should always be executed from within the `backend/` directory as the current directory

Then run this command below

```bash
uv run fastapi dev app/main.py
```

## Testing

This project currently has no formal test framework. When adding tests:

## Code Style Guidelines

### General Principles
- Write clean, readable, and idiomatic Python code
- Prefer explicit over implicit
- Keep functions small and focused (single responsibility)

### Formatting
- Use 4 spaces for indentation (no tabs)
- Maximum line length: 100 characters
- Add trailing commas in multi-line collections

### Imports
Group imports in the following order (separated by blank lines):
1. Standard library
2. Third-party packages
3. Local application modules

Sort imports alphabetically within each group:
```python
import os
import sys
from typing import Optional

import psycopg2
from psycopg2 import pool

from myapp import config
from myapp.models import User
```

### Naming Conventions
- **Variables/functions**: snake_case (`user_name`, `calculate_total`)
- **Classes**: PascalCase (`UserProfile`, `DatabaseConnection`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_RETRIES`, `DEFAULT_TIMEOUT`)
- **Private variables**: prefix with underscore (`_internal_state`)
- **Avoid single-letter names** except in comprehensions or loop indices

### Type Hints
Use type hints for function arguments and return values:
```python
def get_user(user_id: int) -> Optional[User]:
    ...
```

### Error Handling
- Use specific exception types
- Handle exceptions at the appropriate level
- Include meaningful error messages
- Clean up resources using `try/finally` or context managers

### Database Operations
- Always close database connections (use context managers or try/finally)
- Use parameterized queries to prevent SQL injection
- Handle `None` results from fetchone() safely:
```python
result = cursor.fetchone()
if result is not None:
    value = result[0]
```

## Database Configuration
- Host: localhost
- Port: 5432
- Database: trainingdb
- User: admin
- Password: secret

## Linting and Type Checking (Recommended)
```bash
# Install Ruff (fast linter/formatter)
uv add --dev ruff
uv run ruff check .
uv run ruff format .

# Install mypy for type checking
uv add --dev mypy
uv run mypy .
```

## Common Tasks
### Adding a new dependency
```bash
uv add package_name
uv add --dev dev_package_name
```

### Using Docker for PostgreSQL
```bash
docker run -d \
  --name tinymagiq-postgres \
  -e POSTGRES_USER=admin \
  -e POSTGRES_PASSWORD=secret \
  -e POSTGRES_DB=trainingdb \
  -p 5432:5432 \
  postgres
```

## Notes for Agents
- Always verify changes work by running the affected code
- When modifying database scripts, test with actual database connection
- Follow existing code patterns in this repository
