var Heap = require('heap');
var Util = require('../core/Util1');
var Heuristic = require('../core/Heuristic1');
var DiagonalMovement = require('../core/DiagonalMovement1');

function DStarFinder(opt) {
    opt = opt || {};
    this.allowDiagonal = opt.allowDiagonal;
    this.dontCrossCorners = opt.dontCrossCorners;
    this.heuristic = opt.heuristic || Heuristic.manhattan;
    this.weight = opt.weight || 1;
    this.diagonalMovement = opt.diagonalMovement;

    if (!this.diagonalMovement) {
        if (!this.allowDiagonal) {
            this.diagonalMovement = DiagonalMovement.Never;
        } else {
            if (this.dontCrossCorners) {
                this.diagonalMovement = DiagonalMovement.OnlyWhenNoObstacles;
            } else {
                this.diagonalMovement = DiagonalMovement.IfAtMostOneObstacle;
            }
        }
    }

    // Khi di chuyển chéo được phép, heuristic manhattan không còn phù hợp.
    // Nó nên là octile thay vào đó
    if (this.diagonalMovement === DiagonalMovement.Never) {
        this.heuristic = opt.heuristic || Heuristic.manhattan;
    } else {
        this.heuristic = opt.heuristic || Heuristic.octile;
    }
}

DStarFinder.prototype.findPath = function(startX, startY, endX, endY, grid) {
    var openList = new Heap(function(nodeA, nodeB) {
            return nodeA.f - nodeB.f;
        }),
        startNode = grid.getNodeAt(startX, startY),
        endNode = grid.getNodeAt(endX, endY),
        heuristic = this.heuristic,
        diagonalMovement = this.diagonalMovement,
        weight = this.weight,
        abs = Math.abs, SQRT2 = Math.SQRT2,
        node, neighbors, neighbor, i, l, x, y, ng;

    // Initialize start node
    startNode.g = 0;
    startNode.rhs = 0;
    startNode.f = this.heuristic(startNode, endNode);

    openList.push(startNode);

    while (!openList.empty()) {
        node = openList.pop();

        if (node.closed) {
            continue;
        }

        if (node === endNode) {
            return Util.backtrace(endNode);
        }

        node.closed = true;

        neighbors = grid.getNeighbors(node, diagonalMovement);
        for (i = 0, l = neighbors.length; i < l; ++i) {
            neighbor = neighbors[i];

            if (neighbor.closed) {
                continue;
            }

            x = neighbor.x;
            y = neighbor.y;

            // Calculate new g value
            ng = node.g + grid.cost(node, neighbor);

            if (ng < neighbor.g) {
                neighbor.g = ng;
                neighbor.parent = node;
            }

            // Update rhs value
            if (neighbor !== endNode) {
                neighbor.rhs = Math.min(neighbor.rhs, ng + heuristic(neighbor, endNode));
            }

            if (neighbor.g < neighbor.rhs) {
                neighbor.f = neighbor.g + weight * heuristic(neighbor, endNode);

                if (!openList.has(neighbor)) {
                    openList.push(neighbor);
                } else {
                    openList.updateItem(neighbor);
                }
            }
        }
    }

    return [];
};

module.exports = DStarFinder;
