/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { memo } from 'react';
import { shallow } from 'zustand/shallow';
import { getNodePositionWithOrigin } from '@xyflow/system';

import { useStore } from '../../hooks/useStore';
import type { ReactFlowState } from '../../types';
import MiniMapNode from './MiniMapNode';
import type { MiniMapNodes, GetMiniMapNodeAttribute } from './types';

declare const window: any;

const selector = (s: ReactFlowState) => s.nodeOrigin;
const selectorNodes = (s: ReactFlowState) =>
  s.nodes.filter(
    (node) => !node.hidden && (node.computed?.width || node.width) && (node.computed?.height || node.height)
  );
const getAttrFunction = (func: any): GetMiniMapNodeAttribute => (func instanceof Function ? func : () => func);

function MiniMapNodes({
  nodeStrokeColor = 'transparent',
  nodeColor = '#e2e2e2',
  nodeClassName = '',
  nodeBorderRadius = 5,
  nodeStrokeWidth = 2,
  // We need to rename the prop to be `CapitalCase` so that JSX will render it as
  // a component properly.
  nodeComponent: NodeComponent = MiniMapNode,
  onClick,
}: MiniMapNodes) {
  const nodes = useStore(selectorNodes, shallow);
  const nodeOrigin = useStore(selector);
  const nodeColorFunc = getAttrFunction(nodeColor);
  const nodeStrokeColorFunc = getAttrFunction(nodeStrokeColor);
  const nodeClassNameFunc = getAttrFunction(nodeClassName);

  const shapeRendering = typeof window === 'undefined' || !!window.chrome ? 'crispEdges' : 'geometricPrecision';

  return (
    <>
      {nodes.map((node) => {
        const { x, y } = getNodePositionWithOrigin(node, node.origin || nodeOrigin).positionAbsolute;

        return (
          <NodeComponent
            key={node.id}
            x={x}
            y={y}
            width={node.computed?.width ?? node.width ?? 0}
            height={node.computed?.height ?? node.height ?? 0}
            style={node.style}
            selected={!!node.selected}
            className={nodeClassNameFunc(node)}
            color={nodeColorFunc(node)}
            borderRadius={nodeBorderRadius}
            strokeColor={nodeStrokeColorFunc(node)}
            strokeWidth={nodeStrokeWidth}
            shapeRendering={shapeRendering}
            onClick={onClick}
            id={node.id}
          />
        );
      })}
    </>
  );
}

export default memo(MiniMapNodes);
