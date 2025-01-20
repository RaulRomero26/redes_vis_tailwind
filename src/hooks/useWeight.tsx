import { useNetwork } from "../context/NetwokrContext";


export const useWeight = () => {

    const { network, nodes } = useNetwork();

    const establishCenter = () => {
        if(network){
            let selectedNodes = network.getSelectedNodes();
            selectedNodes.forEach((nodeId: any) => {
                const node = nodes.get(nodeId);
                if(node as any){
                    (node as any).atributos.weight = 0;
                }
                nodes.update(node);
            });
        }
    };

  return {
    establishCenter,
  }
}
