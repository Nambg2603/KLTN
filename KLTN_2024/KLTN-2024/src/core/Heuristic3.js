module.exports = {

    manhattan: function(nodeX, nodeY, h) {
        var dx = Math.abs(nodeX.x - nodeY.x);
        var dy = Math.abs(nodeX.y - nodeY.y);
        return Math.min(nodeX.g, nodeX.rhs) + h(nodeX, nodeY);
    },
  
    euclidean: function(nodeX, nodeY, h) {
        var dx = Math.abs(nodeX.x - nodeY.x);
        var dy = Math.abs(nodeX.y - nodeY.y);
        return Math.min(nodeX.g, nodeX.rhs) + h(nodeX, nodeY);
    },
  
    octile: function(nodeX, nodeY, h) {
        var F = Math.SQRT2 - 1;
        var dx = Math.abs(nodeX.x - nodeY.x);
        var dy = Math.abs(nodeX.y - nodeY.y);
        return Math.min(nodeX.g, nodeX.rhs) + ((dx < dy) ? F * dx + dy : F * dy + dx);
    },
  
    chebyshev: function(nodeX, nodeY, h) {
        var dx = Math.abs(nodeX.x - nodeY.x);
        var dy = Math.abs(nodeX.y - nodeY.y);
        return Math.min(nodeX.g, nodeX.rhs) + Math.max(dx, dy);
    }
  
};
