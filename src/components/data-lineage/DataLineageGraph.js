import { Button, Modal } from 'react-bootstrap';
import React, {Component} from 'react';
import ReactFlow, {
    ReactFlowProvider,
    removeElements,
    addEdge,
    MiniMap,
    Controls,
    Background,
  } from 'react-flow-renderer';
import { DataLineageGraphNode, nodeTypes } from './GraphNodeTypes';

export default class DataLineageGraph extends Component {
    
    constructor(props, context) {
        super(props, context)
        this.state = {
            nodes: []
        }
    }

    onLoad = (reactFlowInstance) => {
        console.log('flow loaded:', reactFlowInstance);
        reactFlowInstance.fitView();
    };

    onElementsRemove = (elementsToRemove) =>
      this.setState({nodes: removeElements(elementsToRemove, this.state.nodes)});
    onConnect = (params) => this.setState({nodes: addEdge(params, this.state.nodes)});

    onAdd = () => {
        let maxId = 0; 
        this.state.nodes.forEach( n => {maxId = n.id > maxId ?  n.id : maxId })
        const newNode = {
          id: maxId,
          data: { id: maxId, label: 'Added node', comment: 'Comment' },
          type: 'dataLineageGraphNode',
          position: {
            x: Math.random() * window.innerWidth - 100,
            y: Math.random() * window.innerHeight,
          },
        };
        this.setState({nodes: this.state.nodes.concat(newNode)})
      }

    render() {
        return (
            <ReactFlowProvider>
                <div>
                    <button onClick={this.onAdd}>add node</button>
                    <button onClick={() => this.setState({show: true})}>show json</button>
                </div>
                <ReactFlow
                    style={{width: '100%', height: '100%'}}
                    elements={this.state.nodes}
                    onElementsRemove={this.onElementsRemove}
                    onConnect={this.onConnect}
                    onLoad={this.onLoad}
                    nodeTypes={nodeTypes}
                    draggable={true}
                    >
                    <Controls />
                    <MiniMap/>
                    <Background color="#aaa" gap={16} />
                </ReactFlow>
                <DataLineageModal show={this.state.show}/>
            </ReactFlowProvider>
            
        )
    }
}

export class DataLineageModal extends Component {
    render() {
        return (
            <Modal
                show={this.props.show}
                >
                <Modal.Header closeButton>
                <   Modal.Title>Data Lineage Json Data</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    I will not close if you click outside me. Don't even try to press
                    escape key. 
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => this.setState({show: false})}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        )
    }
}

