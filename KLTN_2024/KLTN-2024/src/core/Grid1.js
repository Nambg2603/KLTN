var Node = require('./Node1');
var DiagonalMovement = require('./DiagonalMovement');

function Grid1(width_or_matrix, height, matrix) {
    var width;

    if (typeof width_or_matrix !== 'object') {
        width = width_or_matrix;
    } else {
        height = width_or_matrix.length;
        width = width_or_matrix[0].length;
        matrix = width_or_matrix;
    }

    this.width = width;
    this.height = height;

    this.nodes = this._buildNodes(width, height, matrix);
}

Grid1.prototype._buildNodes = function(width, height, matrix) {
    var i, j,
        nodes = new Array(height);

    for (i = 0; i < height; ++i) {
        nodes[i] = new Array(width);
        for (j = 0; j < width; ++j) {
            nodes[i][j] = new Node(j, i);
            // Set initial key for each node
            nodes[i][j].key = Infinity;
        }
    }

    if (matrix === undefined) {
        return nodes;
    }

    if (matrix.length !== height || matrix[0].length !== width) {
        throw new Error('Matrix size does not fit');
    }

    for (i = 0; i < height; ++i) {
        for (j = 0; j < width; ++j) {
            if (matrix[i][j]) {
                nodes[i][j].walkable = false;
            }
        }
    }

    return nodes;
};

Grid1.prototype.getNodeAt = function(x, y) {
    return this.nodes[y][x];
};

Grid1.prototype.updateKey = function(node) {
    node.key = Math.min(node.g, node.rhs);
};

Grid1.prototype.getNeighbors = function(node, diagonalMovement) {
    // Existing code remains the same
};

Grid1.prototype.clone = function() {
    // Existing code remains the same
};

module.exports = Grid1;
