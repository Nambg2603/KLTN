/**
 * A node in grid. 
 * This class holds some basic information about a node and custom 
 * attributes may be added, depending on the algorithms' needs.
 * @constructor
 * @param {number} x - The x coordinate of the node on the grid.
 * @param {number} y - The y coordinate of the node on the grid.
 * @param {boolean} [walkable] - Whether this node is walkable.
 */
function Node1(x, y, walkable) {
    /**
     * The x coordinate of the node on the grid.
     * @type number
     */
    this.x = x;
    /**
     * The y coordinate of the node on the grid.
     * @type number
     */
    this.y = y;
    /**
     * Whether this node can be walked through.
     * @type boolean
     */
    this.walkable = (walkable === undefined ? true : walkable);

    /**
     * The cost of moving from the start node to this node.
     * @type number
     */
    this.g = 0;

    /**
     * The cost of moving from the start node to this node along the best known path.
     * @type number
     */
    this.rhs = 0;

    /**
     * Whether this node is currently in the open list.
     * @type boolean
     */
    this.opened = false;

    /**
     * Whether this node is currently in the closed list.
     * @type boolean
     */
    this.closed = false;

    /**
     * The parent node which leads to this node on the current best path.
     * @type Node
     */
    this.parent = null;

    /**
     * The key value used in AD* algorithm.
     * @type number
     */
    this.key = 0;
}

module.exports = Node1;
