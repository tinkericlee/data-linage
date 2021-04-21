import { Button, Col, Form, Modal, Row } from 'react-bootstrap';
import React, { Component } from 'react';
import ReactFlow, {
    ReactFlowProvider,
    removeElements,
    addEdge,
    MiniMap,
    Controls,
    Background,
} from 'react-flow-renderer';
import { DataLineageGraphNode, nodeTypes } from './GraphNodeTypes';
import { data } from 'jquery';

export default class DataLineageGraph extends Component {

    constructor(props, context) {
        super(props, context)
        this.state = {
            nodes: [],
            nodeDetailsVisible: false,
            selectedNode: {
                data: {}
            }
        }
        this.id = -1;
        this.label = "label"
        this.comment = "comment"
    }

    onLoad = (reactFlowInstance) => {
        console.log('flow loaded:', reactFlowInstance);
        reactFlowInstance.fitView();
    };

    onElementsRemove = (elementsToRemove) =>
        this.setState({ nodes: removeElements(elementsToRemove, this.state.nodes) });
    onConnect = (params) => this.setState({ nodes: addEdge(Object.assign({label: "label", data: { comment: "Comment" } }, params), this.state.nodes) });

    onAdd = () => {
        var maxId = 0
        this.state.nodes.forEach(n => { maxId = parseInt(n.id) > maxId ? parseInt(n.id) : maxId })
        const newNode = {
            id: maxId + 1 + '',
            data: { id: maxId + 1 + '', label: 'New Node', comment: 'Comment', notInUse: false },
            type: 'dataLineageGraphNode',
            position: {
                x: 100,
                y: 100,
            },
        };
        this.setState({ nodes: this.state.nodes.concat(newNode) })
    }

    onSelect = (event, element) => {
        console.log(element)
        this.setState({ selectedNode: element, nodeDetailsVisible: true })
    }

    onNodeDragStop = (event, node) => {
        let newNodes = this.removeItemById(this.state.nodes, node.id).concat(node)
        this.setState({ nodes: newNodes })
    }

    onSubmit = (e) => {
        e.preventDefault()
        const formData = new FormData(e.target)
        const formDataObj = Object.fromEntries(formData.entries())
        console.log(formDataObj)

        if (formDataObj.id) {
            let newNodes = this.removeItemById(this.state.nodes, this.state.selectedNode.id).concat(
                Object.assign(this.state.selectedNode,
                    this.state.selectedNode.source ?
                        {
                            label: formDataObj.label,
                            data: {
                                comment: formDataObj.comment,
                                notInUse: formDataObj.notInUse ? "on" : "off"
                            }
                        } :
                        {
                            data: {
                                label: formDataObj.label,
                                comment: formDataObj.comment,
                                notInUse: formDataObj.notInUse ? "on" : "off"
                            },
                            type: formDataObj.notInUse == "on" ? 'notUsedDataLineageGraphNode' : 'dataLineageGraphNode'
                        })
            )

            this.setState({ nodes: newNodes, nodeDetailsVisible: false })
        }
    }


    removeItemById(arr, id) {
        var i = 0;
        while (i < arr.length) {
            if (arr[i].id === id) {
                arr.splice(i, 1);
            } else {
                ++i;
            }
        }
        return arr;
    }

    getItemById(arr, id) {
        var i = 0;
        while (i < arr.length) {
            if (arr[i].id === id) {
                return arr[i]
            } 
            ++i;
        }
        return undefined;
    }

    onNodeJsonUpdate = (e) => {
        e.preventDefault()
        const formData = new FormData(e.target)
        const formDataObj = Object.fromEntries(formData.entries())

        this.setState({ nodes: JSON.parse(formDataObj.nodeJson), show: false })
    }

    render() {
        return (
            <div style={{ width: '100%', height: '100%', display: 'flex' }}>
                <Modal
                    show={this.state.show}
                    size={'lg'}
                    scrollable={true}
                    style={{ width: '100%' }}
                    keyboard={true}
                >
                    <Modal.Header>
                        <Modal.Title>Data Lineage Json Data</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={this.onNodeJsonUpdate}>
                            <Form.Group controlId="nodeJson">
                                <Form.Label>Comment</Form.Label>
                                <Form.Control name="nodeJson" rows={15} as="textarea" defaultValue={JSON.stringify(this.state.nodes)} />
                            </Form.Group>
                            <Button variant="primary" type="submit">
                                Submit
                        </Button>
                            <Button style={{ 'marginLeft': 30 }} onClick={() => this.setState({ show: false })}>
                                Close
                        </Button>
                        </Form>
                    </Modal.Body>
                </Modal>
                <Modal
                    show={this.state.nodeDetailsVisible}
                    size={'lg'}
                    scrollable={true}
                    style={{ width: '100%' }}
                    keyboard={true}
                >
                    <Modal.Header>
                        <Modal.Title>Data Lineage Json Data</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={this.onSubmit}>
                            <Form.Group controlId="title">
                                <Form.Label>Type: {this.state.selectedNode.source ? 'Edge' : 'Table'}</Form.Label>
                            </Form.Group>
                            <Form.Group as={Row} controlId="Id">
                                <Form.Label column sm={2}>Id</Form.Label>
                                <Col sm={10}>
                                    <Form.Control name="id" type="text" readOnly defaultValue={this.state.selectedNode.id} />
                                </Col>
                            </Form.Group>
                            
                            <Form.Group as={Row} controlId="notInUse">
                                <Form.Label column sm={2}>Not in use</Form.Label>
                                <Col sm={10}>
                                    <Form.Check custom name="notInUse" type="checkbox" defaultChecked={this.state.selectedNode.data.notInUse == "on"} />
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} controlId="label">
                                <Form.Label column sm={2}>Label</Form.Label>
                                <Col sm={10}>
                                    <Form.Control name="label" type="text" defaultValue={this.getItemById(this.state.nodes, this.state.selectedNode.id)? this.state.selectedNode.source ? this.getItemById(this.state.nodes, this.state.selectedNode.id).label : this.state.selectedNode.data.label : undefined}/>
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} controlId="comment">
                                <Form.Label column sm={2}>Comment</Form.Label>
                                <Col sm={10}>
                                    <Form.Control name="comment" rows={10} as="textarea" defaultValue={ this.state.selectedNode.data.comment} />
                                </Col>
                            </Form.Group>
                            <Button variant="primary" type="submit">
                                Submit
                        </Button>
                        <Button style={{ 'marginLeft': 30 }} onClick={() => this.setState({ nodeDetailsVisible: false })}>
                                Close
                        </Button>
                        </Form>
                    </Modal.Body>
                </Modal>

                <div style={{ width: '100%', height: '90%' }}>
                    <div>
                        <Button onClick={this.onAdd}>add table</Button>

                        <Button style={{ 'marginLeft': 30 }} onClick={() => this.setState({ show: true })}>show json</Button>

                        <Button style={{ 'marginLeft': 30 }} onClick={() => navigator.clipboard.writeText(JSON.stringify(this.state.nodes))}>copy json</Button>
                    </div>
                    <ReactFlowProvider>
                        <ReactFlow
                            style={{ width: '100%', height: '100%' }}
                            elements={this.state.nodes}
                            onElementsRemove={this.onElementsRemove}
                            onConnect={this.onConnect}
                            nodeTypes={nodeTypes}
                            onElementClick={this.onSelect}
                            onNodeDragStop={this.onNodeDragStop}
                        >
                            <Controls />
                            <MiniMap />
                            <Background />
                        </ReactFlow>
                    </ReactFlowProvider>
                </div>
            </div>


        )
    }
}

