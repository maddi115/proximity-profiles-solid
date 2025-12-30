"""Dependency graph visualization with mermaid"""

import os
from collections import defaultdict


def build_import_graph(parsed_files):
    """Build dependency graph from parsed files

    Returns:
        dict: {
            'nodes': [list of files],
            'edges': [(from, to), ...],
            'features': {feature_name: [files]},
            'stores': {store_name: file},
            'components': {component_name: file}
        }
    """
    graph = {
        "nodes": [],
        "edges": [],
        "features": defaultdict(list),
        "stores": {},
        "components": {},
    }

    # Build node list and categorize files
    for filepath, facts in parsed_files.items():
        graph["nodes"].append(filepath)

        # Categorize by feature
        if "features/" in filepath:
            parts = filepath.split("features/")[1].split("/")
            if len(parts) > 0:
                feature = parts[0]
                graph["features"][feature].append(filepath)

        # Identify stores
        if "/store/" in filepath or "Store" in filepath:
            for store in facts.get("stores", []):
                graph["stores"][store] = filepath

        # Identify components
        for component in facts.get("components", []):
            graph["components"][component] = filepath

    # Build edges from imports
    for filepath, facts in parsed_files.items():
        imports = facts.get("imports", [])

        for imp in imports:
            # Try to resolve import to actual file
            target_file = resolve_import(imp, filepath, parsed_files)
            if target_file and target_file in graph["nodes"]:
                graph["edges"].append((filepath, target_file))

    return graph


def resolve_import(import_dict, source_file, parsed_files):
    """Try to resolve an import dict to an actual file

    import_dict example: {'name': 'createStore', 'from': 'solid-js/store'}
    """
    if not isinstance(import_dict, dict):
        return None

    import_path = import_dict.get("from", "")
    if not import_path:
        return None

    # Skip external imports (node_modules, external libraries)
    if not import_path.startswith(".") and not import_path.startswith("src/"):
        return None

    # Simple resolution - check if any parsed file matches
    for filepath in parsed_files.keys():
        # Check if import path matches file path
        if import_path in filepath:
            return filepath

        # Handle relative imports
        if import_path.startswith("."):
            # Try to resolve relative to source file
            import_parts = import_path.split("/")
            for part in import_parts:
                if part in filepath:
                    return filepath

        # Check if the imported name matches filename
        import_name = import_path.split("/")[-1]
        if import_name in filepath:
            return filepath

    return None


def generate_feature_graph(feature_name, graph):
    """Generate mermaid graph for a specific feature

    Args:
        feature_name: Name of feature (e.g., 'proximity', 'auth')
        graph: Full dependency graph from build_import_graph

    Returns:
        str: Mermaid diagram syntax
    """
    if feature_name not in graph["features"]:
        return f"Error: Feature '{feature_name}' not found"

    feature_files = graph["features"][feature_name]

    # Find external dependencies
    external_deps = defaultdict(list)
    internal_edges = []

    for src, dst in graph["edges"]:
        if src in feature_files:
            if dst in feature_files:
                internal_edges.append((src, dst))
            else:
                # External dependency
                if "features/" in dst:
                    ext_feature = dst.split("features/")[1].split("/")[0]
                    if ext_feature not in external_deps:
                        external_deps[ext_feature] = []
                    external_deps[ext_feature].append(dst)

    # Generate mermaid
    mermaid = ["graph TD"]
    mermaid.append(f"    {feature_name}[{feature_name.title()} Feature]")
    mermaid.append("")

    # Add external dependencies
    for ext_feature in external_deps.keys():
        node_id = ext_feature.replace("-", "_")
        mermaid.append(f"    {node_id}[{ext_feature.title()}]")
        mermaid.append(f"    {feature_name} --> {node_id}")

    mermaid.append("")

    # Add key files in the feature
    for filepath in feature_files[:10]:  # Limit to 10 files
        basename = os.path.basename(filepath)
        node_id = basename.replace(".", "_").replace("-", "_")
        mermaid.append(f"    {node_id}[{basename}]")
        mermaid.append(f"    {feature_name} --> {node_id}")

    # Styling
    mermaid.append("")
    mermaid.append(
        f"    style {feature_name} fill:#ff6b6b,stroke:#333,stroke-width:4px"
    )

    for i, ext_feature in enumerate(external_deps.keys()):
        colors = ["#4ecdc4", "#ffe66d", "#95e1d3", "#f38181"]
        color = colors[i % len(colors)]
        node_id = ext_feature.replace("-", "_")
        mermaid.append(f"    style {node_id} fill:{color}")

    return "\n".join(mermaid)


