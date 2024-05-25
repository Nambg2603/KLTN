var DiagonalMovement1 = {
    // Luôn cho phép di chuyển theo đường chéo
    Always: 1,

    // Không bao giờ cho phép di chuyển theo đường chéo
    Never: 2,

    // Cho phép di chuyển theo đường chéo nếu có tối đa một chướng ngại vật
    IfAtMostOneObstacle: 3,

    // Chỉ cho phép di chuyển theo đường chéo khi không có chướng ngại vật
    OnlyWhenNoObstacles: 4
};

module.exports = DiagonalMovement1;
