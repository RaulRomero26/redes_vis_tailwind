// export const countEdges = (edges: any) => {

//     const edgeMap = new Map();

//     edges.forEach((edge: any) => {
//         const key1 = `${edge.from}-${edge.to}`;

//         const existingEdge = edgeMap.get(key1);

//         if (existingEdge) {
//             existingEdge.suma += 1;
//         } else {
//             edgeMap.set(key1, { 
//             ...edge, 
//             suma: edge.atributos?.suma || 1, 
//             label: edge.label || '' 
//             });
//         }
//     });

//     const result = Array.from(edgeMap.values()).map(edge => ({
//         ...edge,
//         label: `${edge.label} \n ${edge.suma}`,
//         atributos: {
//             suma: edge.suma
//         }
//     }));

//     console.log(result);
//     return result;
// }

export const countEdges = (edges: any[]) => {
    const edgeMap = new Map();
  
    edges.forEach((edge: any) => {
      const key = `${edge.from}-${edge.to}`;
  
      const existingEdge = edgeMap.get(key);
  
      if (existingEdge) {
        if (existingEdge.suma !== undefined) {
          existingEdge.suma += edge.atributos?.suma || 1;
        } else {
          existingEdge.suma = (edge.atributos?.suma || 1) + 1;
        }
      } else {
        edgeMap.set(key, {
          ...edge,
          suma: edge.atributos?.suma || 1,
          label: edge.label || '',
        });
      }
    });
  
    return Array.from(edgeMap.values()).map(edge => ({
      ...edge,
      label: `${edge.label} ${edge.suma}`,
    }));
  };