def generate_store_graph(store_name, symbol_index, parsed_files):
    """Generate mermaid graph showing store dependencies

    Args:
        store_name: Name of store (e.g., 'authStore')
        symbol_index: Symbol index from build_index
        parsed_files: Parsed files data

    Returns:
        str: Mermaid diagram syntax
    """
    if store_name not in symbol_index:
        return f"Error: Store '{store_name}' not found"

    usages = symbol_index[store_name]

    # Convert to list if it's a set or other type
    if not isinstance(usages, list):
        usages = list(usages)

    mermaid = ["graph LR"]
    mermaid.append(f"    store[{store_name}]")
    mermaid.append("")

    # Add files that use this store
    for i, filepath in enumerate(usages[:15]):  # Limit to 15
        basename = os.path.basename(filepath)
        node_id = f"file{i}"
        mermaid.append(f"    {node_id}[{basename}]")
        mermaid.append(f"    store --> {node_id}")

    # Styling
    mermaid.append("")
    mermaid.append("    style store fill:#ff6b6b,stroke:#333,stroke-width:4px")

    return "\n".join(mermaid)


def generate_cross_feature_graph(graph):
    """Generate high-level cross-feature dependency graph

    Args:
        graph: Full dependency graph from build_import_graph

    Returns:
        str: Mermaid diagram syntax
    """
    # Build feature-to-feature edges
    feature_edges = set()

    for src, dst in graph["edges"]:
        src_feature = None
        dst_feature = None

        if "features/" in src:
            src_feature = src.split("features/")[1].split("/")[0]
        if "features/" in dst:
            dst_feature = dst.split("features/")[1].split("/")[0]

        if src_feature and dst_feature and src_feature != dst_feature:
            feature_edges.add((src_feature, dst_feature))

    # Generate mermaid
    mermaid = ["graph TB"]

    # Add all features as nodes
    features = sorted(graph["features"].keys())
    for feature in features:
        node_id = feature.replace("-", "_")
        mermaid.append(f"    {node_id}[{feature.title()} Feature]")

    mermaid.append("")

    # Add edges
    for src, dst in sorted(feature_edges):
        src_id = src.replace("-", "_")
        dst_id = dst.replace("-", "_")
        mermaid.append(f"    {src_id} --> {dst_id}")

    # Styling with different colors
    mermaid.append("")
    colors = ["#ff6b6b", "#4ecdc4", "#ffe66d", "#95e1d3", "#f38181", "#aa96da"]
    for i, feature in enumerate(features):
        node_id = feature.replace("-", "_")
        color = colors[i % len(colors)]
        mermaid.append(f"    style {node_id} fill:{color}")

    return "\n".join(mermaid)


def dependency_graph(graph_type, target=None, symbol_index=None, parsed_files=None):
    """Main entry point for dependency graph generation

    Args:
        graph_type: 'feature', 'store', 'cross-feature', 'full'
        target: Target name (feature name, store name, etc.)
        symbol_index: Symbol index (required for store graphs)
        parsed_files: Parsed files (required)

    Returns:
        dict with mermaid diagram and metadata
    """
    if not parsed_files:
        return {"error": "No parsed files available"}

    # Build full graph
    graph = build_import_graph(parsed_files)

    if graph_type == "feature":
        if not target:
            return {
                "error": "Feature name required",
                "available_features": list(graph["features"].keys()),
            }
        mermaid = generate_feature_graph(target, graph)

    elif graph_type == "store":
        if not target or not symbol_index:
            return {
                "error": "Store name and symbol_index required",
                "available_stores": list(graph["stores"].keys()),
            }
        mermaid = generate_store_graph(target, symbol_index, parsed_files)

    elif graph_type == "cross-feature":
        mermaid = generate_cross_feature_graph(graph)

    else:
        return {"error": f"Unknown graph type: {graph_type}"}

    return {
        "diagram": mermaid,
        "type": graph_type,
        "target": target,
        "node_count": len(graph["nodes"]),
        "edge_count": len(graph["edges"]),
        "feature_count": len(graph["features"]),
    }
