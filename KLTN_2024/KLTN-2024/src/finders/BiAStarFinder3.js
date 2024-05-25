var Heap = require('heap');
var Util = require('../core/Util2');
var Heuristic = require('../core/Heuristic3');
var DiagonalMovement = require('../core/DiagonalMovement');

/**
 * ARA* path-finder.
 * @constructor
 * @param {Object} opt
 * @param {boolean} opt.allowDiagonal Whether diagonal movement is allowed.
 *     Deprecated, use diagonalMovement instead.
 * @param {boolean} opt.dontCrossCorners Disallow diagonal movement touching
 *     block corners. Deprecated, use diagonalMovement instead.
 * @param {DiagonalMovement} opt.diagonalMovement Allowed diagonal movement.
 * @param {function} opt.heuristic Heuristic function to estimate the distance
 *     (defaults to manhattan).
 * @param {number} opt.weight Weight to apply to the heuristic to allow for
 *     suboptimal paths, in order to speed up the search.
 */
function BiAStarFinder3(opt) {
    opt = opt || {};
    this.allowDiagonal = opt.allowDiagonal;
    this.dontCrossCorners = opt.dontCrossCorners;
    this.diagonalMovement = opt.diagonalMovement;
    this.heuristic = opt.heuristic || Heuristic.manhattan;
    this.weight = opt.weight || 1;

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

    // When diagonal movement is allowed, the Manhattan heuristic is not admissible.
    // It should be octile instead.
    if (this.diagonalMovement !== DiagonalMovement.Never) {
        this.heuristic = opt.heuristic || Heuristic.octile;
    }
}

/**
 * Find and return the path.
 * @return {Array<Array<number>>} The path, including both start and
 *     end positions.
 */
BiAStarFinder3.prototype.findPath = function(startX, startY, endX, endY, grid) {
    var cmp = function(nodeA, nodeB) {
            return nodeA.f - nodeB.f;
        },
        openList = new Heap(cmp),
        startNode = grid.getNodeAt(startX, startY),
        endNode = grid.getNodeAt(endX, endY),
        heuristic = this.heuristic,
        diagonalMovement = this.diagonalMovement,
        weight = this.weight,
        abs = Math.abs, SQRT2 = Math.SQRT2,
        node, neighbors, neighbor, i, l, x, y, ng;

    // Set the `g` and `f` value of the start node to be 0
    // and push it into the open list
    startNode.g = 0;
    startNode.f = 0;
    openList.push(startNode);

    // While the open list is not empty
    while (!openList.empty()) {
        // Pop the position of node which has the minimum `f` value.
        node = openList.pop();
        node.closed = true;

        // If reached the end position, construct the path and return it
        if (node === endNode) {
            return Util.backtrace(endNode);
        }

        // Get neighbors of the current node
        neighbors = grid.getNeighbors(node, diagonalMovement);
        for (i = 0, l = neighbors.length; i < l; ++i) {
            neighbor = neighbors[i];

            // Skip if the neighbor is already closed
            if (neighbor.closed) {
                continue;
            }

            x = neighbor.x;
            y = neighbor.y;

            // Calculate the next g score
            ng = node.g + ((x - node.x === 0 || y - node.y === 0) ? 1 : SQRT2);

            // Check if the neighbor has not been inspected yet, or
            // can be reached with smaller cost from the current node
            if (!neighbor.opened || ng < neighbor.g) {
                neighbor.g = ng;
                neighbor.h = neighbor.h || weight * heuristic(abs(x - endX), abs(y - endY));
                neighbor.f = neighbor.g + neighbor.h;
                neighbor.parent = node;

                if (!neighbor.opened) {
                    openList.push(neighbor);
                    neighbor.opened = true;
                } else {
                    // The neighbor can be reached with smaller cost.
                    // Since its f value has been updated, we have to
                    // update its position in the open list
                    openList.updateItem(neighbor);
                }
            }
        } // End for each neighbor
    } // End while not open list empty

    // Fail to find the path
    return [];
};

module.exports = BiAStarFinder3;
