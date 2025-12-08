import { v4 as uuidv4 } from 'uuid';

/**
 * Graph theory and Nodal Network logic
 * Implements Hebbian learning: "Neurons that fire together, wire together"
 */

export interface Node {
  id: string;
  position: { x: number; y: number; z: number };
  activation: number;
  threshold: number;
}

export interface Edge {
  id: string;
  source: string;
  target: string;
  weight: number;
  lastActivation: number;
}

export class NodalNetwork {
  nodes: Map<string, Node>;
  edges: Map<string, Edge>;

  constructor() {
    this.nodes = new Map();
    this.edges = new Map();
  }

  addNode(position: { x: number; y: number; z: number }): string {
    const id = uuidv4();
    this.nodes.set(id, {
      id,
      position,
      activation: 0,
      threshold: 0.5,
    });
    return id;
  }

  addEdge(sourceId: string, targetId: string, initialWeight: number = 0.1): string {
    const id = uuidv4();
    this.edges.set(id, {
      id,
      source: sourceId,
      target: targetId,
      weight: initialWeight,
      lastActivation: 0,
    });
    return id;
  }

  /**
   * Hebbian learning rule: Δw = η * x_i * x_j
   * Strengthens connections between co-active nodes
   */
  hebbianUpdate(sourceId: string, targetId: string, learningRate: number = 0.01): void {
    const source = this.nodes.get(sourceId);
    const target = this.nodes.get(targetId);

    if (!source || !target) return;

    // Find edge between nodes
    const edge = Array.from(this.edges.values()).find(
      (e) => e.source === sourceId && e.target === targetId
    );

    if (!edge) return;

    // Hebbian update
    const deltaWeight = learningRate * source.activation * target.activation;
    edge.weight = Math.max(0, Math.min(1, edge.weight + deltaWeight));
  }

  /**
   * Propagate activation through the network
   */
  propagate(deltaTime: number): void {
    const newActivations = new Map<string, number>();

    this.nodes.forEach((node) => {
      let totalInput = 0;

      // Sum weighted inputs from connected nodes
      this.edges.forEach((edge) => {
        if (edge.target === node.id) {
          const source = this.nodes.get(edge.source);
          if (source) {
            totalInput += source.activation * edge.weight;
          }
        }
      });

      // Activation function (sigmoid)
      const newActivation = 1 / (1 + Math.exp(-(totalInput - node.threshold)));
      newActivations.set(node.id, newActivation);
    });

    // Update all activations
    newActivations.forEach((activation, id) => {
      const node = this.nodes.get(id);
      if (node) {
        node.activation = activation;
      }
    });

    // Apply Hebbian learning to active connections
    this.edges.forEach((edge) => {
      const source = this.nodes.get(edge.source);
      const target = this.nodes.get(edge.target);

      if (source && target && source.activation > 0.5 && target.activation > 0.5) {
        this.hebbianUpdate(edge.source, edge.target, 0.01 * deltaTime);
      }
    });
  }

  /**
   * Calculate network coherence (how synchronized the nodes are)
   */
  calculateCoherence(): number {
    const activations = Array.from(this.nodes.values()).map((n) => n.activation);
    if (activations.length === 0) return 0;

    const mean = activations.reduce((sum, a) => sum + a, 0) / activations.length;
    const variance =
      activations.reduce((sum, a) => sum + Math.pow(a - mean, 2), 0) / activations.length;

    // Coherence is inverse of variance (low variance = high coherence)
    return 1 / (1 + variance);
  }
}
