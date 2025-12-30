#!/usr/bin/env python3
"""
Index your codebase with CocoIndex + Postgres + sentence-transformers.
"""
import cocoindex
import os
from dotenv import load_dotenv

# Load .env file
load_dotenv()

@cocoindex.flow_def(name="CodebaseIndex")
def codebase_index_flow(
    flow_builder: cocoindex.FlowBuilder, 
    data_scope: cocoindex.DataScope
):
    """CocoIndex flow for code indexing"""
    
    print("📂 Reading source files from src/...\n")
    
    # Read code files
    data_scope["code_files"] = flow_builder.add_source(
        cocoindex.sources.LocalFile(
            path="src",
            included_patterns=["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx"],
            excluded_patterns=["**/*.test.ts", "**/*.test.tsx", "**/*.spec.ts", "**/*.d.ts"]
        )
    )
    
    code_embeddings = data_scope.add_collector()
    
    print("✂️  Splitting files into chunks...\n")
    
    with data_scope["code_files"].row() as file:
        file["chunks"] = file["content"].transform(
            cocoindex.functions.SplitRecursively(),
            language="typescript",
            chunk_size=1000,
            chunk_overlap=200
        )
        
        print("🔢 Generating embeddings with sentence-transformers...\n")
        
        with file["chunks"].row() as chunk:
            # CORRECT: Use 'args' parameter as shown in docstring
            chunk["embedding"] = chunk["text"].transform(
                cocoindex.functions.SentenceTransformerEmbed(
                    model="nomic-ai/nomic-embed-text-v1.5",
                    args={"trust_remote_code": True}
                )
            )
            
            code_embeddings.collect(
                filename=file["filename"],
                location=chunk["location"],
                code=chunk["text"],
                embedding=chunk["embedding"]
            )
    
    print("💾 Exporting to Postgres...\n")
    
    code_embeddings.export(
        "codebase_embeddings",
        cocoindex.targets.Postgres(),
        primary_key_fields=["filename", "location"],
        vector_indexes=[
            cocoindex.VectorIndexDef(
                field_name="embedding",
                metric=cocoindex.VectorSimilarityMetric.COSINE_SIMILARITY
            )
        ]
    )

if __name__ == "__main__":
    print("=" * 70)
    print("🔍 INDEXING CODEBASE WITH COCOINDEX")
    print("=" * 70)
    print()
    print("Using:")
    print("  - CocoIndex for data pipeline")
    print("  - sentence-transformers for embeddings")
    print("  - Local Postgres + pgvector for storage")
    print()
    
    db_url = os.getenv("COCOINDEX_DATABASE_URL")
    if not db_url:
        print("❌ COCOINDEX_DATABASE_URL not found!")
        import sys
        sys.exit(1)
    
    print(f"Database URL: {db_url[:50]}...")
    print()
    
    try:
        # Drop old flow to recreate with new dimensions
        print("🗑️  Dropping old flow...")
        try:
            codebase_index_flow.drop()
            print("   ✓ Old flow dropped\n")
        except:
            print("   ✓ No old flow to drop\n")
        
        # Setup the flow first
        print("⚙️  Setting up flow...")
        codebase_index_flow.setup()
        print("   ✓ Setup complete\n")
        
        # Run the flow
        codebase_index_flow.update()
        
        print()
        print("=" * 70)
        print("✅ CODEBASE INDEXED!")
        print("=" * 70)
        print()
        print("Database: Local Postgres (codebase_index)")
        print("Table: codebaseindex__codebase_embeddings")
        print("Model: nomic-embed-text-v1.5 (768 dimensions)")
        print()
        print("Next:")
        print("  python tools/search_code.py 'proximity mapping'")
        print("  python tools/ai_editor_v3.py 'explain proximity features'")
        
    except Exception as e:
        print()
        print("=" * 70)
        print("❌ INDEXING FAILED")
        print("=" * 70)
        print(f"\nError: {e}")
        import traceback
        traceback.print_exc()
        import sys
        sys.exit(1)
