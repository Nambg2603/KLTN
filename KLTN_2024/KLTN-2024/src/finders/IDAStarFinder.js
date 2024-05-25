var Heap       = require('heap');
var Util       = require('../core/Util3');
var Heuristic  = require('../core/Heuristic3');
var DiagonalMovement = require('../core/DiagonalMovement2');

function ADStarFinder(opt) {
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

    // Khởi tạo thuộc tính
    this.openList = new Heap(function(nodeA, nodeB) {
        return nodeA.key - nodeB.key; // So sánh các nút dựa trên giá trị key
    });
}

ADStarFinder.prototype.findPath = function(startX, startY, endX, endY, grid) {
    var startNode = grid.getNodeAt(startX, startY);
    var endNode = grid.getNodeAt(endX, endY);
    var heuristic = this.heuristic;
    var diagonalMovement = this.diagonalMovement;
    var weight = this.weight;
    var abs = Math.abs, SQRT2 = Math.SQRT2;

    startNode.g = 0;
    startNode.rhs = 0;
    this.openList.push(startNode);
    startNode.opened = true;

    while (!this.openList.empty()) {
        var node = this.openList.pop();
        node.closed = true;

        if (node === endNode) {
            return Util.backtrace(endNode);
        }

        var neighbors = grid.getNeighbors(node, diagonalMovement);
        for (var i = 0, l = neighbors.length; i < l; i++) {
            var neighbor = neighbors[i];
    
            if (neighbor.closed) {
                continue;
            }
    
            var x = neighbor.x;
            var y = neighbor.y;
    
            var ng = node.g + ((x - node.x === 0 || y - node.y === 0) ? 1 : SQRT2);
    
            if (!neighbor.opened || ng < neighbor.g) {
                neighbor.g = ng;
                neighbor.h = neighbor.h || weight * heuristic(abs(x - endX), abs(y - endY));
                neighbor.key = Math.min(neighbor.g, neighbor.rhs) + weight * heuristic(abs(x - endX), abs(y - endY));
                neighbor.parent = node;
    
                if (!neighbor.opened) {
                    this.openList.push(neighbor);
                    neighbor.opened = true;
                } else {
                    this.openList.updateItem(neighbor);
                }
            }
        }
    }

    return [];
};

module.exports = ADStarFinder;
