/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.GameBoard = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _EmptyBlock = __webpack_require__(2);

var _Figure = __webpack_require__(3);

var _localStorage = __webpack_require__(4);

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var GAME_BOARD_SIZE = 550,
    MIN_SPEED = 1000,
    SPEED_REDUCTION = 500;

var blocksOnPage = void 0,
    currentScore = void 0,
    currentSpeed = void 0,
    elementsOnBoard = void 0,
    intervalID = void 0,
    gameFinishedFlag = void 0,
    numberOfBlocks = void 0;

function checkInputValue() {
    var value = +document.querySelector('#number').value;

    return value >= 9 && value <= 15 ? value : 9;
}

function setInitValues() {
    blocksOnPage = [];
    currentSpeed = 2500;
    currentScore = parseInt(_localStorage.LocalStorageService.getFromStorage().get('currentScore')) || 0;
    elementsOnBoard = [];
    gameFinishedFlag = false;
    numberOfBlocks = checkInputValue();
    _EmptyBlock.EmptyBlock.setWidth((GAME_BOARD_SIZE / numberOfBlocks).toFixed(1) + 'px');
}

var GameBoard = exports.GameBoard = function () {
    function GameBoard() {
        _classCallCheck(this, GameBoard);

        this.gameBoard;
        this.scoreElement = document.getElementById('score');
        this.updateScoreElement();
        setInitValues();
        this.drawGameBoard();
        this.startGame();
    }

    _createClass(GameBoard, [{
        key: 'addNewElement',
        value: function addNewElement() {
            var newElem = new _Figure.Figure(),
                pointsXOfNewElem = newElem.block.map(function (item) {
                return item[1];
            }),
                middle = this.middle - Math.floor(Math.max.apply(Math, _toConsumableArray(pointsXOfNewElem)) / 2);

            newElem.block = newElem.block.map(function (item) {
                return [item[0], item[1] + middle];
            });

            if (newElem.canAddToBoard()) {
                elementsOnBoard.push(newElem);
            } else {
                document.removeEventListener('keydown', this.executeKeyDownAction);
                this.finishGame();
            }
            newElem.drawElementOnBoard(newElem.index);
        }
    }, {
        key: 'checkScore',
        value: function checkScore() {
            var _this = this;

            var _loop = function _loop(i) {
                if (!blocksOnPage[i].map(function (item) {
                    return item.box.className;
                }).includes('block-empty')) {
                    _this.levelup();
                    elementsOnBoard.forEach(function (item) {
                        return item.redrawElement(function () {
                            return item.block = item.block.filter(function (elem) {
                                return elem[0] !== i;
                            });
                        });
                    });
                }
            };

            for (var i = 0; i < blocksOnPage.length; ++i) {
                _loop(i);
            }

            elementsOnBoard = elementsOnBoard.filter(function (elem) {
                return elem.block.length !== 0;
            });
        }
    }, {
        key: 'drawGameBoard',
        value: function drawGameBoard() {
            this.gameBoard = document.createElement('div');
            this.gameBoard.className = 'game';
            document.body.appendChild(this.gameBoard);

            for (var i = 0; i < numberOfBlocks; ++i) {
                blocksOnPage.push([]);
                for (var j = 0; j < numberOfBlocks; ++j) {
                    blocksOnPage[i][j] = new _EmptyBlock.EmptyBlock(GAME_BOARD_SIZE, numberOfBlocks);
                    this.gameBoard.appendChild(blocksOnPage[i][j].box);
                }
            }
        }
    }, {
        key: 'executeKeyDownAction',
        value: function executeKeyDownAction(event) {
            var shift = void 0,
                element = elementsOnBoard[elementsOnBoard.length - 1];

            switch (event.keyCode) {
                case 37:
                    shift = -1;
                    break;
                case 39:
                    shift = 1;
                    break;
                default:
                    shift = undefined;
            }

            if (shift && element.canMoveElement([0, shift])) {
                element.moveBlock(1, shift);
            }
        }
    }, {
        key: 'finishGame',
        value: function finishGame() {
            _localStorage.LocalStorageService.updateStorage();
            gameFinishedFlag = true;
            clearInterval(intervalID);
        }
    }, {
        key: 'levelup',
        value: function levelup() {
            currentScore += numberOfBlocks;
            _localStorage.LocalStorageService.addValueToStorage('currentScore', currentScore);
            this.updateScoreElement();

            currentSpeed = currentSpeed === MIN_SPEED ? currentSpeed : currentSpeed - SPEED_REDUCTION;
        }
    }, {
        key: 'startGame',
        value: function startGame() {
            var _this2 = this;

            clearInterval(intervalID);
            this.addNewElement();
            intervalID = setInterval(function () {
                elementsOnBoard.forEach(function (item, index) {
                    if (item.canMoveElement([1, 0])) {
                        item.moveBlock(0, 1);
                    } else {
                        if (index === elementsOnBoard.length - 1) {
                            _this2.checkScore();
                            if (!gameFinishedFlag) {
                                _this2.addNewElement();
                            }
                        }
                    }
                });
            }, currentSpeed);
        }
    }, {
        key: 'updateScoreElement',
        value: function updateScoreElement() {
            this.scoreElement.innerText = currentScore || 0;
        }
    }, {
        key: 'middle',
        get: function get() {
            return Math.floor(numberOfBlocks / 2);
        }
    }], [{
        key: 'drawBlock',
        value: function drawBlock(block, index) {
            blocksOnPage[block[0]][block[1]].changeBlockStyle(index);
        }
    }, {
        key: 'tryAddBlock',
        value: function tryAddBlock(block) {
            try {
                return blocksOnPage[block[0]][block[1]].isEmpty();
            } catch (err) {
                return false;
            }
        }
    }]);

    return GameBoard;
}();

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _GameBoard = __webpack_require__(0);

document.querySelector('#start').addEventListener('click', init);

var board = void 0;

function init() {
    if (board) {
        document.body.removeChild(board.gameBoard);
    }

    board = new _GameBoard.GameBoard();

    document.addEventListener('keydown', board.executeKeyDownAction);
}

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var width = void 0;

var EmptyBlock = exports.EmptyBlock = function () {
    function EmptyBlock() {
        _classCallCheck(this, EmptyBlock);

        this.box = document.createElement('div');
        this.box.className = 'block-empty';
        this.box.style.width = this.box.style.height = width;
    }

    _createClass(EmptyBlock, [{
        key: 'changeBlockStyle',
        value: function changeBlockStyle(styleBlock) {
            var elClass = void 0,
                color = void 0;

            switch (styleBlock) {
                case 0:
                    elClass = 'block-i';color = '#81F7F3';break;
                case 1:
                    elClass = 'block-j';color = '#8181F7';break;
                case 2:
                    elClass = 'block-l';color = '#FE9A2E';break;
                case 3:
                    elClass = 'block-o';color = '#F3F781';break;
                case 4:
                    elClass = 'block-s';color = '#81F781';break;
                case 5:
                    elClass = 'block-t';color = '#DA81F5';break;
                case 6:
                    elClass = 'block-z';color = '#F78181';break;
                default:
                    elClass = 'block-empty';color = '#D8D8D8';
            }

            this.box.className = elClass;
            this.box.style.backgroundColor = color;
        }
    }, {
        key: 'isEmpty',
        value: function isEmpty() {
            return this.box.className === 'block-empty';
        }
    }], [{
        key: 'setWidth',
        value: function setWidth(value) {
            width = value;
        }
    }]);

    return EmptyBlock;
}();

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Figure = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _GameBoard = __webpack_require__(0);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BLOCKS = [[[0, 0], [0, 1], [0, 2], [0, 3]], [[0, 0], [0, 1], [0, 2], [1, 2]], [[0, 0], [0, 1], [0, 2], [1, 0]], [[0, 0], [0, 1], [1, 0], [1, 1]], [[0, 1], [0, 2], [1, 0], [1, 1]], [[0, 0], [0, 1], [0, 2], [1, 1]], [[0, 0], [0, 1], [1, 1], [1, 2]]];

