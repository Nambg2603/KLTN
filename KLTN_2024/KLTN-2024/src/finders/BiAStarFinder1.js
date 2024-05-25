const { BiAStarFinder1 } = require("../PathFinding");

/**
 * D* path-finder.
 * @constructor
 * @param {Object} opt Options.
 * @param {function} opt.heuristic Heuristic function (defaults to manhattan).
 * @param {number} opt.weight Heuristic weight.
 */
function BiAStarFinder1(opt) {
    opt = opt || {};
    this.heuristic = opt.heuristic || Heuristic.manhattan;
    this.weight = opt.weight || 1;
}

/**
 * Find and return the path.
 * @return {Array<Array<number>>} The path, including both start and end positions.
 */
BiAStarFinder1.prototype.findPath = function(startX, startY, endX, endY, grid) {
    var cmp = function(nodeA, nodeB) {
            return nodeA.f - nodeB.f;
        },
        openList = new Heap(cmp),
        startNode = grid.getNodeAt(startX, startY),
        endNode = grid.getNodeAt(endX, endY),
        heuristic = this.heuristic,
        weight = this.weight,
        abs = Math.abs, SQRT2 = Math.SQRT2,
        node, neighbors, neighbor, i, l, x, y, ng;

    // Initialize the start node
    startNode.g = 0;
    startNode.f = 0;
    openList.push(startNode);

    // While the open list is not empty
    while (!openList.empty()) {
        // Pop the node with the lowest f value from the open list
        node = openList.pop();
        node.closed = true;

        // If the node is the end node, reconstruct and return the path
        if (node === endNode) {
            return Util.backtrace(endNode);
        }

        // Get neighbors of the current node
        neighbors = grid.getNeighbors(node);
        for (i = 0, l = neighbors.length; i < l; ++i) {
            neighbor = neighbors[i];

            if (neighbor.closed) {
                continue;
            }

            x = neighbor.x;
            y = neighbor.y;

            // Get the distance between the current node and the neighbor
            // and calculate the next g score
            ng = node.g + ((x - node.x === 0 || y - node.y === 0) ? 1 : SQRT2);

            // If the neighbor has not been inspected yet, or
            // can be reached with smaller cost from the current node
            if (!neighbor.opened || ng < neighbor.g) {
                neighbor.g = ng;
                neighbor.h = weight * heuristic(abs(x - endX), abs(y - endY));
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

module.exports = BiAStarFinder1;
