"""List all stores in the codebase"""

def list_stores(symbol_index):
    """List all stores"""
    stores = {k: v for k, v in symbol_index.items() if 'store' in k.lower()}
    return {
        "count": len(stores),
        "stores": [
            {
                "name": name,
                "defined_in": data['defined_in'][0].replace('src/', '') if data['defined_in'] else None,
                "usage_count": len(data['used_in'])
            }
            for name, data in sorted(stores.items())
        ]
    }
