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
function AStarFinder(opt) {
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
AStarFinder.prototype.findPath = function(startX, startY, endX, endY, grid) {
    // Khởi tạo một heap để lưu trữ nút mở
    var openList = new Heap(function(nodeA, nodeB) {
            return nodeA.f - nodeB.f;
        }),
        // Lấy nút bắt đầu và nút kết thúc từ lưới
        startNode = grid.getNodeAt(startX, startY),
        endNode = grid.getNodeAt(endX, endY),
        // Lấy các tham số từ đối tượng AStarFinder
        heuristic = this.heuristic,
        diagonalMovement = this.diagonalMovement,
        weight = this.weight,
        abs = Math.abs, SQRT2 = Math.SQRT2,
        node, neighbors, neighbor, i, l, x, y, ng;
    // Thiết lập giá trị `g` và `f` của nút bắt đầu là 0
    startNode.g = 0;
    startNode.f = 0;
    // bắt đầu 
    // Đẩy nút bắt đầu vào danh sách mở
    openList.push(startNode);
    startNode.opened = true;
    // Trong khi danh sách mở không trống
    while (!openList.empty()) {
        // Lấy nút có giá trị `f` nhỏ nhất từ danh sách mở
        node = openList.pop();
        node.closed = true;
        // Nếu đến vị trí kết thúc, tạo đường dẫn và trả về
        if (node === endNode) {
            return Util.backtrace(endNode);
        }
        // Lấy các hàng xóm của nút hiện tại
        neighbors = grid.getNeighbors(node, diagonalMovement);
        for (i = 0, l = neighbors.length; i < l; ++i) {
            neighbor = neighbors[i];
            // Nếu hàng xóm đã được đóng, bỏ qua
            if (neighbor.closed) {
                continue;
            }
            x = neighbor.x;
            y = neighbor.y;
            // Tính toán điểm g tiếp theo
            ng = node.g + ((x - node.x === 0 || y - node.y === 0) ? 1 : SQRT2);
            // Kiểm tra nếu hàng xóm chưa được kiểm tra, hoặc
            // có thể tiếp cận với chi phí nhỏ hơn từ nút hiện tại
            if (!neighbor.opened || ng < neighbor.g) {
                neighbor.g = ng;
                neighbor.h = neighbor.h || weight * heuristic(abs(x - endX), abs(y - endY));
                neighbor.f = neighbor.g + neighbor.h;
                neighbor.parent = node;

                if (!neighbor.opened) {
                    openList.push(neighbor);
                    neighbor.opened = true;
                } else {
                    // Hàng xóm có thể tiếp cận với chi phí nhỏ hơn.
                    // Cập nhật vị trí của nó trong danh sách mở
                    openList.updateItem(neighbor);
                }
            }
        }
    }
    // Không tìm thấy đường dẫn
    return [];
};

module.exports = AStarFinder;
