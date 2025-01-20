import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { DataSet } from "vis-data";
import { Network } from "vis-network/standalone";

interface NetworkContextProps {
  nodes: DataSet<any>;
  edges: DataSet<any>;
  network: Network | null;
  setNetwork: (network: Network) => void;
  clickedNode: string | null;
  setClickedNode: (nodeId: string | null) => void;
  clickedEdge: string | null;
  setClickedEdge: (edgeId: string | null) => void;
  fisicas: boolean;
  setFisicas: (value: boolean) => void;
}

const NetworkContext = createContext<NetworkContextProps | undefined>(
  undefined
);

export const NetworkProvider = ({ children }: { children: ReactNode }) => {
  const [nodes] = useState(new DataSet<any>());
  const [edges] = useState(new DataSet<any>());
  const [network, setNetwork] = useState<Network | null>(null);
  const [clickedNode, setClickedNode] = useState<string | null>(null);
  const [clickedEdge, setClickedEdge] = useState<string | null>(null);
  const [fisicas, setFisicas] = useState(false);

  useEffect(() => {
    console.log("Clicked Node:", clickedNode);
  }, [clickedNode]);

  useEffect(() => {
    console.log("Clicked Edge:", clickedEdge);
  }, [clickedEdge]);

  return (
    <NetworkContext.Provider
      value={{
        nodes,
        edges,
        network,
        setNetwork,
        clickedNode,
        setClickedNode,
        clickedEdge,
        setClickedEdge,
        fisicas,
        setFisicas
      }}
    >
      {children}
    </NetworkContext.Provider>
  );
};

export const useNetwork = () => {
  const context = useContext(NetworkContext);
  if (context === undefined) {
    throw new Error("useNetwork must be used within a NetworkProvider");
  }
  return context;
};
