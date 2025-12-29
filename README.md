# Proximity Profiles (Solid)

A proximity-aware social app built with SolidJS.

## Features

- Real-time proximity detection and tracking
- Dynamic Island UI for nearby profiles
- Historical proximity data with encounter tracking
- Distance-based thresholds and visual feedback

## AI Code Assistant

This project includes a semantic code search system powered by AI.

### Quick Start
```bash
# Search your code
python tools/search_code.py 'proximity features'

# Ask AI about your code
python tools/ai_editor_v3.py 'explain proximity features'

# Re-index after changes
python tools/index_codebase.py
```

### Setup

The AI assistant is already configured and ready to use:

- **Embeddings**: nomic-embed-text-v1.5 (768-dim, code-trained)
- **Vector DB**: Postgres + pgvector (local)
- **Indexing**: CocoIndex (incremental updates)
- **AI Model**: MiniMax M2.1 via Anthropic API

See [tools/README.md](tools/README.md) for full documentation.

### Requirements
```bash
# Install Python dependencies
pip install -r requirements.txt

# Ensure Postgres is running
pg_isready
```

### Environment Variables

Create a `.env` file:
```bash
# Anthropic API (configured for MiniMax)
ANTHROPIC_BASE_URL=https://api.minimax.io/anthropic
ANTHROPIC_API_KEY=your_key_here

# Local Postgres
COCOINDEX_DATABASE_URL=postgresql://postgres:postgres@localhost:5432/codebase_index
```

## Development
```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build
npm run build
```

## Tech Stack

- **Frontend**: SolidJS, TypeScript
- **Styling**: CSS Modules
- **AI Assistant**: nomic-embed-text-v1.5, Postgres+pgvector, CocoIndex
- **Database**: PostgreSQL with pgvector extension

## Project Structure
```
src/
├── features/proximity/    # Proximity detection & tracking
│   ├── components/        # UI components
│   ├── hooks/            # Custom hooks
│   └── store/            # State management
├── routes/               # Page routes
└── components/           # Shared components

tools/
├── ai_editor_v3.py       # AI code analysis
├── search_code.py        # Semantic search
├── index_codebase.py     # Indexing pipeline
└── README.md            # AI tools documentation
```

## License

MIT
