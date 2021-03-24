import { OverlayTrigger, Tooltip } from "react-bootstrap";
import React, {memo} from 'react';
import {Handle} from 'react-flow-renderer';

export const DataLineageGraphNode = memo(({data}) => {
    return (
        <OverlayTrigger
            overlay={
                <Tooltip id={`tooltip-${data.id}`}>
                    {data.comment}
                </Tooltip>
            }>
             <div style={{
                border: '2px solid blue',
                borderRadius: 6,
                padding: "18px 30px",
                minWidth: '180px'
                }}>
                <Handle
                    type="target"
                    position="left"
                />
                <div>
                    {data.label}
                </div>
                <Handle
                    type="source"
                    position="right"
                />
            </div>
        </OverlayTrigger>
           
    );
});

export const nodeTypes = {
    dataLineageGraphNode: DataLineageGraphNode,
};