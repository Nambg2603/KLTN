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
    startNode.g = Infinity; // Khởi tạo g(sstart) là vô cùng
    startNode.rhs = 0; // Khởi tạo rhs(sstart) là 0
    this.openList.push(startNode);
    startNode.opened = true;

    var keyStart = function(node) {
        return Math.min(node.g, node.rhs) + weight 
        * heuristic(abs(node.x - startX), abs(node.y - startY));
    };
    var UpdateState = function(node) {
        if (node !== endNode) {
            var successors = grid.getNeighbors(node, diagonalMovement);
            var min_rhs = Infinity;
            for (var i = 0, l = successors.length; i < l; i++) {
                var successor = successors[i];
                var cost = node.g + ((successor.x - node.x === 0
                     || successor.y - node.y === 0) ? 1 : SQRT2);
                min_rhs = Math.min(min_rhs, cost);
            }
            node.rhs = min_rhs;
        }
        if (node.opened) {
            this.openList.remove(node);
            node.opened = false;
        }
        if (node.g !== node.rhs) {
            if (!node.closed) {
                var key = keyStart(node);
                this.openList.push(node);
                node.opened = true;
            } else {
                node.opened = false;
            }
        }
    }.bind(this);
    var ComputeorImprovePath = function() {
        while (!this.openList.empty() && (keyStart(this.openList.peek()) 
        < keyStart(startNode) || startNode.rhs !== startNode.g)) {
            var node = this.openList.pop();
            node.opened = false;

            if (node.g > node.rhs) {
                node.g = node.rhs;
            } else {
                node.g = Infinity;
                UpdateState(node);
            }

            var neighbors = grid.getNeighbors(node, diagonalMovement);
            for (var i = 0, l = neighbors.length; i < l; i++) {
                UpdateState(neighbors[i]);
            }
        }
    }.bind(this);
    ComputeorImprovePath();
    if (startNode.g === Infinity) return []; // Không tìm thấy đường đi
    return Util.backtrace(endNode);
};
module.exports = ADStarFinder;
