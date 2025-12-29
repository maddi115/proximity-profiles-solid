"""Find where a symbol is defined and used"""

def find_usages(symbol, symbol_index):
    """Find usages of a symbol"""
    if symbol not in symbol_index:
        return {"error": f"Symbol '{symbol}' not found"}
    
    data = symbol_index[symbol]
    return {
        "symbol": symbol,
        "defined_in": [f.replace('src/', '') for f in data['defined_in']],
        "used_in": [f.replace('src/', '') for f in data['used_in']],
        "usage_count": len(data['used_in'])
    }
