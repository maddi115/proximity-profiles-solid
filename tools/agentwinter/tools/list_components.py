"""List all components in the codebase"""

def list_components(symbol_index, parsed_files):
    """List all components"""
    components = {}
    for filepath, facts in parsed_files.items():
        for comp in facts.get('components', []):
            if comp in symbol_index:
                components[comp] = symbol_index[comp]
    
    return {
        "count": len(components),
        "components": [
            {
                "name": name,
                "defined_in": data['defined_in'][0].replace('src/', '') if data['defined_in'] else None,
                "usage_count": len(data['used_in'])
            }
            for name, data in sorted(components.items())
        ]
    }
