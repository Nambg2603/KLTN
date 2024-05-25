var Heap       = require('heap');
var Util       = require('../core/Util');
var Heuristic  = require('../core/Heuristic');
var DiagonalMovement = require('../core/DiagonalMovement');

/**
 * A* 
 * @constructor
 * @param {Object} opt
 * @param {boolean} opt.allowDiagonal Cho phép di chuyển theo đường chéo hay không.
 *     Lời khuyên: sử dụng diagonalMovement thay vì allowDiagonal.
 * @param {boolean} opt.dontCrossCorners Không cho phép di chuyển chéo chạm vào góc block.
 *     Lời khuyên: sử dụng diagonalMovement thay vì dontCrossCorners.
 * @param {DiagonalMovement} opt.diagonalMovement Loại di chuyển chéo được phép.
 * @param {function} opt.heuristic Hàm heuristic ước lượng khoảng cách
 *     (mặc định là manhattan).
 * @param {number} opt.weight Trọng số áp dụng cho heuristic để cho phép
 *     các đường dẫn không tối ưu, nhằm tăng tốc độ tìm kiếm.
 */
function ARAStarFinder(opt) {
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
/**
 * Tìm và trả về đường dẫn.
 * @return {Array<Array<number>>} Đường dẫn, bao gồm cả vị trí bắt đầu và
 *     kết thúc.
 */
ARAStarFinder.prototype.findPath = function(startX, startY, endX, endY, grid) {
    var openList = new Heap(function(nodeA, nodeB) {
            return nodeA.key - nodeB.key; // Sửa lại hàm so sánh cho heap
        }),
        startNode = grid.getNodeAt(startX, startY),
        endNode = grid.getNodeAt(endX, endY),
        heuristic = this.heuristic,
        diagonalMovement = this.diagonalMovement,
        weight = this.weight,
        abs = Math.abs, SQRT2 = Math.SQRT2,
        node, neighbors, neighbor, i, l, x, y, ng;

    startNode.g = Infinity; // Gán giá trị g ban đầu là vô cùng
    endNode.g = 0; // Gán giá trị g của nút kết thúc là 0
    var epsilon = 1; 
    var goalKey = epsilon * heuristic(abs(startX - endX), abs(startY - endY));
    // Thêm nút kết thúc vào danh sách mở với key tương ứng
    openList.push(endNode);
    endNode.opened = true;
    // Hàm ImprovePath
    var ImprovePath = function() {
        while (openList.peek().key < goalKey) {
            node = openList.pop();
            node.closed = true;
            if (node === startNode) continue;
            neighbors = grid.getNeighbors(node, diagonalMovement);
            for (i = 0, l = neighbors.length; i < l; ++i) {
                neighbor = neighbors[i];
                if (neighbor.closed) {
                    continue;
                }
                x = neighbor.x;
                y = neighbor.y;
                ng = node.g + ((x - node.x === 0 || y - node.y === 0) ? 1 : SQRT2);
                if (!neighbor.opened || ng < neighbor.g) {
                    neighbor.g = ng;
                    neighbor.h = weight * heuristic(abs(x - startX), abs(y - startY));
                    neighbor.key = neighbor.g + epsilon * neighbor.h; // Tính toán key mới
                    neighbor.parent = node;
                    if (!neighbor.opened) {
                        openList.push(neighbor);
                        neighbor.opened = true;
                    } else {
                        openList.updateItem(neighbor);
                    }
                }
            }
        }
    };
    // Hàm Main
    var Main = function() {
        var epsilon = 1; // Gán epsilon ban đầu
        var goalKey = epsilon * heuristic(abs(startX - endX), abs(startY - endY));
        openList.push(endNode);
        endNode.opened = true;
        ImprovePath();
        // Xuất kết quả đường đi
        var path = Util.backtrace(startNode);
        // Xuất kết quả đường đi ở đây
        while (epsilon > 1) {
            epsilon--;
            while (!openList.empty()) {
                openList.pop().opened = false;
            }
            ImprovePath();
            // Xuất kết quả đường đi
            path = Util.backtrace(startNode);
        }
        return path;
    };
    return Main(); 
};

module.exports = ARAStarFinder;
