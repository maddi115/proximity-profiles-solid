"""Build and query symbol index from parsed files"""


def build_index(parsed_files):
    """Build symbol index: {symbol_name: {defined_in: [], used_in: []}}"""
    index = {}

    for filepath, facts in parsed_files.items():
        # Index definitions
        for func in facts.get("functions", []):
            index.setdefault(func, {"defined_in": [], "used_in": []})
            if filepath not in index[func]["defined_in"]:
                index[func]["defined_in"].append(filepath)

        for comp in facts.get("components", []):
            index.setdefault(comp, {"defined_in": [], "used_in": []})
            if filepath not in index[comp]["defined_in"]:
                index[comp]["defined_in"].append(filepath)

        for store in facts.get("stores", []):
            index.setdefault(store, {"defined_in": [], "used_in": []})
            if filepath not in index[store]["defined_in"]:
                index[store]["defined_in"].append(filepath)

        # Index usages via imports
        for imp in facts.get("imports", []):
            name = imp["name"]
            index.setdefault(name, {"defined_in": [], "used_in": []})
            if filepath not in index[name]["used_in"]:
                index[name]["used_in"].append(filepath)

    return index


def query_symbol(index, symbol_name):
    """Query symbol by name"""
    return index.get(symbol_name)


def list_symbols_by_type(index, symbol_type):
    """List all symbols of a certain type (e.g., 'store')"""
    if symbol_type == "stores":
        return {k: v for k, v in index.items() if "store" in k.lower()}
    # Add more types as needed
    return {}