var Figure = exports.Figure = function () {
    function Figure() {
        _classCallCheck(this, Figure);

        this.index = Math.floor(Math.random() * 7), this.block = BLOCKS[this.index];
    }

    _createClass(Figure, [{
        key: 'canAddToBoard',
        value: function canAddToBoard() {
            var canAdd = true;

            this.block.forEach(function (item) {
                return canAdd = canAdd && _GameBoard.GameBoard.tryAddBlock(item);
            });

            return canAdd;
        }
    }, {
        key: 'canMoveElement',
        value: function canMoveElement(shift) {
            var _this = this;

            var perhabsNewPosition = this.block.map(function (item) {
                return [item[0] + shift[0], item[1] + shift[1]];
            }),
                canMove = true;

            perhabsNewPosition.forEach(function (item) {
                if (!_this.block.map(function (item) {
                    return item.toString();
                }).includes(item.toString())) {
                    canMove = canMove && _GameBoard.GameBoard.tryAddBlock(item);
                }
            });

            return canMove;
        }
    }, {
        key: 'drawElementOnBoard',
        value: function drawElementOnBoard(colorIndex) {
            this.block.map(function (item) {
                return _GameBoard.GameBoard.drawBlock(item, colorIndex);
            });
        }
    }, {
        key: 'moveBlock',
        value: function moveBlock(position, shift) {
            var _this2 = this;

            this.redrawElement(function () {
                return _this2.block.map(function (item) {
                    return item[position] += shift;
                });
            });
        }
    }, {
        key: 'redrawElement',
        value: function redrawElement(filteredBlock) {
            this.drawElementOnBoard();
            filteredBlock();
            this.drawElementOnBoard(this.index);
        }
    }]);

    return Figure;
}();

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var map = void 0;

var LocalStorageService = exports.LocalStorageService = function () {
    function LocalStorageService() {
        _classCallCheck(this, LocalStorageService);
    }

    _createClass(LocalStorageService, null, [{
        key: "addValueToStorage",
        value: function addValueToStorage(name, score) {
            if (!map.has(name) || map.has(name) && map.get(name) < score) {
                map.set(name, score);
            }
        }
    }, {
        key: "getFromStorage",
        value: function getFromStorage() {
            map = new Map();
            if (localStorage.length !== 0) {
                for (var i = 0; i < localStorage.length; ++i) {
                    map.set(localStorage.key(i), localStorage.getItem(localStorage.key(i)));
                }

                localStorage.clear();
            }

            return map;
        }
    }, {
        key: "updateStorage",
        value: function updateStorage() {
            map.forEach(function (value, key) {
                localStorage.setItem(key, value);
            });
        }
    }]);

    return LocalStorageService;
}();

