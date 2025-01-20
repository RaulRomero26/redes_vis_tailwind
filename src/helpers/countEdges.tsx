export const countEdges = (edges: any) => {

    const edgeMap = new Map();

    edges.forEach((edge: any) => {
        const key1 = `${edge.from}-${edge.to}`;

        if (edgeMap.has(key1)) {
            const existingEdge = edgeMap.get(key1);
            existingEdge.suma += 1;
            existingEdge.label = existingEdge.label ? `${existingEdge.label}, ${edge.label}` : edge.label;
        } else {
            edgeMap.set(key1, { ...edge, suma: 1, label: edge.label || '' });
        }
    });

    const result = Array.from(edgeMap.values()).map(edge => ({
        ...edge,
        label: `${edge.label} \n ${edge.suma}`,
        atributos: {
            suma: edge.suma
        }
    }));

    console.log(result);
    return result;
}