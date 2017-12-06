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
    gameFinishedFlag = void 0;

function setInitValues() {
    blocksOnPage = [];
    currentSpeed = 2500;
    currentScore = parseInt(_localStorage.localStorageObject.getFromStorage().get('currentScore')) || 0;
    elementsOnBoard = [];
    gameFinishedFlag = false;
}

var GameBoard = exports.GameBoard = function () {
    function GameBoard(numberOfBlocks) {
        _classCallCheck(this, GameBoard);

        this.size = numberOfBlocks;
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
                pointsXOfNewElem = newElem.figure.blocks.map(function (item) {
                return item[1];
            }),
                middle = this.middle - Math.floor(Math.max.apply(Math, _toConsumableArray(pointsXOfNewElem)) / 2);

            newElem.figure.blocks = newElem.figure.blocks.map(function (item) {
                return [item[0], item[1] + middle];
            });

            if (newElem.canAddToBoard()) {
                elementsOnBoard.push(newElem);
            } else {
                this.finishGame();
            }
            newElem.drawElementOnBoard(newElem.figure.color);
        }
    }, {
        key: 'checkScore',
        value: function checkScore() {
            var _this = this;

            var _loop = function _loop(i) {
                if (!blocksOnPage[i].map(function (item) {
                    return item.isEmpty();
                }).includes(true)) {
                    _this.levelup();
                    elementsOnBoard.forEach(function (item) {
                        return item.redrawElement(function () {
                            return item.figure.blocks = item.figure.blocks.filter(function (elem) {
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
                return elem.figure.blocks.length !== 0;
            });
        }
    }, {
        key: 'drawGameBoard',
        value: function drawGameBoard() {
            this.gameBoard = document.createElement('div');
            this.gameBoard.className = 'game';
            document.body.appendChild(this.gameBoard);
            _EmptyBlock.EmptyBlock.setWidth((GAME_BOARD_SIZE / this.size).toFixed(1) + 'px');

            for (var i = 0; i < this.size; ++i) {
                blocksOnPage.push([]);
                for (var j = 0; j < this.size; ++j) {
                    blocksOnPage[i][j] = new _EmptyBlock.EmptyBlock(GAME_BOARD_SIZE, this.size);
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
            document.removeEventListener('keydown', this.executeKeyDownAction);
            _localStorage.localStorageObject.updateStorage();
            gameFinishedFlag = true;
            clearInterval(intervalID);
        }
    }, {
        key: 'levelup',
        value: function levelup() {
            currentScore += this.size;
            _localStorage.localStorageObject.addValueToStorage('currentScore', currentScore);
            this.updateScoreElement();

            currentSpeed = currentSpeed === MIN_SPEED ? currentSpeed : currentSpeed - SPEED_REDUCTION;
        }
    }, {
        key: 'startGame',
        value: function startGame() {
            var _this2 = this;

            document.addEventListener('keydown', this.executeKeyDownAction);
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
            return Math.floor(this.size / 2);
        }
    }], [{
        key: 'drawBlock',
        value: function drawBlock(block, color) {
            blocksOnPage[block[0]][block[1]].changeBlockStyle(color);
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
    function getInputValue() {
        var value = +document.querySelector('#number').value;

        return value >= 9 && value <= 15 ? value : 9;
    }

    if (board) {
        document.body.removeChild(board.gameBoard);
    }

    board = new _GameBoard.GameBoard(getInputValue());
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

var defaultColor = 'rgb(216, 216, 216)',
    width = void 0;

var EmptyBlock = exports.EmptyBlock = function () {
    function EmptyBlock() {
        _classCallCheck(this, EmptyBlock);

        this.box = document.createElement('div');
        this.box.className = 'block-empty';
        this.box.style.width = this.box.style.height = width;
        this.box.style.backgroundColor = defaultColor;
    }

    _createClass(EmptyBlock, [{
        key: 'changeBlockStyle',
        value: function changeBlockStyle(color) {
            this.box.style.backgroundColor = color || defaultColor;
        }
    }, {
        key: 'isEmpty',
        value: function isEmpty() {
            return this.box.style.backgroundColor === defaultColor;
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

var BLOCKS = [{
    color: '#81F7F3',
    blocks: [[0, 0], [0, 1], [0, 2], [0, 3]]
}, {
    color: '#8181F7',
    blocks: [[0, 0], [0, 1], [0, 2], [1, 2]]
}, {
    color: '#FE9A2E',
    blocks: [[0, 0], [0, 1], [0, 2], [1, 0]]
}, {
    color: '#F3F781',
    blocks: [[0, 0], [0, 1], [1, 0], [1, 1]]
}, {
    color: '#81F781',
    blocks: [[0, 1], [0, 2], [1, 0], [1, 1]]
}, {
    color: '#DA81F5',
    blocks: [[0, 0], [0, 1], [0, 2], [1, 1]]
}, {
    color: '#F78181',
    blocks: [[0, 0], [0, 1], [1, 1], [1, 2]]
}];

var Figure = exports.Figure = function () {
    function Figure() {
        _classCallCheck(this, Figure);

        this.figure = Object.assign({}, BLOCKS[Math.floor(Math.random() * 7)]);
    }

    _createClass(Figure, [{
        key: 'canAddToBoard',
        value: function canAddToBoard() {
            var canAdd = true;

            this.figure.blocks.forEach(function (item) {
                return canAdd = canAdd && _GameBoard.GameBoard.tryAddBlock(item);
            });

            return canAdd;
        }
    }, {
        key: 'canMoveElement',
        value: function canMoveElement(shift) {
            var _this = this;

            var possibleNewPosition = this.figure.blocks.map(function (item) {
                return [item[0] + shift[0], item[1] + shift[1]];
            }),
                canMove = true;

            possibleNewPosition.forEach(function (item) {
                if (!_this.figure.blocks.map(function (item) {
                    return item.toString();
                }).includes(item.toString())) {
                    canMove = canMove && _GameBoard.GameBoard.tryAddBlock(item);
                }
            });

            return canMove;
        }
    }, {
        key: 'drawElementOnBoard',
        value: function drawElementOnBoard(color) {
            this.figure.blocks.map(function (item) {
                return _GameBoard.GameBoard.drawBlock(item, color);
            });
        }
    }, {
        key: 'moveBlock',
        value: function moveBlock(position, shift) {
            var _this2 = this;

            this.redrawElement(function () {
                return _this2.figure.blocks.map(function (item) {
                    return item[position] += shift;
                });
            });
        }
    }, {
        key: 'redrawElement',
        value: function redrawElement(filterFunc) {
            this.drawElementOnBoard();
            filterFunc();
            this.drawElementOnBoard(this.figure.color);
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
var map = void 0,
    localStorageObject = {
    addValueToStorage: function addValueToStorage(name, score) {
        if (!map.has(name) || map.has(name) && map.get(name) < score) {
            map.set(name, score);
        }
    },
    getFromStorage: function getFromStorage() {
        map = new Map();
        if (localStorage.length !== 0) {
            for (var i = 0; i < localStorage.length; ++i) {
                map.set(localStorage.key(i), localStorage.getItem(localStorage.key(i)));
            }

            localStorage.clear();
        }

        return map;
    },
    updateStorage: function updateStorage() {
        map.forEach(function (value, key) {
            localStorage.setItem(key, value);
        });
    }
};

exports.localStorageObject = localStorageObject;

/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgZjhmOTE1YWJmMGUzMmM0ZDI1YTIiLCJ3ZWJwYWNrOi8vLy4vc2NyaXB0cy9HYW1lQm9hcmQuY2xhc3MuanMiLCJ3ZWJwYWNrOi8vLy4vc2NyaXB0cy9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9zY3JpcHRzL0VtcHR5QmxvY2suY2xhc3MuanMiLCJ3ZWJwYWNrOi8vLy4vc2NyaXB0cy9GaWd1cmUuY2xhc3MuanMiLCJ3ZWJwYWNrOi8vLy4vc2NyaXB0cy9sb2NhbFN0b3JhZ2UuanMiXSwibmFtZXMiOlsiR0FNRV9CT0FSRF9TSVpFIiwiTUlOX1NQRUVEIiwiU1BFRURfUkVEVUNUSU9OIiwiYmxvY2tzT25QYWdlIiwiY3VycmVudFNjb3JlIiwiY3VycmVudFNwZWVkIiwiZWxlbWVudHNPbkJvYXJkIiwiaW50ZXJ2YWxJRCIsImdhbWVGaW5pc2hlZEZsYWciLCJzZXRJbml0VmFsdWVzIiwicGFyc2VJbnQiLCJnZXRGcm9tU3RvcmFnZSIsImdldCIsIkdhbWVCb2FyZCIsIm51bWJlck9mQmxvY2tzIiwic2l6ZSIsInNjb3JlRWxlbWVudCIsImRvY3VtZW50IiwiZ2V0RWxlbWVudEJ5SWQiLCJ1cGRhdGVTY29yZUVsZW1lbnQiLCJkcmF3R2FtZUJvYXJkIiwic3RhcnRHYW1lIiwibmV3RWxlbSIsInBvaW50c1hPZk5ld0VsZW0iLCJmaWd1cmUiLCJibG9ja3MiLCJtYXAiLCJpdGVtIiwibWlkZGxlIiwiTWF0aCIsImZsb29yIiwibWF4IiwiY2FuQWRkVG9Cb2FyZCIsInB1c2giLCJmaW5pc2hHYW1lIiwiZHJhd0VsZW1lbnRPbkJvYXJkIiwiY29sb3IiLCJpIiwiaXNFbXB0eSIsImluY2x1ZGVzIiwibGV2ZWx1cCIsImZvckVhY2giLCJyZWRyYXdFbGVtZW50IiwiZmlsdGVyIiwiZWxlbSIsImxlbmd0aCIsImdhbWVCb2FyZCIsImNyZWF0ZUVsZW1lbnQiLCJjbGFzc05hbWUiLCJib2R5IiwiYXBwZW5kQ2hpbGQiLCJzZXRXaWR0aCIsInRvRml4ZWQiLCJqIiwiYm94IiwiZXZlbnQiLCJzaGlmdCIsImVsZW1lbnQiLCJrZXlDb2RlIiwidW5kZWZpbmVkIiwiY2FuTW92ZUVsZW1lbnQiLCJtb3ZlQmxvY2siLCJyZW1vdmVFdmVudExpc3RlbmVyIiwiZXhlY3V0ZUtleURvd25BY3Rpb24iLCJ1cGRhdGVTdG9yYWdlIiwiY2xlYXJJbnRlcnZhbCIsImFkZFZhbHVlVG9TdG9yYWdlIiwiYWRkRXZlbnRMaXN0ZW5lciIsImFkZE5ld0VsZW1lbnQiLCJzZXRJbnRlcnZhbCIsImluZGV4IiwiY2hlY2tTY29yZSIsImlubmVyVGV4dCIsImJsb2NrIiwiY2hhbmdlQmxvY2tTdHlsZSIsImVyciIsInF1ZXJ5U2VsZWN0b3IiLCJpbml0IiwiYm9hcmQiLCJnZXRJbnB1dFZhbHVlIiwidmFsdWUiLCJyZW1vdmVDaGlsZCIsImRlZmF1bHRDb2xvciIsIndpZHRoIiwiRW1wdHlCbG9jayIsInN0eWxlIiwiaGVpZ2h0IiwiYmFja2dyb3VuZENvbG9yIiwiQkxPQ0tTIiwiRmlndXJlIiwiT2JqZWN0IiwiYXNzaWduIiwicmFuZG9tIiwiY2FuQWRkIiwidHJ5QWRkQmxvY2siLCJwb3NzaWJsZU5ld1Bvc2l0aW9uIiwiY2FuTW92ZSIsInRvU3RyaW5nIiwiZHJhd0Jsb2NrIiwicG9zaXRpb24iLCJmaWx0ZXJGdW5jIiwibG9jYWxTdG9yYWdlT2JqZWN0IiwibmFtZSIsInNjb3JlIiwiaGFzIiwic2V0IiwiTWFwIiwibG9jYWxTdG9yYWdlIiwia2V5IiwiZ2V0SXRlbSIsImNsZWFyIiwic2V0SXRlbSJdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFD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LFVBQUN1QyxLQUFELEVBQVE0QixHQUFSLEVBQWdCO0FBQ3hCRCx5QkFBYUksT0FBYixDQUFxQkgsR0FBckIsRUFBMEI1QixLQUExQjtBQUNILFNBRkQ7QUFHSDtBQXRCZ0IsQ0FEekI7O1FBMEJRcUIsa0IsR0FBQUEsa0IiLCJmaWxlIjoiLi9kaXN0L2J1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGdldHRlclxuIFx0XHRcdH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDEpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIGY4ZjkxNWFiZjBlMzJjNGQyNWEyIiwiaW1wb3J0IHtFbXB0eUJsb2NrfSBmcm9tICcuL0VtcHR5QmxvY2suY2xhc3MnO1xuaW1wb3J0IHtGaWd1cmV9IGZyb20gJy4vRmlndXJlLmNsYXNzJztcbmltcG9ydCB7bG9jYWxTdG9yYWdlT2JqZWN0fSBmcm9tICcuL2xvY2FsU3RvcmFnZSc7XG5cbmNvbnN0IEdBTUVfQk9BUkRfU0laRSA9IDU1MCxcbiAgICBNSU5fU1BFRUQgPSAxMDAwLFxuICAgIFNQRUVEX1JFRFVDVElPTiA9IDUwMDtcblxubGV0IGJsb2Nrc09uUGFnZSxcbiAgICBjdXJyZW50U2NvcmUsXG4gICAgY3VycmVudFNwZWVkLFxuICAgIGVsZW1lbnRzT25Cb2FyZCxcbiAgICBpbnRlcnZhbElELFxuICAgIGdhbWVGaW5pc2hlZEZsYWc7XG5cbmZ1bmN0aW9uIHNldEluaXRWYWx1ZXMoKSB7XG4gICAgYmxvY2tzT25QYWdlID0gW107XG4gICAgY3VycmVudFNwZWVkID0gMjUwMDtcbiAgICBjdXJyZW50U2NvcmUgPSBwYXJzZUludChsb2NhbFN0b3JhZ2VPYmplY3QuZ2V0RnJvbVN0b3JhZ2UoKS5nZXQoJ2N1cnJlbnRTY29yZScpKSB8fCAwO1xuICAgIGVsZW1lbnRzT25Cb2FyZCA9IFtdO1xuICAgIGdhbWVGaW5pc2hlZEZsYWcgPSBmYWxzZTtcbn1cblxuZXhwb3J0IGNsYXNzIEdhbWVCb2FyZCB7XG4gICAgY29uc3RydWN0b3IobnVtYmVyT2ZCbG9ja3MpIHtcbiAgICAgICAgdGhpcy5zaXplID0gbnVtYmVyT2ZCbG9ja3M7XG4gICAgICAgIHRoaXMuc2NvcmVFbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Njb3JlJyk7XG4gICAgICAgIHRoaXMudXBkYXRlU2NvcmVFbGVtZW50KCk7XG4gICAgICAgIHNldEluaXRWYWx1ZXMoKTtcbiAgICAgICAgdGhpcy5kcmF3R2FtZUJvYXJkKCk7XG4gICAgICAgIHRoaXMuc3RhcnRHYW1lKCk7XG4gICAgfVxuXG4gICAgZ2V0IG1pZGRsZSgpIHtcbiAgICAgICAgcmV0dXJuIE1hdGguZmxvb3IodGhpcy5zaXplIC8gMik7XG4gICAgfVxuXG4gICAgYWRkTmV3RWxlbWVudCgpIHtcbiAgICAgICAgbGV0IG5ld0VsZW0gPSBuZXcgRmlndXJlKCksXG4gICAgICAgICAgICBwb2ludHNYT2ZOZXdFbGVtID0gbmV3RWxlbS5maWd1cmUuYmxvY2tzLm1hcChpdGVtID0+IGl0ZW1bMV0pLFxuICAgICAgICAgICAgbWlkZGxlID0gdGhpcy5taWRkbGUgLSBNYXRoLmZsb29yKE1hdGgubWF4KC4uLnBvaW50c1hPZk5ld0VsZW0pIC8gMik7XG5cbiAgICAgICAgbmV3RWxlbS5maWd1cmUuYmxvY2tzID0gbmV3RWxlbS5maWd1cmUuYmxvY2tzLm1hcChpdGVtID0+IFtpdGVtWzBdLCBpdGVtWzFdICsgbWlkZGxlXSk7XG5cbiAgICAgICAgaWYgKG5ld0VsZW0uY2FuQWRkVG9Cb2FyZCgpKSB7XG4gICAgICAgICAgICBlbGVtZW50c09uQm9hcmQucHVzaChuZXdFbGVtKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuZmluaXNoR2FtZSgpO1xuICAgICAgICB9XG4gICAgICAgIG5ld0VsZW0uZHJhd0VsZW1lbnRPbkJvYXJkKG5ld0VsZW0uZmlndXJlLmNvbG9yKTtcbiAgICB9XG5cbiAgICBjaGVja1Njb3JlKCkge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGJsb2Nrc09uUGFnZS5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgaWYoIWJsb2Nrc09uUGFnZVtpXS5tYXAoaXRlbSA9PiBpdGVtLmlzRW1wdHkoKSkuaW5jbHVkZXModHJ1ZSkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmxldmVsdXAoKTtcbiAgICAgICAgICAgICAgICBlbGVtZW50c09uQm9hcmQuZm9yRWFjaChpdGVtID0+IGl0ZW0ucmVkcmF3RWxlbWVudCgoKSA9PiBpdGVtLmZpZ3VyZS5ibG9ja3MgPSBpdGVtLmZpZ3VyZS5ibG9ja3MuZmlsdGVyKGVsZW0gPT4gZWxlbVswXSAhPT0gaSkpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGVsZW1lbnRzT25Cb2FyZCA9IGVsZW1lbnRzT25Cb2FyZC5maWx0ZXIoZWxlbSA9PiBlbGVtLmZpZ3VyZS5ibG9ja3MubGVuZ3RoICE9PSAwKTtcbiAgICB9XG5cbiAgICBkcmF3R2FtZUJvYXJkKCkge1xuICAgICAgICB0aGlzLmdhbWVCb2FyZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICB0aGlzLmdhbWVCb2FyZC5jbGFzc05hbWUgPSAnZ2FtZSc7XG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGhpcy5nYW1lQm9hcmQpO1xuICAgICAgICBFbXB0eUJsb2NrLnNldFdpZHRoKChHQU1FX0JPQVJEX1NJWkUgLyB0aGlzLnNpemUpLnRvRml4ZWQoMSkgKyAncHgnKTtcblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuc2l6ZTsgKytpKSB7XG4gICAgICAgICAgICBibG9ja3NPblBhZ2UucHVzaChbXSk7XG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHRoaXMuc2l6ZTsgKytqKSB7XG4gICAgICAgICAgICAgICAgYmxvY2tzT25QYWdlW2ldW2pdID0gbmV3IEVtcHR5QmxvY2soR0FNRV9CT0FSRF9TSVpFLCB0aGlzLnNpemUpO1xuICAgICAgICAgICAgICAgIHRoaXMuZ2FtZUJvYXJkLmFwcGVuZENoaWxkKGJsb2Nrc09uUGFnZVtpXVtqXS5ib3gpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZXhlY3V0ZUtleURvd25BY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgbGV0IHNoaWZ0LFxuICAgICAgICAgICAgZWxlbWVudCA9IGVsZW1lbnRzT25Cb2FyZFtlbGVtZW50c09uQm9hcmQubGVuZ3RoIC0gMV07XG5cbiAgICAgICAgc3dpdGNoKGV2ZW50LmtleUNvZGUpIHtcbiAgICAgICAgY2FzZSAzNzogc2hpZnQgPSAtMTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDM5OiBzaGlmdCA9IDE7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgZGVmYXVsdDogc2hpZnQgPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoc2hpZnQgJiYgZWxlbWVudC5jYW5Nb3ZlRWxlbWVudChbMCwgc2hpZnRdKSkge1xuICAgICAgICAgICAgZWxlbWVudC5tb3ZlQmxvY2soMSwgc2hpZnQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZmluaXNoR2FtZSgpIHtcbiAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIHRoaXMuZXhlY3V0ZUtleURvd25BY3Rpb24pO1xuICAgICAgICBsb2NhbFN0b3JhZ2VPYmplY3QudXBkYXRlU3RvcmFnZSgpO1xuICAgICAgICBnYW1lRmluaXNoZWRGbGFnID0gdHJ1ZTtcbiAgICAgICAgY2xlYXJJbnRlcnZhbChpbnRlcnZhbElEKTtcbiAgICB9XG5cbiAgICBsZXZlbHVwKCkge1xuICAgICAgICBjdXJyZW50U2NvcmUgKz0gdGhpcy5zaXplO1xuICAgICAgICBsb2NhbFN0b3JhZ2VPYmplY3QuYWRkVmFsdWVUb1N0b3JhZ2UoJ2N1cnJlbnRTY29yZScsIGN1cnJlbnRTY29yZSk7XG4gICAgICAgIHRoaXMudXBkYXRlU2NvcmVFbGVtZW50KCk7XG5cbiAgICAgICAgY3VycmVudFNwZWVkID0gY3VycmVudFNwZWVkID09PSBNSU5fU1BFRUQgPyBjdXJyZW50U3BlZWQgOiBjdXJyZW50U3BlZWQgLSBTUEVFRF9SRURVQ1RJT047XG4gICAgfVxuXG4gICAgc3RhcnRHYW1lKCkge1xuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgdGhpcy5leGVjdXRlS2V5RG93bkFjdGlvbik7XG4gICAgICAgIGNsZWFySW50ZXJ2YWwoaW50ZXJ2YWxJRCk7XG4gICAgICAgIHRoaXMuYWRkTmV3RWxlbWVudCgpO1xuICAgICAgICBpbnRlcnZhbElEID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgICAgICAgICAgZWxlbWVudHNPbkJvYXJkLmZvckVhY2goKGl0ZW0sIGluZGV4KSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGl0ZW0uY2FuTW92ZUVsZW1lbnQoWzEsIDBdKSkge1xuICAgICAgICAgICAgICAgICAgICBpdGVtLm1vdmVCbG9jaygwLCAxKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpZiAoaW5kZXggPT09IGVsZW1lbnRzT25Cb2FyZC5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNoZWNrU2NvcmUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghZ2FtZUZpbmlzaGVkRmxhZykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYWRkTmV3RWxlbWVudCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfSwgY3VycmVudFNwZWVkKTtcbiAgICB9XG5cbiAgICB1cGRhdGVTY29yZUVsZW1lbnQoKSB7XG4gICAgICAgIHRoaXMuc2NvcmVFbGVtZW50LmlubmVyVGV4dCA9IGN1cnJlbnRTY29yZSB8fCAwO1xuICAgIH1cblxuICAgIHN0YXRpYyBkcmF3QmxvY2soYmxvY2ssIGNvbG9yKSB7XG4gICAgICAgIGJsb2Nrc09uUGFnZVtibG9ja1swXV1bYmxvY2tbMV1dLmNoYW5nZUJsb2NrU3R5bGUoY29sb3IpO1xuICAgIH1cblxuICAgIHN0YXRpYyB0cnlBZGRCbG9jayhibG9jaykge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgcmV0dXJuIGJsb2Nrc09uUGFnZVtibG9ja1swXV1bYmxvY2tbMV1dLmlzRW1wdHkoKTtcbiAgICAgICAgfSBjYXRjaChlcnIpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NjcmlwdHMvR2FtZUJvYXJkLmNsYXNzLmpzIiwiaW1wb3J0IHtHYW1lQm9hcmR9IGZyb20gJy4vR2FtZUJvYXJkLmNsYXNzJztcblxuZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3N0YXJ0JykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBpbml0KTtcblxubGV0IGJvYXJkO1xuXG5mdW5jdGlvbiBpbml0KCkge1xuICAgIGZ1bmN0aW9uIGdldElucHV0VmFsdWUoKSB7XG4gICAgICAgIGxldCB2YWx1ZSA9ICtkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjbnVtYmVyJykudmFsdWU7XG5cbiAgICAgICAgcmV0dXJuIHZhbHVlID49IDkgJiYgdmFsdWUgPD0gMTUgPyB2YWx1ZSA6IDk7XG4gICAgfVxuXG4gICAgaWYgKGJvYXJkKSB7XG4gICAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQoYm9hcmQuZ2FtZUJvYXJkKTtcbiAgICB9XG5cbiAgICBib2FyZCA9IG5ldyBHYW1lQm9hcmQoZ2V0SW5wdXRWYWx1ZSgpKTtcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NjcmlwdHMvaW5kZXguanMiLCJsZXQgZGVmYXVsdENvbG9yID0gJ3JnYigyMTYsIDIxNiwgMjE2KScsXG4gICAgd2lkdGg7XG5cbmV4cG9ydCBjbGFzcyBFbXB0eUJsb2NrIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5ib3ggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgdGhpcy5ib3guY2xhc3NOYW1lID0gJ2Jsb2NrLWVtcHR5JztcbiAgICAgICAgdGhpcy5ib3guc3R5bGUud2lkdGggPSB0aGlzLmJveC5zdHlsZS5oZWlnaHQgPSB3aWR0aDtcbiAgICAgICAgdGhpcy5ib3guc3R5bGUuYmFja2dyb3VuZENvbG9yID0gZGVmYXVsdENvbG9yO1xuICAgIH1cblxuICAgIGNoYW5nZUJsb2NrU3R5bGUoY29sb3IpIHtcbiAgICAgICAgdGhpcy5ib3guc3R5bGUuYmFja2dyb3VuZENvbG9yID0gY29sb3IgfHwgZGVmYXVsdENvbG9yO1xuICAgIH1cblxuICAgIGlzRW1wdHkoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmJveC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPT09IGRlZmF1bHRDb2xvcjtcbiAgICB9XG5cbiAgICBzdGF0aWMgc2V0V2lkdGgodmFsdWUpIHtcbiAgICAgICAgd2lkdGggPSB2YWx1ZTtcbiAgICB9XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zY3JpcHRzL0VtcHR5QmxvY2suY2xhc3MuanMiLCJpbXBvcnQge0dhbWVCb2FyZH0gZnJvbSAnLi9HYW1lQm9hcmQuY2xhc3MnO1xuXG5jb25zdCBCTE9DS1MgPSBbXG4gICAge1xuICAgICAgICBjb2xvcjogJyM4MUY3RjMnLFxuICAgICAgICBibG9ja3M6IFtbMCwgMF0sIFswLCAxXSwgWzAsIDJdLCBbMCwgM11dXG4gICAgfSxcbiAgICB7XG4gICAgICAgIGNvbG9yOiAnIzgxODFGNycsXG4gICAgICAgIGJsb2NrczogW1swLCAwXSwgWzAsIDFdLCBbMCwgMl0sIFsxLCAyXV1cbiAgICB9LFxuICAgIHtcbiAgICAgICAgY29sb3I6ICcjRkU5QTJFJyxcbiAgICAgICAgYmxvY2tzOiBbWzAsIDBdLCBbMCwgMV0sIFswLCAyXSwgWzEsIDBdXVxuICAgIH0sXG4gICAge1xuICAgICAgICBjb2xvcjogJyNGM0Y3ODEnLFxuICAgICAgICBibG9ja3M6IFtbMCwgMF0sIFswLCAxXSwgWzEsIDBdLCBbMSwgMV1dXG4gICAgfSxcbiAgICB7XG4gICAgICAgIGNvbG9yOiAnIzgxRjc4MScsXG4gICAgICAgIGJsb2NrczogW1swLCAxXSwgWzAsIDJdLCBbMSwgMF0sIFsxLCAxXV1cbiAgICB9LFxuICAgIHtcbiAgICAgICAgY29sb3I6ICcjREE4MUY1JyxcbiAgICAgICAgYmxvY2tzOiBbWzAsIDBdLCBbMCwgMV0sIFswLCAyXSwgWzEsIDFdXVxuICAgIH0sXG4gICAge1xuICAgICAgICBjb2xvcjogJyNGNzgxODEnLFxuICAgICAgICBibG9ja3M6IFtbMCwgMF0sIFswLCAxXSwgWzEsIDFdLCBbMSwgMl1dXG4gICAgfVxuXTtcblxuZXhwb3J0IGNsYXNzIEZpZ3VyZSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuZmlndXJlID0gT2JqZWN0LmFzc2lnbih7fSwgQkxPQ0tTW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDcpXSk7XG4gICAgfVxuXG4gICAgY2FuQWRkVG9Cb2FyZCgpIHtcbiAgICAgICAgbGV0IGNhbkFkZCA9IHRydWU7XG5cbiAgICAgICAgdGhpcy5maWd1cmUuYmxvY2tzLmZvckVhY2goaXRlbSA9PiBjYW5BZGQgPSBjYW5BZGQgJiYgR2FtZUJvYXJkLnRyeUFkZEJsb2NrKGl0ZW0pKTtcblxuICAgICAgICByZXR1cm4gY2FuQWRkO1xuICAgIH1cblxuICAgIGNhbk1vdmVFbGVtZW50KHNoaWZ0KSB7XG4gICAgICAgIGxldCBwb3NzaWJsZU5ld1Bvc2l0aW9uID0gdGhpcy5maWd1cmUuYmxvY2tzLm1hcChpdGVtID0+IFtpdGVtWzBdICsgc2hpZnRbMF0sIGl0ZW1bMV0gKyBzaGlmdFsxXV0pLFxuICAgICAgICAgICAgY2FuTW92ZSA9IHRydWU7XG5cbiAgICAgICAgcG9zc2libGVOZXdQb3NpdGlvbi5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgICAgICAgaWYgKCF0aGlzLmZpZ3VyZS5ibG9ja3MubWFwKGl0ZW0gPT4gaXRlbS50b1N0cmluZygpKS5pbmNsdWRlcyhpdGVtLnRvU3RyaW5nKCkpKSB7XG4gICAgICAgICAgICAgICAgY2FuTW92ZSA9IGNhbk1vdmUgJiYgR2FtZUJvYXJkLnRyeUFkZEJsb2NrKGl0ZW0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gY2FuTW92ZTtcbiAgICB9XG5cbiAgICBkcmF3RWxlbWVudE9uQm9hcmQoY29sb3IpIHtcbiAgICAgICAgdGhpcy5maWd1cmUuYmxvY2tzLm1hcChpdGVtID0+IEdhbWVCb2FyZC5kcmF3QmxvY2soaXRlbSwgY29sb3IpKTtcbiAgICB9XG5cbiAgICBtb3ZlQmxvY2socG9zaXRpb24sIHNoaWZ0KSB7XG4gICAgICAgIHRoaXMucmVkcmF3RWxlbWVudCgoKSA9PiB0aGlzLmZpZ3VyZS5ibG9ja3MubWFwKGl0ZW0gPT4gaXRlbVtwb3NpdGlvbl0gKz0gc2hpZnQpKTtcbiAgICB9XG5cbiAgICByZWRyYXdFbGVtZW50KGZpbHRlckZ1bmMpIHtcbiAgICAgICAgdGhpcy5kcmF3RWxlbWVudE9uQm9hcmQoKTtcbiAgICAgICAgZmlsdGVyRnVuYygpO1xuICAgICAgICB0aGlzLmRyYXdFbGVtZW50T25Cb2FyZCh0aGlzLmZpZ3VyZS5jb2xvcik7XG4gICAgfVxufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc2NyaXB0cy9GaWd1cmUuY2xhc3MuanMiLCJsZXQgbWFwLFxuICAgIGxvY2FsU3RvcmFnZU9iamVjdCA9IHtcbiAgICAgICAgYWRkVmFsdWVUb1N0b3JhZ2UobmFtZSwgc2NvcmUpIHtcbiAgICAgICAgICAgIGlmKCFtYXAuaGFzKG5hbWUpIHx8IChtYXAuaGFzKG5hbWUpICYmIG1hcC5nZXQobmFtZSkgPCBzY29yZSkpIHtcbiAgICAgICAgICAgICAgICBtYXAuc2V0KG5hbWUsIHNjb3JlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgZ2V0RnJvbVN0b3JhZ2UoKSB7XG4gICAgICAgICAgICBtYXAgPSBuZXcgTWFwKCk7XG4gICAgICAgICAgICBpZiAobG9jYWxTdG9yYWdlLmxlbmd0aCAhPT0gMCkge1xuICAgICAgICAgICAgICAgIGZvcihsZXQgaSA9IDA7IGkgPCBsb2NhbFN0b3JhZ2UubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgICAgICAgICAgbWFwLnNldChsb2NhbFN0b3JhZ2Uua2V5KGkpLCBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShsb2NhbFN0b3JhZ2Uua2V5KGkpKSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlLmNsZWFyKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBtYXA7XG4gICAgICAgIH0sXG4gICAgICAgIHVwZGF0ZVN0b3JhZ2UoKSB7XG4gICAgICAgICAgICBtYXAuZm9yRWFjaCgodmFsdWUsIGtleSkgPT4ge1xuICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGtleSwgdmFsdWUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9O1xuXG5leHBvcnQge2xvY2FsU3RvcmFnZU9iamVjdH07XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zY3JpcHRzL2xvY2FsU3RvcmFnZS5qcyJdLCJzb3VyY2VSb290IjoiIn0=