/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgYmYyNmQ1OTVjYzNjNmM2Y2ZmNjMiLCJ3ZWJwYWNrOi8vLy4vc2NyaXB0cy9HYW1lQm9hcmQuY2xhc3MuanMiLCJ3ZWJwYWNrOi8vLy4vc2NyaXB0cy9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9zY3JpcHRzL0VtcHR5QmxvY2suY2xhc3MuanMiLCJ3ZWJwYWNrOi8vLy4vc2NyaXB0cy9GaWd1cmUuY2xhc3MuanMiLCJ3ZWJwYWNrOi8vLy4vc2NyaXB0cy9sb2NhbFN0b3JhZ2UuanMiXSwibmFtZXMiOlsiR0FNRV9CT0FSRF9TSVpFIiwiTUlOX1NQRUVEIiwiU1BFRURfUkVEVUNUSU9OIiwiYmxvY2tzT25QYWdlIiwiY3VycmVudFNjb3JlIiwiY3VycmVudFNwZWVkIiwiZWxlbWVudHNPbkJvYXJkIiwiaW50ZXJ2YWxJRCIsImdhbWVGaW5pc2hlZEZsYWciLCJudW1iZXJPZkJsb2NrcyIsImNoZWNrSW5wdXRWYWx1ZSIsInZhbHVlIiwiZG9jdW1lbnQiLCJxdWVyeVNlbGVjdG9yIiwic2V0SW5pdFZhbHVlcyIsInBhcnNlSW50IiwiZ2V0RnJvbVN0b3JhZ2UiLCJnZXQiLCJzZXRXaWR0aCIsInRvRml4ZWQiLCJHYW1lQm9hcmQiLCJnYW1lQm9hcmQiLCJzY29yZUVsZW1lbnQiLCJnZXRFbGVtZW50QnlJZCIsInVwZGF0ZVNjb3JlRWxlbWVudCIsImRyYXdHYW1lQm9hcmQiLCJzdGFydEdhbWUiLCJuZXdFbGVtIiwicG9pbnRzWE9mTmV3RWxlbSIsImJsb2NrIiwibWFwIiwiaXRlbSIsIm1pZGRsZSIsIk1hdGgiLCJmbG9vciIsIm1heCIsImNhbkFkZFRvQm9hcmQiLCJwdXNoIiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsImV4ZWN1dGVLZXlEb3duQWN0aW9uIiwiZmluaXNoR2FtZSIsImRyYXdFbGVtZW50T25Cb2FyZCIsImluZGV4IiwiaSIsImJveCIsImNsYXNzTmFtZSIsImluY2x1ZGVzIiwibGV2ZWx1cCIsImZvckVhY2giLCJyZWRyYXdFbGVtZW50IiwiZmlsdGVyIiwiZWxlbSIsImxlbmd0aCIsImNyZWF0ZUVsZW1lbnQiLCJib2R5IiwiYXBwZW5kQ2hpbGQiLCJqIiwiZXZlbnQiLCJzaGlmdCIsImVsZW1lbnQiLCJrZXlDb2RlIiwidW5kZWZpbmVkIiwiY2FuTW92ZUVsZW1lbnQiLCJtb3ZlQmxvY2siLCJ1cGRhdGVTdG9yYWdlIiwiY2xlYXJJbnRlcnZhbCIsImFkZFZhbHVlVG9TdG9yYWdlIiwiYWRkTmV3RWxlbWVudCIsInNldEludGVydmFsIiwiY2hlY2tTY29yZSIsImlubmVyVGV4dCIsImNoYW5nZUJsb2NrU3R5bGUiLCJpc0VtcHR5IiwiZXJyIiwiYWRkRXZlbnRMaXN0ZW5lciIsImluaXQiLCJib2FyZCIsInJlbW92ZUNoaWxkIiwid2lkdGgiLCJFbXB0eUJsb2NrIiwic3R5bGUiLCJoZWlnaHQiLCJzdHlsZUJsb2NrIiwiZWxDbGFzcyIsImNvbG9yIiwiYmFja2dyb3VuZENvbG9yIiwiQkxPQ0tTIiwiRmlndXJlIiwicmFuZG9tIiwiY2FuQWRkIiwidHJ5QWRkQmxvY2siLCJwZXJoYWJzTmV3UG9zaXRpb24iLCJjYW5Nb3ZlIiwidG9TdHJpbmciLCJjb2xvckluZGV4IiwiZHJhd0Jsb2NrIiwicG9zaXRpb24iLCJmaWx0ZXJlZEJsb2NrIiwiTG9jYWxTdG9yYWdlU2VydmljZSIsIm5hbWUiLCJzY29yZSIsImhhcyIsInNldCIsIk1hcCIsImxvY2FsU3RvcmFnZSIsImtleSIsImdldEl0ZW0iLCJjbGVhciIsInNldEl0ZW0iXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7QUM3REE7O0FBQ0E7O0FBQ0E7Ozs7OztBQUVBLElBQU1BLGtCQUFrQixHQUF4QjtBQUFBLElBQ0lDLFlBQVksSUFEaEI7QUFBQSxJQUVJQyxrQkFBa0IsR0FGdEI7O0FBSUEsSUFBSUMscUJBQUo7QUFBQSxJQUNJQyxxQkFESjtBQUFBLElBRUlDLHFCQUZKO0FBQUEsSUFHSUMsd0JBSEo7QUFBQSxJQUlJQyxtQkFKSjtBQUFBLElBS0lDLHlCQUxKO0FBQUEsSUFNSUMsdUJBTko7O0FBUUEsU0FBU0MsZUFBVCxHQUEyQjtBQUN2QixRQUFJQyxRQUFRLENBQUNDLFNBQVNDLGFBQVQsQ0FBdUIsU0FBdkIsRUFBa0NGLEtBQS9DOztBQUVBLFdBQU9BLFNBQVMsQ0FBVCxJQUFjQSxTQUFTLEVBQXZCLEdBQTRCQSxLQUE1QixHQUFvQyxDQUEzQztBQUNIOztBQUVELFNBQVNHLGFBQVQsR0FBeUI7QUFDckJYLG1CQUFlLEVBQWY7QUFDQUUsbUJBQWUsSUFBZjtBQUNBRCxtQkFBZVcsU0FBUyxrQ0FBb0JDLGNBQXBCLEdBQXFDQyxHQUFyQyxDQUF5QyxjQUF6QyxDQUFULEtBQXNFLENBQXJGO0FBQ0FYLHNCQUFrQixFQUFsQjtBQUNBRSx1QkFBbUIsS0FBbkI7QUFDQUMscUJBQWlCQyxpQkFBakI7QUFDQSwyQkFBV1EsUUFBWCxDQUFvQixDQUFDbEIsa0JBQWtCUyxjQUFuQixFQUFtQ1UsT0FBbkMsQ0FBMkMsQ0FBM0MsSUFBZ0QsSUFBcEU7QUFDSDs7SUFFWUMsUyxXQUFBQSxTO0FBQ1QseUJBQWM7QUFBQTs7QUFDVixhQUFLQyxTQUFMO0FBQ0EsYUFBS0MsWUFBTCxHQUFvQlYsU0FBU1csY0FBVCxDQUF3QixPQUF4QixDQUFwQjtBQUNBLGFBQUtDLGtCQUFMO0FBQ0FWO0FBQ0EsYUFBS1csYUFBTDtBQUNBLGFBQUtDLFNBQUw7QUFDSDs7Ozt3Q0FNZTtBQUNaLGdCQUFJQyxVQUFVLG9CQUFkO0FBQUEsZ0JBQ0lDLG1CQUFtQkQsUUFBUUUsS0FBUixDQUFjQyxHQUFkLENBQWtCO0FBQUEsdUJBQVFDLEtBQUssQ0FBTCxDQUFSO0FBQUEsYUFBbEIsQ0FEdkI7QUFBQSxnQkFFSUMsU0FBUyxLQUFLQSxNQUFMLEdBQWNDLEtBQUtDLEtBQUwsQ0FBV0QsS0FBS0UsR0FBTCxnQ0FBWVAsZ0JBQVosS0FBZ0MsQ0FBM0MsQ0FGM0I7O0FBSUFELG9CQUFRRSxLQUFSLEdBQWdCRixRQUFRRSxLQUFSLENBQWNDLEdBQWQsQ0FBa0I7QUFBQSx1QkFBUSxDQUFDQyxLQUFLLENBQUwsQ0FBRCxFQUFVQSxLQUFLLENBQUwsSUFBVUMsTUFBcEIsQ0FBUjtBQUFBLGFBQWxCLENBQWhCOztBQUVBLGdCQUFJTCxRQUFRUyxhQUFSLEVBQUosRUFBNkI7QUFDekI5QixnQ0FBZ0IrQixJQUFoQixDQUFxQlYsT0FBckI7QUFDSCxhQUZELE1BRU87QUFDSGYseUJBQVMwQixtQkFBVCxDQUE2QixTQUE3QixFQUF3QyxLQUFLQyxvQkFBN0M7QUFDQSxxQkFBS0MsVUFBTDtBQUNIO0FBQ0RiLG9CQUFRYyxrQkFBUixDQUEyQmQsUUFBUWUsS0FBbkM7QUFDSDs7O3FDQUVZO0FBQUE7O0FBQUEsdUNBQ0FDLENBREE7QUFFTCxvQkFBRyxDQUFDeEMsYUFBYXdDLENBQWIsRUFBZ0JiLEdBQWhCLENBQW9CO0FBQUEsMkJBQVFDLEtBQUthLEdBQUwsQ0FBU0MsU0FBakI7QUFBQSxpQkFBcEIsRUFBZ0RDLFFBQWhELENBQXlELGFBQXpELENBQUosRUFBNkU7QUFDekUsMEJBQUtDLE9BQUw7QUFDQXpDLG9DQUFnQjBDLE9BQWhCLENBQXdCO0FBQUEsK0JBQVFqQixLQUFLa0IsYUFBTCxDQUFtQjtBQUFBLG1DQUFNbEIsS0FBS0YsS0FBTCxHQUFhRSxLQUFLRixLQUFMLENBQVdxQixNQUFYLENBQWtCO0FBQUEsdUNBQVFDLEtBQUssQ0FBTCxNQUFZUixDQUFwQjtBQUFBLDZCQUFsQixDQUFuQjtBQUFBLHlCQUFuQixDQUFSO0FBQUEscUJBQXhCO0FBQ0g7QUFMSTs7QUFDVCxpQkFBSyxJQUFJQSxJQUFJLENBQWIsRUFBZ0JBLElBQUl4QyxhQUFhaUQsTUFBakMsRUFBeUMsRUFBRVQsQ0FBM0MsRUFBOEM7QUFBQSxzQkFBckNBLENBQXFDO0FBSzdDOztBQUVEckMsOEJBQWtCQSxnQkFBZ0I0QyxNQUFoQixDQUF1QjtBQUFBLHVCQUFRQyxLQUFLdEIsS0FBTCxDQUFXdUIsTUFBWCxLQUFzQixDQUE5QjtBQUFBLGFBQXZCLENBQWxCO0FBQ0g7Ozt3Q0FFZTtBQUNaLGlCQUFLL0IsU0FBTCxHQUFpQlQsU0FBU3lDLGFBQVQsQ0FBdUIsS0FBdkIsQ0FBakI7QUFDQSxpQkFBS2hDLFNBQUwsQ0FBZXdCLFNBQWYsR0FBMkIsTUFBM0I7QUFDQWpDLHFCQUFTMEMsSUFBVCxDQUFjQyxXQUFkLENBQTBCLEtBQUtsQyxTQUEvQjs7QUFFQSxpQkFBSyxJQUFJc0IsSUFBSSxDQUFiLEVBQWdCQSxJQUFJbEMsY0FBcEIsRUFBb0MsRUFBRWtDLENBQXRDLEVBQXlDO0FBQ3JDeEMsNkJBQWFrQyxJQUFiLENBQWtCLEVBQWxCO0FBQ0EscUJBQUssSUFBSW1CLElBQUksQ0FBYixFQUFnQkEsSUFBSS9DLGNBQXBCLEVBQW9DLEVBQUUrQyxDQUF0QyxFQUF5QztBQUNyQ3JELGlDQUFhd0MsQ0FBYixFQUFnQmEsQ0FBaEIsSUFBcUIsMkJBQWV4RCxlQUFmLEVBQWdDUyxjQUFoQyxDQUFyQjtBQUNBLHlCQUFLWSxTQUFMLENBQWVrQyxXQUFmLENBQTJCcEQsYUFBYXdDLENBQWIsRUFBZ0JhLENBQWhCLEVBQW1CWixHQUE5QztBQUNIO0FBQ0o7QUFDSjs7OzZDQUVvQmEsSyxFQUFPO0FBQ3hCLGdCQUFJQyxjQUFKO0FBQUEsZ0JBQ0lDLFVBQVVyRCxnQkFBZ0JBLGdCQUFnQjhDLE1BQWhCLEdBQXlCLENBQXpDLENBRGQ7O0FBR0Esb0JBQU9LLE1BQU1HLE9BQWI7QUFDQSxxQkFBSyxFQUFMO0FBQVNGLDRCQUFRLENBQUMsQ0FBVDtBQUNMO0FBQ0oscUJBQUssRUFBTDtBQUFTQSw0QkFBUSxDQUFSO0FBQ0w7QUFDSjtBQUFTQSw0QkFBUUcsU0FBUjtBQUxUOztBQVFBLGdCQUFJSCxTQUFTQyxRQUFRRyxjQUFSLENBQXVCLENBQUMsQ0FBRCxFQUFJSixLQUFKLENBQXZCLENBQWIsRUFBaUQ7QUFDN0NDLHdCQUFRSSxTQUFSLENBQWtCLENBQWxCLEVBQXFCTCxLQUFyQjtBQUNIO0FBQ0o7OztxQ0FFWTtBQUNULDhDQUFvQk0sYUFBcEI7QUFDQXhELCtCQUFtQixJQUFuQjtBQUNBeUQsMEJBQWMxRCxVQUFkO0FBQ0g7OztrQ0FFUztBQUNOSCw0QkFBZ0JLLGNBQWhCO0FBQ0EsOENBQW9CeUQsaUJBQXBCLENBQXNDLGNBQXRDLEVBQXNEOUQsWUFBdEQ7QUFDQSxpQkFBS29CLGtCQUFMOztBQUVBbkIsMkJBQWVBLGlCQUFpQkosU0FBakIsR0FBNkJJLFlBQTdCLEdBQTRDQSxlQUFlSCxlQUExRTtBQUNIOzs7b0NBRVc7QUFBQTs7QUFDUitELDBCQUFjMUQsVUFBZDtBQUNBLGlCQUFLNEQsYUFBTDtBQUNBNUQseUJBQWE2RCxZQUFZLFlBQU07QUFDM0I5RCxnQ0FBZ0IwQyxPQUFoQixDQUF3QixVQUFDakIsSUFBRCxFQUFPVyxLQUFQLEVBQWlCO0FBQ3JDLHdCQUFJWCxLQUFLK0IsY0FBTCxDQUFvQixDQUFDLENBQUQsRUFBSSxDQUFKLENBQXBCLENBQUosRUFBaUM7QUFDN0IvQiw2QkFBS2dDLFNBQUwsQ0FBZSxDQUFmLEVBQWtCLENBQWxCO0FBQ0gscUJBRkQsTUFFTztBQUNILDRCQUFJckIsVUFBVXBDLGdCQUFnQjhDLE1BQWhCLEdBQXlCLENBQXZDLEVBQTBDO0FBQ3RDLG1DQUFLaUIsVUFBTDtBQUNBLGdDQUFJLENBQUM3RCxnQkFBTCxFQUF1QjtBQUNuQix1Q0FBSzJELGFBQUw7QUFDSDtBQUNKO0FBQ0o7QUFDSixpQkFYRDtBQWFILGFBZFksRUFjVjlELFlBZFUsQ0FBYjtBQWVIOzs7NkNBRW9CO0FBQ2pCLGlCQUFLaUIsWUFBTCxDQUFrQmdELFNBQWxCLEdBQThCbEUsZ0JBQWdCLENBQTlDO0FBQ0g7Ozs0QkFsR1k7QUFDVCxtQkFBTzZCLEtBQUtDLEtBQUwsQ0FBV3pCLGlCQUFpQixDQUE1QixDQUFQO0FBQ0g7OztrQ0FrR2dCb0IsSyxFQUFPYSxLLEVBQU87QUFDM0J2Qyx5QkFBYTBCLE1BQU0sQ0FBTixDQUFiLEVBQXVCQSxNQUFNLENBQU4sQ0FBdkIsRUFBaUMwQyxnQkFBakMsQ0FBa0Q3QixLQUFsRDtBQUNIOzs7b0NBRWtCYixLLEVBQU87QUFDdEIsZ0JBQUk7QUFDQSx1QkFBTzFCLGFBQWEwQixNQUFNLENBQU4sQ0FBYixFQUF1QkEsTUFBTSxDQUFOLENBQXZCLEVBQWlDMkMsT0FBakMsRUFBUDtBQUNILGFBRkQsQ0FFRSxPQUFNQyxHQUFOLEVBQVc7QUFDVCx1QkFBTyxLQUFQO0FBQ0g7QUFDSjs7Ozs7Ozs7Ozs7OztBQ3hKTDs7QUFFQTdELFNBQVNDLGFBQVQsQ0FBdUIsUUFBdkIsRUFBaUM2RCxnQkFBakMsQ0FBa0QsT0FBbEQsRUFBMkRDLElBQTNEOztBQUVBLElBQUlDLGNBQUo7O0FBRUEsU0FBU0QsSUFBVCxHQUFnQjtBQUNaLFFBQUlDLEtBQUosRUFBVztBQUNQaEUsaUJBQVMwQyxJQUFULENBQWN1QixXQUFkLENBQTBCRCxNQUFNdkQsU0FBaEM7QUFDSDs7QUFFRHVELFlBQVEsMEJBQVI7O0FBRUFoRSxhQUFTOEQsZ0JBQVQsQ0FBMEIsU0FBMUIsRUFBcUNFLE1BQU1yQyxvQkFBM0M7QUFDSCxDOzs7Ozs7Ozs7Ozs7Ozs7OztBQ2RELElBQUl1QyxjQUFKOztJQUVhQyxVLFdBQUFBLFU7QUFDVCwwQkFBYztBQUFBOztBQUNWLGFBQUtuQyxHQUFMLEdBQVdoQyxTQUFTeUMsYUFBVCxDQUF1QixLQUF2QixDQUFYO0FBQ0EsYUFBS1QsR0FBTCxDQUFTQyxTQUFULEdBQXFCLGFBQXJCO0FBQ0EsYUFBS0QsR0FBTCxDQUFTb0MsS0FBVCxDQUFlRixLQUFmLEdBQXVCLEtBQUtsQyxHQUFMLENBQVNvQyxLQUFULENBQWVDLE1BQWYsR0FBd0JILEtBQS9DO0FBQ0g7Ozs7eUNBRWdCSSxVLEVBQVk7QUFDekIsZ0JBQUlDLGdCQUFKO0FBQUEsZ0JBQWFDLGNBQWI7O0FBRUEsb0JBQU9GLFVBQVA7QUFDQSxxQkFBSyxDQUFMO0FBQVFDLDhCQUFVLFNBQVYsQ0FBcUJDLFFBQVEsU0FBUixDQUFtQjtBQUNoRCxxQkFBSyxDQUFMO0FBQVFELDhCQUFVLFNBQVYsQ0FBcUJDLFFBQVEsU0FBUixDQUFtQjtBQUNoRCxxQkFBSyxDQUFMO0FBQVFELDhCQUFVLFNBQVYsQ0FBcUJDLFFBQVEsU0FBUixDQUFtQjtBQUNoRCxxQkFBSyxDQUFMO0FBQVFELDhCQUFVLFNBQVYsQ0FBcUJDLFFBQVEsU0FBUixDQUFtQjtBQUNoRCxxQkFBSyxDQUFMO0FBQVFELDhCQUFVLFNBQVYsQ0FBcUJDLFFBQVEsU0FBUixDQUFtQjtBQUNoRCxxQkFBSyxDQUFMO0FBQVFELDhCQUFVLFNBQVYsQ0FBcUJDLFFBQVEsU0FBUixDQUFtQjtBQUNoRCxxQkFBSyxDQUFMO0FBQVFELDhCQUFVLFNBQVYsQ0FBcUJDLFFBQVEsU0FBUixDQUFtQjtBQUNoRDtBQUFTRCw4QkFBVSxhQUFWLENBQXlCQyxRQUFRLFNBQVI7QUFSbEM7O0FBV0EsaUJBQUt4QyxHQUFMLENBQVNDLFNBQVQsR0FBcUJzQyxPQUFyQjtBQUNBLGlCQUFLdkMsR0FBTCxDQUFTb0MsS0FBVCxDQUFlSyxlQUFmLEdBQWlDRCxLQUFqQztBQUNIOzs7a0NBRVM7QUFDTixtQkFBTyxLQUFLeEMsR0FBTCxDQUFTQyxTQUFULEtBQXVCLGFBQTlCO0FBQ0g7OztpQ0FFZWxDLEssRUFBTztBQUNuQm1FLG9CQUFRbkUsS0FBUjtBQUNIOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ2pDTDs7OztBQUVBLElBQU0yRSxTQUFTLENBQ1gsQ0FBQyxDQUFDLENBQUQsRUFBSSxDQUFKLENBQUQsRUFBUyxDQUFDLENBQUQsRUFBSSxDQUFKLENBQVQsRUFBaUIsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFqQixFQUF5QixDQUFDLENBQUQsRUFBSSxDQUFKLENBQXpCLENBRFcsRUFFWCxDQUFDLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBRCxFQUFTLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBVCxFQUFpQixDQUFDLENBQUQsRUFBSSxDQUFKLENBQWpCLEVBQXlCLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBekIsQ0FGVyxFQUdYLENBQUMsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFELEVBQVMsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFULEVBQWlCLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBakIsRUFBeUIsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUF6QixDQUhXLEVBSVgsQ0FBQyxDQUFDLENBQUQsRUFBSSxDQUFKLENBQUQsRUFBUyxDQUFDLENBQUQsRUFBSSxDQUFKLENBQVQsRUFBaUIsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFqQixFQUF5QixDQUFDLENBQUQsRUFBSSxDQUFKLENBQXpCLENBSlcsRUFLWCxDQUFDLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBRCxFQUFTLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBVCxFQUFpQixDQUFDLENBQUQsRUFBSSxDQUFKLENBQWpCLEVBQXlCLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBekIsQ0FMVyxFQU1YLENBQUMsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFELEVBQVMsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFULEVBQWlCLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBakIsRUFBeUIsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUF6QixDQU5XLEVBT1gsQ0FBQyxDQUFDLENBQUQsRUFBSSxDQUFKLENBQUQsRUFBUyxDQUFDLENBQUQsRUFBSSxDQUFKLENBQVQsRUFBaUIsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFqQixFQUF5QixDQUFDLENBQUQsRUFBSSxDQUFKLENBQXpCLENBUFcsQ0FBZjs7SUFVYUMsTSxXQUFBQSxNO0FBQ1Qsc0JBQWM7QUFBQTs7QUFDVixhQUFLN0MsS0FBTCxHQUFhVCxLQUFLQyxLQUFMLENBQVdELEtBQUt1RCxNQUFMLEtBQWdCLENBQTNCLENBQWIsRUFDQSxLQUFLM0QsS0FBTCxHQUFheUQsT0FBTyxLQUFLNUMsS0FBWixDQURiO0FBRUg7Ozs7d0NBRWU7QUFDWixnQkFBSStDLFNBQVMsSUFBYjs7QUFFQSxpQkFBSzVELEtBQUwsQ0FBV21CLE9BQVgsQ0FBbUI7QUFBQSx1QkFBUXlDLFNBQVNBLFVBQVUscUJBQVVDLFdBQVYsQ0FBc0IzRCxJQUF0QixDQUEzQjtBQUFBLGFBQW5COztBQUVBLG1CQUFPMEQsTUFBUDtBQUNIOzs7dUNBRWMvQixLLEVBQU87QUFBQTs7QUFDbEIsZ0JBQUlpQyxxQkFBcUIsS0FBSzlELEtBQUwsQ0FBV0MsR0FBWCxDQUFlO0FBQUEsdUJBQVEsQ0FBQ0MsS0FBSyxDQUFMLElBQVUyQixNQUFNLENBQU4sQ0FBWCxFQUFxQjNCLEtBQUssQ0FBTCxJQUFVMkIsTUFBTSxDQUFOLENBQS9CLENBQVI7QUFBQSxhQUFmLENBQXpCO0FBQUEsZ0JBQ0lrQyxVQUFVLElBRGQ7O0FBR0FELCtCQUFtQjNDLE9BQW5CLENBQTJCLGdCQUFRO0FBQy9CLG9CQUFJLENBQUMsTUFBS25CLEtBQUwsQ0FBV0MsR0FBWCxDQUFlO0FBQUEsMkJBQVFDLEtBQUs4RCxRQUFMLEVBQVI7QUFBQSxpQkFBZixFQUF3Qy9DLFFBQXhDLENBQWlEZixLQUFLOEQsUUFBTCxFQUFqRCxDQUFMLEVBQXdFO0FBQ3BFRCw4QkFBVUEsV0FBVyxxQkFBVUYsV0FBVixDQUFzQjNELElBQXRCLENBQXJCO0FBQ0g7QUFDSixhQUpEOztBQU1BLG1CQUFPNkQsT0FBUDtBQUNIOzs7MkNBRWtCRSxVLEVBQVk7QUFDM0IsaUJBQUtqRSxLQUFMLENBQVdDLEdBQVgsQ0FBZTtBQUFBLHVCQUFRLHFCQUFVaUUsU0FBVixDQUFvQmhFLElBQXBCLEVBQTBCK0QsVUFBMUIsQ0FBUjtBQUFBLGFBQWY7QUFDSDs7O2tDQUVTRSxRLEVBQVV0QyxLLEVBQU87QUFBQTs7QUFDdkIsaUJBQUtULGFBQUwsQ0FBbUI7QUFBQSx1QkFBTSxPQUFLcEIsS0FBTCxDQUFXQyxHQUFYLENBQWU7QUFBQSwyQkFBUUMsS0FBS2lFLFFBQUwsS0FBa0J0QyxLQUExQjtBQUFBLGlCQUFmLENBQU47QUFBQSxhQUFuQjtBQUNIOzs7c0NBRWF1QyxhLEVBQWU7QUFDekIsaUJBQUt4RCxrQkFBTDtBQUNBd0Q7QUFDQSxpQkFBS3hELGtCQUFMLENBQXdCLEtBQUtDLEtBQTdCO0FBQ0g7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ25ETCxJQUFJWixZQUFKOztJQUVhb0UsbUIsV0FBQUEsbUI7Ozs7Ozs7MENBQ2dCQyxJLEVBQU1DLEssRUFBTztBQUNsQyxnQkFBRyxDQUFDdEUsSUFBSXVFLEdBQUosQ0FBUUYsSUFBUixDQUFELElBQW1CckUsSUFBSXVFLEdBQUosQ0FBUUYsSUFBUixLQUFpQnJFLElBQUliLEdBQUosQ0FBUWtGLElBQVIsSUFBZ0JDLEtBQXZELEVBQStEO0FBQzNEdEUsb0JBQUl3RSxHQUFKLENBQVFILElBQVIsRUFBY0MsS0FBZDtBQUNIO0FBQ0o7Ozt5Q0FFdUI7QUFDcEJ0RSxrQkFBTSxJQUFJeUUsR0FBSixFQUFOO0FBQ0EsZ0JBQUlDLGFBQWFwRCxNQUFiLEtBQXdCLENBQTVCLEVBQStCO0FBQzNCLHFCQUFJLElBQUlULElBQUksQ0FBWixFQUFlQSxJQUFJNkQsYUFBYXBELE1BQWhDLEVBQXdDLEVBQUVULENBQTFDLEVBQTZDO0FBQ3pDYix3QkFBSXdFLEdBQUosQ0FBUUUsYUFBYUMsR0FBYixDQUFpQjlELENBQWpCLENBQVIsRUFBNkI2RCxhQUFhRSxPQUFiLENBQXFCRixhQUFhQyxHQUFiLENBQWlCOUQsQ0FBakIsQ0FBckIsQ0FBN0I7QUFDSDs7QUFFRDZELDZCQUFhRyxLQUFiO0FBQ0g7O0FBRUQsbUJBQU83RSxHQUFQO0FBQ0g7Ozt3Q0FFc0I7QUFDbkJBLGdCQUFJa0IsT0FBSixDQUFZLFVBQUNyQyxLQUFELEVBQVE4RixHQUFSLEVBQWdCO0FBQ3hCRCw2QkFBYUksT0FBYixDQUFxQkgsR0FBckIsRUFBMEI5RixLQUExQjtBQUNILGFBRkQ7QUFHSCIsImZpbGUiOiIuL2Rpc3QvYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMSk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgYmYyNmQ1OTVjYzNjNmM2Y2ZmNjMiLCJpbXBvcnQge0VtcHR5QmxvY2t9IGZyb20gJy4vRW1wdHlCbG9jay5jbGFzcyc7XG5pbXBvcnQge0ZpZ3VyZX0gZnJvbSAnLi9GaWd1cmUuY2xhc3MnO1xuaW1wb3J0IHtMb2NhbFN0b3JhZ2VTZXJ2aWNlfSBmcm9tICcuL2xvY2FsU3RvcmFnZSc7XG5cbmNvbnN0IEdBTUVfQk9BUkRfU0laRSA9IDU1MCxcbiAgICBNSU5fU1BFRUQgPSAxMDAwLFxuICAgIFNQRUVEX1JFRFVDVElPTiA9IDUwMDtcblxubGV0IGJsb2Nrc09uUGFnZSxcbiAgICBjdXJyZW50U2NvcmUsXG4gICAgY3VycmVudFNwZWVkLFxuICAgIGVsZW1lbnRzT25Cb2FyZCxcbiAgICBpbnRlcnZhbElELFxuICAgIGdhbWVGaW5pc2hlZEZsYWcsXG4gICAgbnVtYmVyT2ZCbG9ja3M7XG5cbmZ1bmN0aW9uIGNoZWNrSW5wdXRWYWx1ZSgpIHtcbiAgICBsZXQgdmFsdWUgPSArZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI251bWJlcicpLnZhbHVlO1xuXG4gICAgcmV0dXJuIHZhbHVlID49IDkgJiYgdmFsdWUgPD0gMTUgPyB2YWx1ZSA6IDk7XG59XG5cbmZ1bmN0aW9uIHNldEluaXRWYWx1ZXMoKSB7XG4gICAgYmxvY2tzT25QYWdlID0gW107XG4gICAgY3VycmVudFNwZWVkID0gMjUwMDtcbiAgICBjdXJyZW50U2NvcmUgPSBwYXJzZUludChMb2NhbFN0b3JhZ2VTZXJ2aWNlLmdldEZyb21TdG9yYWdlKCkuZ2V0KCdjdXJyZW50U2NvcmUnKSkgfHwgMDtcbiAgICBlbGVtZW50c09uQm9hcmQgPSBbXTtcbiAgICBnYW1lRmluaXNoZWRGbGFnID0gZmFsc2U7XG4gICAgbnVtYmVyT2ZCbG9ja3MgPSBjaGVja0lucHV0VmFsdWUoKTtcbiAgICBFbXB0eUJsb2NrLnNldFdpZHRoKChHQU1FX0JPQVJEX1NJWkUgLyBudW1iZXJPZkJsb2NrcykudG9GaXhlZCgxKSArICdweCcpO1xufVxuXG5leHBvcnQgY2xhc3MgR2FtZUJvYXJkIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5nYW1lQm9hcmQ7XG4gICAgICAgIHRoaXMuc2NvcmVFbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Njb3JlJyk7XG4gICAgICAgIHRoaXMudXBkYXRlU2NvcmVFbGVtZW50KCk7XG4gICAgICAgIHNldEluaXRWYWx1ZXMoKTtcbiAgICAgICAgdGhpcy5kcmF3R2FtZUJvYXJkKCk7XG4gICAgICAgIHRoaXMuc3RhcnRHYW1lKCk7XG4gICAgfVxuXG4gICAgZ2V0IG1pZGRsZSgpIHtcbiAgICAgICAgcmV0dXJuIE1hdGguZmxvb3IobnVtYmVyT2ZCbG9ja3MgLyAyKTtcbiAgICB9XG5cbiAgICBhZGROZXdFbGVtZW50KCkge1xuICAgICAgICBsZXQgbmV3RWxlbSA9IG5ldyBGaWd1cmUoKSxcbiAgICAgICAgICAgIHBvaW50c1hPZk5ld0VsZW0gPSBuZXdFbGVtLmJsb2NrLm1hcChpdGVtID0+IGl0ZW1bMV0pLFxuICAgICAgICAgICAgbWlkZGxlID0gdGhpcy5taWRkbGUgLSBNYXRoLmZsb29yKE1hdGgubWF4KC4uLnBvaW50c1hPZk5ld0VsZW0pIC8gMik7XG5cbiAgICAgICAgbmV3RWxlbS5ibG9jayA9IG5ld0VsZW0uYmxvY2subWFwKGl0ZW0gPT4gW2l0ZW1bMF0sIGl0ZW1bMV0gKyBtaWRkbGVdKTtcblxuICAgICAgICBpZiAobmV3RWxlbS5jYW5BZGRUb0JvYXJkKCkpIHtcbiAgICAgICAgICAgIGVsZW1lbnRzT25Cb2FyZC5wdXNoKG5ld0VsZW0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIHRoaXMuZXhlY3V0ZUtleURvd25BY3Rpb24pO1xuICAgICAgICAgICAgdGhpcy5maW5pc2hHYW1lKCk7XG4gICAgICAgIH1cbiAgICAgICAgbmV3RWxlbS5kcmF3RWxlbWVudE9uQm9hcmQobmV3RWxlbS5pbmRleCk7XG4gICAgfVxuXG4gICAgY2hlY2tTY29yZSgpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBibG9ja3NPblBhZ2UubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgIGlmKCFibG9ja3NPblBhZ2VbaV0ubWFwKGl0ZW0gPT4gaXRlbS5ib3guY2xhc3NOYW1lKS5pbmNsdWRlcygnYmxvY2stZW1wdHknKSkge1xuICAgICAgICAgICAgICAgIHRoaXMubGV2ZWx1cCgpO1xuICAgICAgICAgICAgICAgIGVsZW1lbnRzT25Cb2FyZC5mb3JFYWNoKGl0ZW0gPT4gaXRlbS5yZWRyYXdFbGVtZW50KCgpID0+IGl0ZW0uYmxvY2sgPSBpdGVtLmJsb2NrLmZpbHRlcihlbGVtID0+IGVsZW1bMF0gIT09IGkpKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBlbGVtZW50c09uQm9hcmQgPSBlbGVtZW50c09uQm9hcmQuZmlsdGVyKGVsZW0gPT4gZWxlbS5ibG9jay5sZW5ndGggIT09IDApO1xuICAgIH1cblxuICAgIGRyYXdHYW1lQm9hcmQoKSB7XG4gICAgICAgIHRoaXMuZ2FtZUJvYXJkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIHRoaXMuZ2FtZUJvYXJkLmNsYXNzTmFtZSA9ICdnYW1lJztcbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0aGlzLmdhbWVCb2FyZCk7XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBudW1iZXJPZkJsb2NrczsgKytpKSB7XG4gICAgICAgICAgICBibG9ja3NPblBhZ2UucHVzaChbXSk7XG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IG51bWJlck9mQmxvY2tzOyArK2opIHtcbiAgICAgICAgICAgICAgICBibG9ja3NPblBhZ2VbaV1bal0gPSBuZXcgRW1wdHlCbG9jayhHQU1FX0JPQVJEX1NJWkUsIG51bWJlck9mQmxvY2tzKTtcbiAgICAgICAgICAgICAgICB0aGlzLmdhbWVCb2FyZC5hcHBlbmRDaGlsZChibG9ja3NPblBhZ2VbaV1bal0uYm94KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGV4ZWN1dGVLZXlEb3duQWN0aW9uKGV2ZW50KSB7XG4gICAgICAgIGxldCBzaGlmdCxcbiAgICAgICAgICAgIGVsZW1lbnQgPSBlbGVtZW50c09uQm9hcmRbZWxlbWVudHNPbkJvYXJkLmxlbmd0aCAtIDFdO1xuXG4gICAgICAgIHN3aXRjaChldmVudC5rZXlDb2RlKSB7XG4gICAgICAgIGNhc2UgMzc6IHNoaWZ0ID0gLTE7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAzOTogc2hpZnQgPSAxO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6IHNoaWZ0ID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHNoaWZ0ICYmIGVsZW1lbnQuY2FuTW92ZUVsZW1lbnQoWzAsIHNoaWZ0XSkpIHtcbiAgICAgICAgICAgIGVsZW1lbnQubW92ZUJsb2NrKDEsIHNoaWZ0KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZpbmlzaEdhbWUoKSB7XG4gICAgICAgIExvY2FsU3RvcmFnZVNlcnZpY2UudXBkYXRlU3RvcmFnZSgpO1xuICAgICAgICBnYW1lRmluaXNoZWRGbGFnID0gdHJ1ZTtcbiAgICAgICAgY2xlYXJJbnRlcnZhbChpbnRlcnZhbElEKTtcbiAgICB9XG5cbiAgICBsZXZlbHVwKCkge1xuICAgICAgICBjdXJyZW50U2NvcmUgKz0gbnVtYmVyT2ZCbG9ja3M7XG4gICAgICAgIExvY2FsU3RvcmFnZVNlcnZpY2UuYWRkVmFsdWVUb1N0b3JhZ2UoJ2N1cnJlbnRTY29yZScsIGN1cnJlbnRTY29yZSk7XG4gICAgICAgIHRoaXMudXBkYXRlU2NvcmVFbGVtZW50KCk7XG5cbiAgICAgICAgY3VycmVudFNwZWVkID0gY3VycmVudFNwZWVkID09PSBNSU5fU1BFRUQgPyBjdXJyZW50U3BlZWQgOiBjdXJyZW50U3BlZWQgLSBTUEVFRF9SRURVQ1RJT047XG4gICAgfVxuXG4gICAgc3RhcnRHYW1lKCkge1xuICAgICAgICBjbGVhckludGVydmFsKGludGVydmFsSUQpO1xuICAgICAgICB0aGlzLmFkZE5ld0VsZW1lbnQoKTtcbiAgICAgICAgaW50ZXJ2YWxJRCA9IHNldEludGVydmFsKCgpID0+IHtcbiAgICAgICAgICAgIGVsZW1lbnRzT25Cb2FyZC5mb3JFYWNoKChpdGVtLCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChpdGVtLmNhbk1vdmVFbGVtZW50KFsxLCAwXSkpIHtcbiAgICAgICAgICAgICAgICAgICAgaXRlbS5tb3ZlQmxvY2soMCwgMSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGluZGV4ID09PSBlbGVtZW50c09uQm9hcmQubGVuZ3RoIC0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jaGVja1Njb3JlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWdhbWVGaW5pc2hlZEZsYWcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmFkZE5ld0VsZW1lbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH0sIGN1cnJlbnRTcGVlZCk7XG4gICAgfVxuXG4gICAgdXBkYXRlU2NvcmVFbGVtZW50KCkge1xuICAgICAgICB0aGlzLnNjb3JlRWxlbWVudC5pbm5lclRleHQgPSBjdXJyZW50U2NvcmUgfHwgMDtcbiAgICB9XG5cbiAgICBzdGF0aWMgZHJhd0Jsb2NrKGJsb2NrLCBpbmRleCkge1xuICAgICAgICBibG9ja3NPblBhZ2VbYmxvY2tbMF1dW2Jsb2NrWzFdXS5jaGFuZ2VCbG9ja1N0eWxlKGluZGV4KTtcbiAgICB9XG5cbiAgICBzdGF0aWMgdHJ5QWRkQmxvY2soYmxvY2spIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHJldHVybiBibG9ja3NPblBhZ2VbYmxvY2tbMF1dW2Jsb2NrWzFdXS5pc0VtcHR5KCk7XG4gICAgICAgIH0gY2F0Y2goZXJyKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zY3JpcHRzL0dhbWVCb2FyZC5jbGFzcy5qcyIsImltcG9ydCB7R2FtZUJvYXJkfSBmcm9tICcuL0dhbWVCb2FyZC5jbGFzcyc7XG5cbmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNzdGFydCcpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgaW5pdCk7XG5cbmxldCBib2FyZDtcblxuZnVuY3Rpb24gaW5pdCgpIHtcbiAgICBpZiAoYm9hcmQpIHtcbiAgICAgICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChib2FyZC5nYW1lQm9hcmQpO1xuICAgIH1cblxuICAgIGJvYXJkID0gbmV3IEdhbWVCb2FyZCgpO1xuXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGJvYXJkLmV4ZWN1dGVLZXlEb3duQWN0aW9uKTtcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NjcmlwdHMvaW5kZXguanMiLCJsZXQgd2lkdGg7XG5cbmV4cG9ydCBjbGFzcyBFbXB0eUJsb2NrIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5ib3ggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgdGhpcy5ib3guY2xhc3NOYW1lID0gJ2Jsb2NrLWVtcHR5JztcbiAgICAgICAgdGhpcy5ib3guc3R5bGUud2lkdGggPSB0aGlzLmJveC5zdHlsZS5oZWlnaHQgPSB3aWR0aDtcbiAgICB9XG5cbiAgICBjaGFuZ2VCbG9ja1N0eWxlKHN0eWxlQmxvY2spIHtcbiAgICAgICAgbGV0IGVsQ2xhc3MsIGNvbG9yO1xuXG4gICAgICAgIHN3aXRjaChzdHlsZUJsb2NrKSB7XG4gICAgICAgIGNhc2UgMDogZWxDbGFzcyA9ICdibG9jay1pJzsgY29sb3IgPSAnIzgxRjdGMyc7IGJyZWFrO1xuICAgICAgICBjYXNlIDE6IGVsQ2xhc3MgPSAnYmxvY2staic7IGNvbG9yID0gJyM4MTgxRjcnOyBicmVhaztcbiAgICAgICAgY2FzZSAyOiBlbENsYXNzID0gJ2Jsb2NrLWwnOyBjb2xvciA9ICcjRkU5QTJFJzsgYnJlYWs7XG4gICAgICAgIGNhc2UgMzogZWxDbGFzcyA9ICdibG9jay1vJzsgY29sb3IgPSAnI0YzRjc4MSc7IGJyZWFrO1xuICAgICAgICBjYXNlIDQ6IGVsQ2xhc3MgPSAnYmxvY2stcyc7IGNvbG9yID0gJyM4MUY3ODEnOyBicmVhaztcbiAgICAgICAgY2FzZSA1OiBlbENsYXNzID0gJ2Jsb2NrLXQnOyBjb2xvciA9ICcjREE4MUY1JzsgYnJlYWs7XG4gICAgICAgIGNhc2UgNjogZWxDbGFzcyA9ICdibG9jay16JzsgY29sb3IgPSAnI0Y3ODE4MSc7IGJyZWFrO1xuICAgICAgICBkZWZhdWx0OiBlbENsYXNzID0gJ2Jsb2NrLWVtcHR5JzsgY29sb3IgPSAnI0Q4RDhEOCc7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmJveC5jbGFzc05hbWUgPSBlbENsYXNzO1xuICAgICAgICB0aGlzLmJveC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBjb2xvcjtcbiAgICB9XG5cbiAgICBpc0VtcHR5KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5ib3guY2xhc3NOYW1lID09PSAnYmxvY2stZW1wdHknO1xuICAgIH1cblxuICAgIHN0YXRpYyBzZXRXaWR0aCh2YWx1ZSkge1xuICAgICAgICB3aWR0aCA9IHZhbHVlO1xuICAgIH1cbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NjcmlwdHMvRW1wdHlCbG9jay5jbGFzcy5qcyIsImltcG9ydCB7R2FtZUJvYXJkfSBmcm9tICcuL0dhbWVCb2FyZC5jbGFzcyc7XG5cbmNvbnN0IEJMT0NLUyA9IFtcbiAgICBbWzAsIDBdLCBbMCwgMV0sIFswLCAyXSwgWzAsIDNdXSxcbiAgICBbWzAsIDBdLCBbMCwgMV0sIFswLCAyXSwgWzEsIDJdXSxcbiAgICBbWzAsIDBdLCBbMCwgMV0sIFswLCAyXSwgWzEsIDBdXSxcbiAgICBbWzAsIDBdLCBbMCwgMV0sIFsxLCAwXSwgWzEsIDFdXSxcbiAgICBbWzAsIDFdLCBbMCwgMl0sIFsxLCAwXSwgWzEsIDFdXSxcbiAgICBbWzAsIDBdLCBbMCwgMV0sIFswLCAyXSwgWzEsIDFdXSxcbiAgICBbWzAsIDBdLCBbMCwgMV0sIFsxLCAxXSwgWzEsIDJdXVxuXTtcblxuZXhwb3J0IGNsYXNzIEZpZ3VyZSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuaW5kZXggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiA3KSxcbiAgICAgICAgdGhpcy5ibG9jayA9IEJMT0NLU1t0aGlzLmluZGV4XTtcbiAgICB9XG5cbiAgICBjYW5BZGRUb0JvYXJkKCkge1xuICAgICAgICBsZXQgY2FuQWRkID0gdHJ1ZTtcblxuICAgICAgICB0aGlzLmJsb2NrLmZvckVhY2goaXRlbSA9PiBjYW5BZGQgPSBjYW5BZGQgJiYgR2FtZUJvYXJkLnRyeUFkZEJsb2NrKGl0ZW0pKTtcblxuICAgICAgICByZXR1cm4gY2FuQWRkO1xuICAgIH1cblxuICAgIGNhbk1vdmVFbGVtZW50KHNoaWZ0KSB7XG4gICAgICAgIGxldCBwZXJoYWJzTmV3UG9zaXRpb24gPSB0aGlzLmJsb2NrLm1hcChpdGVtID0+IFtpdGVtWzBdICsgc2hpZnRbMF0sIGl0ZW1bMV0gKyBzaGlmdFsxXV0pLFxuICAgICAgICAgICAgY2FuTW92ZSA9IHRydWU7XG5cbiAgICAgICAgcGVyaGFic05ld1Bvc2l0aW9uLmZvckVhY2goaXRlbSA9PiB7XG4gICAgICAgICAgICBpZiAoIXRoaXMuYmxvY2subWFwKGl0ZW0gPT4gaXRlbS50b1N0cmluZygpKS5pbmNsdWRlcyhpdGVtLnRvU3RyaW5nKCkpKSB7XG4gICAgICAgICAgICAgICAgY2FuTW92ZSA9IGNhbk1vdmUgJiYgR2FtZUJvYXJkLnRyeUFkZEJsb2NrKGl0ZW0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gY2FuTW92ZTtcbiAgICB9XG5cbiAgICBkcmF3RWxlbWVudE9uQm9hcmQoY29sb3JJbmRleCkge1xuICAgICAgICB0aGlzLmJsb2NrLm1hcChpdGVtID0+IEdhbWVCb2FyZC5kcmF3QmxvY2soaXRlbSwgY29sb3JJbmRleCkpO1xuICAgIH1cblxuICAgIG1vdmVCbG9jayhwb3NpdGlvbiwgc2hpZnQpIHtcbiAgICAgICAgdGhpcy5yZWRyYXdFbGVtZW50KCgpID0+IHRoaXMuYmxvY2subWFwKGl0ZW0gPT4gaXRlbVtwb3NpdGlvbl0gKz0gc2hpZnQpKTtcbiAgICB9XG5cbiAgICByZWRyYXdFbGVtZW50KGZpbHRlcmVkQmxvY2spIHtcbiAgICAgICAgdGhpcy5kcmF3RWxlbWVudE9uQm9hcmQoKTtcbiAgICAgICAgZmlsdGVyZWRCbG9jaygpO1xuICAgICAgICB0aGlzLmRyYXdFbGVtZW50T25Cb2FyZCh0aGlzLmluZGV4KTtcbiAgICB9XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zY3JpcHRzL0ZpZ3VyZS5jbGFzcy5qcyIsImxldCBtYXA7XG5cbmV4cG9ydCBjbGFzcyBMb2NhbFN0b3JhZ2VTZXJ2aWNlIHtcbiAgICBzdGF0aWMgYWRkVmFsdWVUb1N0b3JhZ2UobmFtZSwgc2NvcmUpIHtcbiAgICAgICAgaWYoIW1hcC5oYXMobmFtZSkgfHwgKG1hcC5oYXMobmFtZSkgJiYgbWFwLmdldChuYW1lKSA8IHNjb3JlKSkge1xuICAgICAgICAgICAgbWFwLnNldChuYW1lLCBzY29yZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzdGF0aWMgZ2V0RnJvbVN0b3JhZ2UoKSB7XG4gICAgICAgIG1hcCA9IG5ldyBNYXAoKTtcbiAgICAgICAgaWYgKGxvY2FsU3RvcmFnZS5sZW5ndGggIT09IDApIHtcbiAgICAgICAgICAgIGZvcihsZXQgaSA9IDA7IGkgPCBsb2NhbFN0b3JhZ2UubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgICAgICBtYXAuc2V0KGxvY2FsU3RvcmFnZS5rZXkoaSksIGxvY2FsU3RvcmFnZS5nZXRJdGVtKGxvY2FsU3RvcmFnZS5rZXkoaSkpKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLmNsZWFyKCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbWFwO1xuICAgIH1cblxuICAgIHN0YXRpYyB1cGRhdGVTdG9yYWdlKCkge1xuICAgICAgICBtYXAuZm9yRWFjaCgodmFsdWUsIGtleSkgPT4ge1xuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oa2V5LCB2YWx1ZSk7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NjcmlwdHMvbG9jYWxTdG9yYWdlLmpzIl0sInNvdXJjZVJvb3QiOiIifQ==