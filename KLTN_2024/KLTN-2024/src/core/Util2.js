/**
 * Truy vết theo dấu bố mẹ và trả về đường dẫn.
 * (bao gồm cả nút bắt đầu và nút kết thúc)
 * @param {Node} node Nút kết thúc
 * @return {Array<Array<number>>} Đường dẫn
 */
function backtrace(node) {
    var path = [[node.x, node.y]];
    while (node.parent) {
        node = node.parent;
        path.push([node.x, node.y]);
    }
    return path.reverse();
}
exports.backtrace = backtrace;

/**
 * Truy vết từ nút bắt đầu và nút kết thúc, và trả về đường dẫn.
 * (bao gồm cả nút bắt đầu và nút kết thúc)
 * @param {Node}
 * @param {Node}
 */
function biBacktrace(nodeA, nodeB) {
    var pathA = backtrace(nodeA),
        pathB = backtrace(nodeB);
    return pathA.concat(pathB.reverse());
}
exports.biBacktrace = biBacktrace;

/**
 * Tính độ dài của đường dẫn.
 * @param {Array<Array<number>>} path Đường dẫn
 * @return {number} Độ dài của đường dẫn
 */
function pathLength(path) {
    var i, sum = 0, a, b, dx, dy;
    for (i = 1; i < path.length; ++i) {
        a = path[i - 1];
        b = path[i];
        dx = a[0] - b[0];
        dy = a[1] - b[1];
        sum += Math.sqrt(dx * dx + dy * dy);
    }
    return sum;
}
exports.pathLength = pathLength;


/**
 * Cho các tọa độ bắt đầu và kết thúc, trả về tất cả các tọa độ nằm trên đường thẳng giữa chúng,
 * dựa trên thuật toán của Bresenham.
 * http://en.wikipedia.org/wiki/Bresenham's_line_algorithm#Simplification
 * @param {number} x0 Tọa độ x bắt đầu
 * @param {number} y0 Tọa độ y bắt đầu
 * @param {number} x1 Tọa độ x kết thúc
 * @param {number} y1 Tọa độ y kết thúc
 * @return {Array<Array<number>>} Các tọa độ trên đường thẳng
 */
function interpolate(x0, y0, x1, y1) {
    var abs = Math.abs,
        line = [],
        sx, sy, dx, dy, err, e2;

    dx = abs(x1 - x0);
    dy = abs(y1 - y0);

    sx = (x0 < x1) ? 1 : -1;
    sy = (y0 < y1) ? 1 : -1;

    err = dx - dy;

    while (true) {
        line.push([x0, y0]);

        if (x0 === x1 && y0 === y1) {
            break;
        }
        
        e2 = 2 * err;
        if (e2 > -dy) {
            err = err - dy;
            x0 = x0 + sx;
        }
        if (e2 < dx) {
            err = err + dx;
            y0 = y0 + sy;
        }
    }

    return line;
}
exports.interpolate = interpolate;


/**
 * Cho một đường dẫn đã được nén, trả về một đường dẫn mới mà tất cả các đoạn
 * trong đó được nối liền.
 * @param {Array<Array<number>>} path Đường dẫn
 * @return {Array<Array<number>>} Đường dẫn mở rộng
 */
function expandPath(path) {
    var expanded = [],
        len = path.length,
        coord0, coord1,
        interpolated,
        interpolatedLen,
        i, j;

    if (len < 2) {
        return expanded;
    }

    for (i = 0; i < len - 1; ++i) {
        coord0 = path[i];
        coord1 = path[i + 1];

        interpolated = interpolate(coord0[0], coord0[1], coord1[0], coord1[1]);
        interpolatedLen = interpolated.length;
        for (j = 0; j < interpolatedLen - 1; ++j) {
            expanded.push(interpolated[j]);
        }
    }
    expanded.push(path[len - 1]);

    return expanded;
}
exports.expandPath = expandPath;


/**
 * Làm mịn đường dẫn đã cho.
 * Đường dẫn gốc sẽ không được sửa đổi; một đường dẫn mới sẽ được trả về.
 * @param {PF.Grid} grid
 * @param {Array<Array<number>>} path Đường dẫn
 */
function smoothenPath(grid, path) {
    // Hàm này vẫn giữ nguyên vì nó không liên quan trực tiếp đến các thuộc tính của nút.
    var len = path.length,
        x0 = path[0][0],        // Tọa độ x của đầu đường dẫn
        y0 = path[0][1],        // Tọa độ y của đầu đường dẫn
        x1 = path[len - 1][0],  // Tọa độ x của cuối đường dẫn
        y1 = path[len - 1][1],  // Tọa độ y của cuối đường dẫn
        sx, sy,                 // Tọa độ bắt đầu hiện tại
        ex, ey,                 // Tọa độ kết thúc hiện tại
        newPath,
        i, j, coord, line, testCoord, blocked;

    sx = x0;
    sy = y0;
    newPath = [[sx, sy]];

    for (i = 2; i < len; ++i) {
        coord = path[i];
        ex = coord[0];
        ey = coord[1];
        line = interpolate(sx, sy, ex, ey);

        blocked = false;
        for (j = 1; j < line.length; ++j) {
            testCoord = line[j];

            if (!grid.isWalkableAt(testCoord[0], testCoord[1])) {
                blocked = true;
                break;
            }
        }
        if (blocked) {
            lastValidCoord = path[i - 1];
            newPath.push(lastValidCoord);
            sx = lastValidCoord[0];
            sy = lastValidCoord[1];
        }
    }
    newPath.push([x1, y1]);

    return newPath;
}
exports.smoothenPath = smoothenPath;


/**
 * Compress a path, remove redundant nodes without altering the shape
 * The original path is not modified
 * @param {Array<Array<number>>} path The path
 * @return {Array<Array<number>>} The compressed path
 */
function compressPath(path) {
    
    // nothing to compress
    if(path.length < 3) {
        return path;
    }

    var compressed = [],
        sx = path[0][0], // start x
        sy = path[0][1], // start y
        px = path[1][0], // second point x
        py = path[1][1], // second point y
        dx = px - sx, // direction between the two points
        dy = py - sy, // direction between the two points
        lx, ly,
        ldx, ldy,
        sq, i;

    // normalize the direction
    sq = Math.sqrt(dx*dx + dy*dy);
    dx /= sq;
    dy /= sq;

    // start the new path
    compressed.push([sx,sy]);

    for(i = 2; i < path.length; i++) {

        // store the last point
        lx = px;
        ly = py;

        // store the last direction
        ldx = dx;
        ldy = dy;

        // next point
        px = path[i][0];
        py = path[i][1];

        // next direction
        dx = px - lx;
        dy = py - ly;

        // normalize
        sq = Math.sqrt(dx*dx + dy*dy);
        dx /= sq;
        dy /= sq;

        // if the direction has changed, store the point
        if ( dx !== ldx || dy !== ldy ) {
            compressed.push([lx,ly]);
        }
    }

    // store the last point
    compressed.push([px,py]);
    return path;
}
    exports.compressPath = compressPath;