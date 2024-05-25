/**
 * @namespace DStarHeuristic
 * @description 
 */
module.exports = {

    /**
     * 
     * @param {Node} nodeX - Starting node.
     * @param {Node} nodeY - Destination node.
     * @return {number} Manhattan distance heuristic.
     */
    manhattan: function(nodeX, nodeY) {
        // Tính toán khoảng cách theo chiều ngang giữa hai nút
        var dx = Math.abs(nodeX.x - nodeY.x);
        // Tính toán khoảng cách theo chiều dọc giữa hai nút
        var dy = Math.abs(nodeX.y - nodeY.y);
        // Tổng hợp khoảng cách theo Manhattan và trả về
        return dx + dy;
    },
  
    /**
     * Chebyshev distance heuristic suitable for D* algorithm.
     * @param {Node} nodeX - Starting node.
     * @param {Node} nodeY - Destination node.
     * @return {number} Chebyshev distance heuristic.
     */
    chebyshev: function(nodeX, nodeY) {
        // Tính toán khoảng cách theo chiều ngang giữa hai nút
        var dx = Math.abs(nodeX.x - nodeY.x);
        // Tính toán khoảng cách theo chiều dọc giữa hai nút
        var dy = Math.abs(nodeX.y - nodeY.y);
        // Chọn khoảng cách lớn nhất giữa dx và dy và trả về
        return Math.max(dx, dy);
    }
  
};
