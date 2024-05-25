/**
 * @namespace PF.Heuristic
 * @description A collection of heuristic functions suitable for ARA* algorithm.
 */
module.exports = {

    /**
     * Manhattan distance heuristic suitable for ARA* algorithm.
     * @param {Node} nodeX - Starting node.
     * @param {Node} nodeY - Destination node.
     * @return {number} Manhattan distance heuristic.
     */
    manhattan: function(nodeX, nodeY) {
        var dx = Math.abs(nodeX.x - nodeY.x);
        var dy = Math.abs(nodeX.y - nodeY.y);
        return dx + dy;
    },
  
    /**
     * Euclidean distance heuristic suitable for ARA* algorithm.
     * @param {Node} nodeX - Starting node.
     * @param {Node} nodeY - Destination node.
     * @return {number} Euclidean distance heuristic.
     */
    euclidean: function(nodeX, nodeY) {
        var dx = Math.abs(nodeX.x - nodeY.x);
        var dy = Math.abs(nodeX.y - nodeY.y);
        return Math.sqrt(dx * dx + dy * dy);
    },
  
    /**
     * Octile distance heuristic suitable for ARA* algorithm.
     * @param {Node} nodeX - Starting node.
     * @param {Node} nodeY - Destination node.
     * @return {number} Octile distance heuristic.
     */
    octile: function(nodeX, nodeY) {
        var F = Math.SQRT2 - 1;
        var dx = Math.abs(nodeX.x - nodeY.x);
        var dy = Math.abs(nodeX.y - nodeY.y);
        return (dx < dy) ? F * dx + dy : F * dy + dx;
    },
  
    /**
     * Chebyshev distance heuristic suitable for ARA* algorithm.
     * @param {Node} nodeX - Starting node.
     * @param {Node} nodeY - Destination node.
     * @return {number} Chebyshev distance heuristic.
     */
    chebyshev: function(nodeX, nodeY) {
        var dx = Math.abs(nodeX.x - nodeY.x);
        var dy = Math.abs(nodeX.y - nodeY.y);
        return Math.max(dx, dy);
    }
  
  };
  