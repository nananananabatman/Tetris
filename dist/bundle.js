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
    MIN_SPEED = 500,
    SPEED_REDUCTION = 500;

var blocksOnPage = void 0,
    currentScore = void 0,
    currentSpeed = void 0,
    elementsOnBoard = void 0,
    intervalID = void 0,
    gameFinishedFlag = void 0;

var GameBoard = exports.GameBoard = function () {
    function GameBoard(numberOfBlocks) {
        _classCallCheck(this, GameBoard);

        this.size = numberOfBlocks;
        this.scoreElement = document.getElementById('score');
        this.updateScoreElement();
        this.setInitValues();
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
            this.gameBoard.tabIndex = '-1';
            document.body.appendChild(this.gameBoard);
            this.gameBoard.focus();
            _EmptyBlock.EmptyBlock.setWidth((GAME_BOARD_SIZE / this.size).toFixed(2) + 'px');

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
                case 32:
                    if (element.figure.center !== undefined) {
                        element.rotateFigure();
                    }
                    break;
                case 37:
                    element.moveLeft();
                    break;
                case 39:
                    element.moveRight();
                    break;
                default:
                    return;
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
            this.updateGameSpeed();
        }
    }, {
        key: 'setInitValues',
        value: function setInitValues() {
            switch (gameFinishedFlag) {
                case true:
                case 'undefined':
                    currentScore = 0;
                    break;
                default:
                    currentScore = parseInt(_localStorage.localStorageObject.getFromStorage().get('currentScore')) || 0;
            }

            blocksOnPage = [];
            currentSpeed = 1500;
            elementsOnBoard = [];
            gameFinishedFlag = false;
        }
    }, {
        key: 'startGame',
        value: function startGame() {
            this.updateScoreElement();
            document.addEventListener('keydown', this.executeKeyDownAction);
            this.addNewElement();
            this.updateGameSpeed();
        }
    }, {
        key: 'updateGameSpeed',
        value: function updateGameSpeed() {
            var _this2 = this;

            clearInterval(intervalID);
            intervalID = setInterval(function () {
                elementsOnBoard.forEach(function (item, index) {
                    if (item.moveDown()) {} else {
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
    center: 1,
    color: '#81F7F3',
    blocks: [[0, 0], [0, 1], [0, 2], [0, 3]],
    currentPosition: 0,
    specialRotate: true
}, {
    center: 1,
    color: '#8181F7',
    blocks: [[0, 0], [0, 1], [0, 2], [1, 2]]
}, {
    center: 1,
    color: '#FE9A2E',
    blocks: [[0, 0], [0, 1], [0, 2], [1, 0]]
}, {
    color: '#F3F781',
    blocks: [[0, 0], [0, 1], [1, 0], [1, 1]]
}, {
    center: 0,
    color: '#81F781',
    blocks: [[0, 1], [0, 2], [1, 0], [1, 1]]
}, {
    center: 1,
    color: '#DA81F5',
    blocks: [[0, 0], [0, 1], [0, 2], [1, 1]]
}, {
    center: 1,
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
            var possibleNewPosition = this.figure.blocks.map(function (item) {
                return [item[0] + shift[0], item[1] + shift[1]];
            });

            return this.isFigurePosCorrect(possibleNewPosition);
        }
    }, {
        key: 'drawElementOnBoard',
        value: function drawElementOnBoard(color) {
            this.figure.blocks.map(function (item) {
                return _GameBoard.GameBoard.drawBlock(item, color);
            });
        }
    }, {
        key: 'isFigurePosCorrect',
        value: function isFigurePosCorrect(blocks) {
            var _this = this;

            var canMove = true;

            blocks.forEach(function (item) {
                if (!_this.figure.blocks.map(function (item) {
                    return item.toString();
                }).includes(item.toString())) {
                    canMove = canMove && _GameBoard.GameBoard.tryAddBlock(item);
                }
            });

            return canMove;
        }
    }, {
        key: 'moveBlock',
        value: function moveBlock(position, shift) {
            var _this2 = this;

            if (this.canMoveElement(shift)) {
                this.redrawElement(function () {
                    return _this2.figure.blocks.map(function (item) {
                        return item[position] += shift[position];
                    });
                });
                return true;
            }

            return false;
        }
    }, {
        key: 'moveDown',
        value: function moveDown() {
            return this.moveBlock(0, [1, 0]);
        }
    }, {
        key: 'moveLeft',
        value: function moveLeft() {
            return this.moveBlock(1, [0, -1]);
        }
    }, {
        key: 'moveRight',
        value: function moveRight() {
            return this.moveBlock(1, [0, 1]);
        }
    }, {
        key: 'redrawElement',
        value: function redrawElement(changeFigureFunc) {
            this.drawElementOnBoard();
            if (changeFigureFunc instanceof Function) {
                changeFigureFunc();
            }
            this.drawElementOnBoard(this.figure.color);
        }
    }, {
        key: 'rotateFigure',
        value: function rotateFigure() {
            var _this3 = this;

            var angle = Math.PI / 2,
                center = this.figure.blocks[this.figure.center],
                currentPosition = this.figure.currentPosition,
                oldPosX = void 0,
                oldPosY = void 0,
                rotatedFigureBlocks = void 0;

            if (this.figure.specialRotate) {
                if (currentPosition % 2 === 1) {
                    angle = -Math.PI / 2;
                }
                currentPosition = (currentPosition + 1) % 4;
            }

            rotatedFigureBlocks = this.figure.blocks.map(function (item) {
                if (item === center) {
                    return item;
                }
                oldPosX = item[0];
                oldPosY = item[1];

                return [(oldPosX - center[0]) * Math.cos(angle) - (oldPosY - center[1]) * Math.sin(angle) + center[0], (oldPosX - center[0]) * Math.sin(angle) + (oldPosY - center[1]) * Math.cos(angle) + center[1]];
            });

            if (this.isFigurePosCorrect(rotatedFigureBlocks)) {
                if (this.figure.specialRotate) {
                    this.figure.currentPosition = currentPosition;
                }
                this.redrawElement(function () {
                    _this3.figure.blocks = rotatedFigureBlocks;
                });
            }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNzY5YTcxZGE3MTRjYTQyMjhmZWUiLCJ3ZWJwYWNrOi8vLy4vc2NyaXB0cy9HYW1lQm9hcmQuY2xhc3MuanMiLCJ3ZWJwYWNrOi8vLy4vc2NyaXB0cy9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9zY3JpcHRzL0VtcHR5QmxvY2suY2xhc3MuanMiLCJ3ZWJwYWNrOi8vLy4vc2NyaXB0cy9GaWd1cmUuY2xhc3MuanMiLCJ3ZWJwYWNrOi8vLy4vc2NyaXB0cy9sb2NhbFN0b3JhZ2UuanMiXSwibmFtZXMiOlsiR0FNRV9CT0FSRF9TSVpFIiwiTUlOX1NQRUVEIiwiU1BFRURfUkVEVUNUSU9OIiwiYmxvY2tzT25QYWdlIiwiY3VycmVudFNjb3JlIiwiY3VycmVudFNwZWVkIiwiZWxlbWVudHNPbkJvYXJkIiwiaW50ZXJ2YWxJRCIsImdhbWVGaW5pc2hlZEZsYWciLCJHYW1lQm9hcmQiLCJudW1iZXJPZkJsb2NrcyIsInNpemUiLCJzY29yZUVsZW1lbnQiLCJkb2N1bWVudCIsImdldEVsZW1lbnRCeUlkIiwidXBkYXRlU2NvcmVFbGVtZW50Iiwic2V0SW5pdFZhbHVlcyIsImRyYXdHYW1lQm9hcmQiLCJzdGFydEdhbWUiLCJuZXdFbGVtIiwicG9pbnRzWE9mTmV3RWxlbSIsImZpZ3VyZSIsImJsb2NrcyIsIm1hcCIsIml0ZW0iLCJtaWRkbGUiLCJNYXRoIiwiZmxvb3IiLCJtYXgiLCJjYW5BZGRUb0JvYXJkIiwicHVzaCIsImZpbmlzaEdhbWUiLCJkcmF3RWxlbWVudE9uQm9hcmQiLCJjb2xvciIsImkiLCJpc0VtcHR5IiwiaW5jbHVkZXMiLCJsZXZlbHVwIiwiZm9yRWFjaCIsInJlZHJhd0VsZW1lbnQiLCJmaWx0ZXIiLCJlbGVtIiwibGVuZ3RoIiwiZ2FtZUJvYXJkIiwiY3JlYXRlRWxlbWVudCIsImNsYXNzTmFtZSIsInRhYkluZGV4IiwiYm9keSIsImFwcGVuZENoaWxkIiwiZm9jdXMiLCJzZXRXaWR0aCIsInRvRml4ZWQiLCJqIiwiYm94IiwiZXZlbnQiLCJzaGlmdCIsImVsZW1lbnQiLCJrZXlDb2RlIiwiY2VudGVyIiwidW5kZWZpbmVkIiwicm90YXRlRmlndXJlIiwibW92ZUxlZnQiLCJtb3ZlUmlnaHQiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwiZXhlY3V0ZUtleURvd25BY3Rpb24iLCJ1cGRhdGVTdG9yYWdlIiwiY2xlYXJJbnRlcnZhbCIsImFkZFZhbHVlVG9TdG9yYWdlIiwidXBkYXRlR2FtZVNwZWVkIiwicGFyc2VJbnQiLCJnZXRGcm9tU3RvcmFnZSIsImdldCIsImFkZEV2ZW50TGlzdGVuZXIiLCJhZGROZXdFbGVtZW50Iiwic2V0SW50ZXJ2YWwiLCJpbmRleCIsIm1vdmVEb3duIiwiY2hlY2tTY29yZSIsImlubmVyVGV4dCIsImJsb2NrIiwiY2hhbmdlQmxvY2tTdHlsZSIsImVyciIsInF1ZXJ5U2VsZWN0b3IiLCJpbml0IiwiYm9hcmQiLCJnZXRJbnB1dFZhbHVlIiwidmFsdWUiLCJyZW1vdmVDaGlsZCIsImRlZmF1bHRDb2xvciIsIndpZHRoIiwiRW1wdHlCbG9jayIsInN0eWxlIiwiaGVpZ2h0IiwiYmFja2dyb3VuZENvbG9yIiwiQkxPQ0tTIiwiY3VycmVudFBvc2l0aW9uIiwic3BlY2lhbFJvdGF0ZSIsIkZpZ3VyZSIsIk9iamVjdCIsImFzc2lnbiIsInJhbmRvbSIsImNhbkFkZCIsInRyeUFkZEJsb2NrIiwicG9zc2libGVOZXdQb3NpdGlvbiIsImlzRmlndXJlUG9zQ29ycmVjdCIsImRyYXdCbG9jayIsImNhbk1vdmUiLCJ0b1N0cmluZyIsInBvc2l0aW9uIiwiY2FuTW92ZUVsZW1lbnQiLCJtb3ZlQmxvY2siLCJjaGFuZ2VGaWd1cmVGdW5jIiwiRnVuY3Rpb24iLCJhbmdsZSIsIlBJIiwib2xkUG9zWCIsIm9sZFBvc1kiLCJyb3RhdGVkRmlndXJlQmxvY2tzIiwiY29zIiwic2luIiwibG9jYWxTdG9yYWdlT2JqZWN0IiwibmFtZSIsInNjb3JlIiwiaGFzIiwic2V0IiwiTWFwIiwibG9jYWxTdG9yYWdlIiwia2V5IiwiZ2V0SXRlbSIsImNsZWFyIiwic2V0SXRlbSJdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFDdkQseUNBQWlDLGVBQWU7QUFDaEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOERBQXNELCtEQUErRDs7QUFFckg7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7OztBQzdEQTs7QUFDQTs7QUFDQTs7Ozs7O0FBRUEsSUFBTUEsa0JBQWtCLEdBQXhCO0FBQUEsSUFDSUMsWUFBWSxHQURoQjtBQUFBLElBRUlDLGtCQUFrQixHQUZ0Qjs7QUFJQSxJQUFJQyxxQkFBSjtBQUFBLElBQ0lDLHFCQURKO0FBQUEsSUFFSUMscUJBRko7QUFBQSxJQUdJQyx3QkFISjtBQUFBLElBSUlDLG1CQUpKO0FBQUEsSUFLSUMseUJBTEo7O0lBT2FDLFMsV0FBQUEsUztBQUNULHVCQUFZQyxjQUFaLEVBQTRCO0FBQUE7O0FBQ3hCLGFBQUtDLElBQUwsR0FBWUQsY0FBWjtBQUNBLGFBQUtFLFlBQUwsR0FBb0JDLFNBQVNDLGNBQVQsQ0FBd0IsT0FBeEIsQ0FBcEI7QUFDQSxhQUFLQyxrQkFBTDtBQUNBLGFBQUtDLGFBQUw7QUFDQSxhQUFLQyxhQUFMO0FBQ0EsYUFBS0MsU0FBTDtBQUNIOzs7O3dDQU1lO0FBQ1osZ0JBQUlDLFVBQVUsb0JBQWQ7QUFBQSxnQkFDSUMsbUJBQW1CRCxRQUFRRSxNQUFSLENBQWVDLE1BQWYsQ0FBc0JDLEdBQXRCLENBQTBCO0FBQUEsdUJBQVFDLEtBQUssQ0FBTCxDQUFSO0FBQUEsYUFBMUIsQ0FEdkI7QUFBQSxnQkFFSUMsU0FBUyxLQUFLQSxNQUFMLEdBQWNDLEtBQUtDLEtBQUwsQ0FBV0QsS0FBS0UsR0FBTCxnQ0FBWVIsZ0JBQVosS0FBZ0MsQ0FBM0MsQ0FGM0I7O0FBSUFELG9CQUFRRSxNQUFSLENBQWVDLE1BQWYsR0FBd0JILFFBQVFFLE1BQVIsQ0FBZUMsTUFBZixDQUFzQkMsR0FBdEIsQ0FBMEI7QUFBQSx1QkFBUSxDQUFDQyxLQUFLLENBQUwsQ0FBRCxFQUFVQSxLQUFLLENBQUwsSUFBVUMsTUFBcEIsQ0FBUjtBQUFBLGFBQTFCLENBQXhCOztBQUVBLGdCQUFJTixRQUFRVSxhQUFSLEVBQUosRUFBNkI7QUFDekJ2QixnQ0FBZ0J3QixJQUFoQixDQUFxQlgsT0FBckI7QUFDSCxhQUZELE1BRU87QUFDSCxxQkFBS1ksVUFBTDtBQUNIO0FBQ0RaLG9CQUFRYSxrQkFBUixDQUEyQmIsUUFBUUUsTUFBUixDQUFlWSxLQUExQztBQUNIOzs7cUNBRVk7QUFBQTs7QUFBQSx1Q0FDQUMsQ0FEQTtBQUVMLG9CQUFHLENBQUMvQixhQUFhK0IsQ0FBYixFQUFnQlgsR0FBaEIsQ0FBb0I7QUFBQSwyQkFBUUMsS0FBS1csT0FBTCxFQUFSO0FBQUEsaUJBQXBCLEVBQTRDQyxRQUE1QyxDQUFxRCxJQUFyRCxDQUFKLEVBQWdFO0FBQzVELDBCQUFLQyxPQUFMO0FBQ0EvQixvQ0FBZ0JnQyxPQUFoQixDQUF3QjtBQUFBLCtCQUFRZCxLQUFLZSxhQUFMLENBQW1CO0FBQUEsbUNBQU1mLEtBQUtILE1BQUwsQ0FBWUMsTUFBWixHQUFxQkUsS0FBS0gsTUFBTCxDQUFZQyxNQUFaLENBQW1Ca0IsTUFBbkIsQ0FBMEI7QUFBQSx1Q0FBUUMsS0FBSyxDQUFMLE1BQVlQLENBQXBCO0FBQUEsNkJBQTFCLENBQTNCO0FBQUEseUJBQW5CLENBQVI7QUFBQSxxQkFBeEI7QUFDSDtBQUxJOztBQUNULGlCQUFLLElBQUlBLElBQUksQ0FBYixFQUFnQkEsSUFBSS9CLGFBQWF1QyxNQUFqQyxFQUF5QyxFQUFFUixDQUEzQyxFQUE4QztBQUFBLHNCQUFyQ0EsQ0FBcUM7QUFLN0M7O0FBRUQ1Qiw4QkFBa0JBLGdCQUFnQmtDLE1BQWhCLENBQXVCO0FBQUEsdUJBQVFDLEtBQUtwQixNQUFMLENBQVlDLE1BQVosQ0FBbUJvQixNQUFuQixLQUE4QixDQUF0QztBQUFBLGFBQXZCLENBQWxCO0FBQ0g7Ozt3Q0FFZTtBQUNaLGlCQUFLQyxTQUFMLEdBQWlCOUIsU0FBUytCLGFBQVQsQ0FBdUIsS0FBdkIsQ0FBakI7QUFDQSxpQkFBS0QsU0FBTCxDQUFlRSxTQUFmLEdBQTJCLE1BQTNCO0FBQ0EsaUJBQUtGLFNBQUwsQ0FBZUcsUUFBZixHQUEwQixJQUExQjtBQUNBakMscUJBQVNrQyxJQUFULENBQWNDLFdBQWQsQ0FBMEIsS0FBS0wsU0FBL0I7QUFDQSxpQkFBS0EsU0FBTCxDQUFlTSxLQUFmO0FBQ0EsbUNBQVdDLFFBQVgsQ0FBb0IsQ0FBQ2xELGtCQUFrQixLQUFLVyxJQUF4QixFQUE4QndDLE9BQTlCLENBQXNDLENBQXRDLElBQTJDLElBQS9EOztBQUVBLGlCQUFLLElBQUlqQixJQUFJLENBQWIsRUFBZ0JBLElBQUksS0FBS3ZCLElBQXpCLEVBQStCLEVBQUV1QixDQUFqQyxFQUFvQztBQUNoQy9CLDZCQUFhMkIsSUFBYixDQUFrQixFQUFsQjtBQUNBLHFCQUFLLElBQUlzQixJQUFJLENBQWIsRUFBZ0JBLElBQUksS0FBS3pDLElBQXpCLEVBQStCLEVBQUV5QyxDQUFqQyxFQUFvQztBQUNoQ2pELGlDQUFhK0IsQ0FBYixFQUFnQmtCLENBQWhCLElBQXFCLDJCQUFlcEQsZUFBZixFQUFnQyxLQUFLVyxJQUFyQyxDQUFyQjtBQUNBLHlCQUFLZ0MsU0FBTCxDQUFlSyxXQUFmLENBQTJCN0MsYUFBYStCLENBQWIsRUFBZ0JrQixDQUFoQixFQUFtQkMsR0FBOUM7QUFDSDtBQUNKO0FBQ0o7Ozs2Q0FFb0JDLEssRUFBTztBQUN4QixnQkFBSUMsY0FBSjtBQUFBLGdCQUNJQyxVQUFVbEQsZ0JBQWdCQSxnQkFBZ0JvQyxNQUFoQixHQUF5QixDQUF6QyxDQURkOztBQUdBLG9CQUFPWSxNQUFNRyxPQUFiO0FBQ0EscUJBQUssRUFBTDtBQUNJLHdCQUFHRCxRQUFRbkMsTUFBUixDQUFlcUMsTUFBZixLQUEwQkMsU0FBN0IsRUFBd0M7QUFDcENILGdDQUFRSSxZQUFSO0FBQ0g7QUFDRDtBQUNKLHFCQUFLLEVBQUw7QUFDSUosNEJBQVFLLFFBQVI7QUFDQTtBQUNKLHFCQUFLLEVBQUw7QUFDSUwsNEJBQVFNLFNBQVI7QUFDQTtBQUNKO0FBQVM7QUFaVDtBQWNIOzs7cUNBRVk7QUFDVGpELHFCQUFTa0QsbUJBQVQsQ0FBNkIsU0FBN0IsRUFBd0MsS0FBS0Msb0JBQTdDO0FBQ0EsNkNBQW1CQyxhQUFuQjtBQUNBekQsK0JBQW1CLElBQW5CO0FBQ0EwRCwwQkFBYzNELFVBQWQ7QUFDSDs7O2tDQUVTO0FBQ05ILDRCQUFnQixLQUFLTyxJQUFyQjtBQUNBLDZDQUFtQndELGlCQUFuQixDQUFxQyxjQUFyQyxFQUFxRC9ELFlBQXJEO0FBQ0EsaUJBQUtXLGtCQUFMOztBQUVBViwyQkFBZUEsaUJBQWlCSixTQUFqQixHQUE2QkksWUFBN0IsR0FBNENBLGVBQWVILGVBQTFFO0FBQ0EsaUJBQUtrRSxlQUFMO0FBQ0g7Ozt3Q0FFZTtBQUNaLG9CQUFPNUQsZ0JBQVA7QUFDQSxxQkFBSyxJQUFMO0FBQ0EscUJBQUssV0FBTDtBQUNJSixtQ0FBZSxDQUFmO0FBQ0E7QUFDSjtBQUNJQSxtQ0FBZWlFLFNBQVMsaUNBQW1CQyxjQUFuQixHQUFvQ0MsR0FBcEMsQ0FBd0MsY0FBeEMsQ0FBVCxLQUFxRSxDQUFwRjtBQU5KOztBQVNBcEUsMkJBQWUsRUFBZjtBQUNBRSwyQkFBZSxJQUFmO0FBQ0FDLDhCQUFrQixFQUFsQjtBQUNBRSwrQkFBbUIsS0FBbkI7QUFDSDs7O29DQUVXO0FBQ1IsaUJBQUtPLGtCQUFMO0FBQ0FGLHFCQUFTMkQsZ0JBQVQsQ0FBMEIsU0FBMUIsRUFBcUMsS0FBS1Isb0JBQTFDO0FBQ0EsaUJBQUtTLGFBQUw7QUFDQSxpQkFBS0wsZUFBTDtBQUNIOzs7MENBRWlCO0FBQUE7O0FBQ2RGLDBCQUFjM0QsVUFBZDtBQUNBQSx5QkFBYW1FLFlBQVksWUFBTTtBQUMzQnBFLGdDQUFnQmdDLE9BQWhCLENBQXdCLFVBQUNkLElBQUQsRUFBT21ELEtBQVAsRUFBaUI7QUFDckMsd0JBQUluRCxLQUFLb0QsUUFBTCxFQUFKLEVBQXFCLENBQ3BCLENBREQsTUFDTztBQUNILDRCQUFJRCxVQUFVckUsZ0JBQWdCb0MsTUFBaEIsR0FBeUIsQ0FBdkMsRUFBMEM7QUFDdEMsbUNBQUttQyxVQUFMO0FBQ0EsZ0NBQUksQ0FBQ3JFLGdCQUFMLEVBQXVCO0FBQ25CLHVDQUFLaUUsYUFBTDtBQUNIO0FBQ0o7QUFDSjtBQUNKLGlCQVZEO0FBWUgsYUFiWSxFQWFWcEUsWUFiVSxDQUFiO0FBY0g7Ozs2Q0FFb0I7QUFDakIsaUJBQUtPLFlBQUwsQ0FBa0JrRSxTQUFsQixHQUE4QjFFLGdCQUFnQixDQUE5QztBQUNIOzs7NEJBOUhZO0FBQ1QsbUJBQU9zQixLQUFLQyxLQUFMLENBQVcsS0FBS2hCLElBQUwsR0FBWSxDQUF2QixDQUFQO0FBQ0g7OztrQ0E4SGdCb0UsSyxFQUFPOUMsSyxFQUFPO0FBQzNCOUIseUJBQWE0RSxNQUFNLENBQU4sQ0FBYixFQUF1QkEsTUFBTSxDQUFOLENBQXZCLEVBQWlDQyxnQkFBakMsQ0FBa0QvQyxLQUFsRDtBQUNIOzs7b0NBRWtCOEMsSyxFQUFPO0FBQ3RCLGdCQUFJO0FBQ0EsdUJBQU81RSxhQUFhNEUsTUFBTSxDQUFOLENBQWIsRUFBdUJBLE1BQU0sQ0FBTixDQUF2QixFQUFpQzVDLE9BQWpDLEVBQVA7QUFDSCxhQUZELENBRUUsT0FBTThDLEdBQU4sRUFBVztBQUNULHVCQUFPLEtBQVA7QUFDSDtBQUNKOzs7Ozs7Ozs7Ozs7O0FDbktMOztBQUVBcEUsU0FBU3FFLGFBQVQsQ0FBdUIsUUFBdkIsRUFBaUNWLGdCQUFqQyxDQUFrRCxPQUFsRCxFQUEyRFcsSUFBM0Q7O0FBRUEsSUFBSUMsY0FBSjs7QUFFQSxTQUFTRCxJQUFULEdBQWdCO0FBQ1osYUFBU0UsYUFBVCxHQUF5QjtBQUNyQixZQUFJQyxRQUFRLENBQUN6RSxTQUFTcUUsYUFBVCxDQUF1QixTQUF2QixFQUFrQ0ksS0FBL0M7O0FBRUEsZUFBT0EsU0FBUyxDQUFULElBQWNBLFNBQVMsRUFBdkIsR0FBNEJBLEtBQTVCLEdBQW9DLENBQTNDO0FBQ0g7O0FBRUQsUUFBSUYsS0FBSixFQUFXO0FBQ1B2RSxpQkFBU2tDLElBQVQsQ0FBY3dDLFdBQWQsQ0FBMEJILE1BQU16QyxTQUFoQztBQUNIOztBQUVEeUMsWUFBUSx5QkFBY0MsZUFBZCxDQUFSO0FBQ0gsQzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNsQkQsSUFBSUcsZUFBZSxvQkFBbkI7QUFBQSxJQUNJQyxjQURKOztJQUdhQyxVLFdBQUFBLFU7QUFDVCwwQkFBYztBQUFBOztBQUNWLGFBQUtyQyxHQUFMLEdBQVd4QyxTQUFTK0IsYUFBVCxDQUF1QixLQUF2QixDQUFYO0FBQ0EsYUFBS1MsR0FBTCxDQUFTUixTQUFULEdBQXFCLGFBQXJCO0FBQ0EsYUFBS1EsR0FBTCxDQUFTc0MsS0FBVCxDQUFlRixLQUFmLEdBQXVCLEtBQUtwQyxHQUFMLENBQVNzQyxLQUFULENBQWVDLE1BQWYsR0FBd0JILEtBQS9DO0FBQ0EsYUFBS3BDLEdBQUwsQ0FBU3NDLEtBQVQsQ0FBZUUsZUFBZixHQUFpQ0wsWUFBakM7QUFDSDs7Ozt5Q0FFZ0J2RCxLLEVBQU87QUFDcEIsaUJBQUtvQixHQUFMLENBQVNzQyxLQUFULENBQWVFLGVBQWYsR0FBaUM1RCxTQUFTdUQsWUFBMUM7QUFDSDs7O2tDQUVTO0FBQ04sbUJBQU8sS0FBS25DLEdBQUwsQ0FBU3NDLEtBQVQsQ0FBZUUsZUFBZixLQUFtQ0wsWUFBMUM7QUFDSDs7O2lDQUVlRixLLEVBQU87QUFDbkJHLG9CQUFRSCxLQUFSO0FBQ0g7Ozs7Ozs7Ozs7O0FDckJMOzs7Ozs7Ozs7QUFFQTs7OztBQUVBLElBQU1RLFNBQVMsQ0FDWDtBQUNJcEMsWUFBUSxDQURaO0FBRUl6QixXQUFPLFNBRlg7QUFHSVgsWUFBUSxDQUFDLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBRCxFQUFTLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBVCxFQUFpQixDQUFDLENBQUQsRUFBSSxDQUFKLENBQWpCLEVBQXlCLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBekIsQ0FIWjtBQUlJeUUscUJBQWlCLENBSnJCO0FBS0lDLG1CQUFlO0FBTG5CLENBRFcsRUFRWDtBQUNJdEMsWUFBUSxDQURaO0FBRUl6QixXQUFPLFNBRlg7QUFHSVgsWUFBUSxDQUFDLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBRCxFQUFTLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBVCxFQUFpQixDQUFDLENBQUQsRUFBSSxDQUFKLENBQWpCLEVBQXlCLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBekI7QUFIWixDQVJXLEVBYVg7QUFDSW9DLFlBQVEsQ0FEWjtBQUVJekIsV0FBTyxTQUZYO0FBR0lYLFlBQVEsQ0FBQyxDQUFDLENBQUQsRUFBSSxDQUFKLENBQUQsRUFBUyxDQUFDLENBQUQsRUFBSSxDQUFKLENBQVQsRUFBaUIsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFqQixFQUF5QixDQUFDLENBQUQsRUFBSSxDQUFKLENBQXpCO0FBSFosQ0FiVyxFQWtCWDtBQUNJVyxXQUFPLFNBRFg7QUFFSVgsWUFBUSxDQUFDLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBRCxFQUFTLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBVCxFQUFpQixDQUFDLENBQUQsRUFBSSxDQUFKLENBQWpCLEVBQXlCLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBekI7QUFGWixDQWxCVyxFQXNCWDtBQUNJb0MsWUFBUSxDQURaO0FBRUl6QixXQUFPLFNBRlg7QUFHSVgsWUFBUSxDQUFDLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBRCxFQUFTLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBVCxFQUFpQixDQUFDLENBQUQsRUFBSSxDQUFKLENBQWpCLEVBQXlCLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBekI7QUFIWixDQXRCVyxFQTJCWDtBQUNJb0MsWUFBUSxDQURaO0FBRUl6QixXQUFPLFNBRlg7QUFHSVgsWUFBUSxDQUFDLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBRCxFQUFTLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBVCxFQUFpQixDQUFDLENBQUQsRUFBSSxDQUFKLENBQWpCLEVBQXlCLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBekI7QUFIWixDQTNCVyxFQWdDWDtBQUNJb0MsWUFBUSxDQURaO0FBRUl6QixXQUFPLFNBRlg7QUFHSVgsWUFBUSxDQUFDLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBRCxFQUFTLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBVCxFQUFpQixDQUFDLENBQUQsRUFBSSxDQUFKLENBQWpCLEVBQXlCLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBekI7QUFIWixDQWhDVyxDQUFmOztJQXVDYTJFLE0sV0FBQUEsTTtBQUNULHNCQUFjO0FBQUE7O0FBQ1YsYUFBSzVFLE1BQUwsR0FBYzZFLE9BQU9DLE1BQVAsQ0FBYyxFQUFkLEVBQWtCTCxPQUFPcEUsS0FBS0MsS0FBTCxDQUFXRCxLQUFLMEUsTUFBTCxLQUFnQixDQUEzQixDQUFQLENBQWxCLENBQWQ7QUFDSDs7Ozt3Q0FFZTtBQUNaLGdCQUFJQyxTQUFTLElBQWI7O0FBRUEsaUJBQUtoRixNQUFMLENBQVlDLE1BQVosQ0FBbUJnQixPQUFuQixDQUEyQjtBQUFBLHVCQUFRK0QsU0FBU0EsVUFBVSxxQkFBVUMsV0FBVixDQUFzQjlFLElBQXRCLENBQTNCO0FBQUEsYUFBM0I7O0FBRUEsbUJBQU82RSxNQUFQO0FBQ0g7Ozt1Q0FFYzlDLEssRUFBTztBQUNsQixnQkFBSWdELHNCQUFzQixLQUFLbEYsTUFBTCxDQUFZQyxNQUFaLENBQW1CQyxHQUFuQixDQUF1QjtBQUFBLHVCQUFRLENBQUNDLEtBQUssQ0FBTCxJQUFVK0IsTUFBTSxDQUFOLENBQVgsRUFBcUIvQixLQUFLLENBQUwsSUFBVStCLE1BQU0sQ0FBTixDQUEvQixDQUFSO0FBQUEsYUFBdkIsQ0FBMUI7O0FBRUEsbUJBQU8sS0FBS2lELGtCQUFMLENBQXdCRCxtQkFBeEIsQ0FBUDtBQUNIOzs7MkNBRWtCdEUsSyxFQUFPO0FBQ3RCLGlCQUFLWixNQUFMLENBQVlDLE1BQVosQ0FBbUJDLEdBQW5CLENBQXVCO0FBQUEsdUJBQVEscUJBQVVrRixTQUFWLENBQW9CakYsSUFBcEIsRUFBMEJTLEtBQTFCLENBQVI7QUFBQSxhQUF2QjtBQUNIOzs7MkNBRWtCWCxNLEVBQVE7QUFBQTs7QUFDdkIsZ0JBQUlvRixVQUFVLElBQWQ7O0FBRUFwRixtQkFBT2dCLE9BQVAsQ0FBZSxnQkFBUTtBQUNuQixvQkFBSSxDQUFDLE1BQUtqQixNQUFMLENBQVlDLE1BQVosQ0FBbUJDLEdBQW5CLENBQXVCO0FBQUEsMkJBQVFDLEtBQUttRixRQUFMLEVBQVI7QUFBQSxpQkFBdkIsRUFBZ0R2RSxRQUFoRCxDQUF5RFosS0FBS21GLFFBQUwsRUFBekQsQ0FBTCxFQUFnRjtBQUM1RUQsOEJBQVVBLFdBQVcscUJBQVVKLFdBQVYsQ0FBc0I5RSxJQUF0QixDQUFyQjtBQUNIO0FBQ0osYUFKRDs7QUFNQSxtQkFBT2tGLE9BQVA7QUFDSDs7O2tDQUVTRSxRLEVBQVVyRCxLLEVBQU87QUFBQTs7QUFDdkIsZ0JBQUksS0FBS3NELGNBQUwsQ0FBb0J0RCxLQUFwQixDQUFKLEVBQWdDO0FBQzVCLHFCQUFLaEIsYUFBTCxDQUFtQjtBQUFBLDJCQUFNLE9BQUtsQixNQUFMLENBQVlDLE1BQVosQ0FBbUJDLEdBQW5CLENBQXVCO0FBQUEsK0JBQVFDLEtBQUtvRixRQUFMLEtBQWtCckQsTUFBTXFELFFBQU4sQ0FBMUI7QUFBQSxxQkFBdkIsQ0FBTjtBQUFBLGlCQUFuQjtBQUNBLHVCQUFPLElBQVA7QUFDSDs7QUFFRCxtQkFBTyxLQUFQO0FBQ0g7OzttQ0FFVTtBQUNQLG1CQUFPLEtBQUtFLFNBQUwsQ0FBZSxDQUFmLEVBQWtCLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBbEIsQ0FBUDtBQUNIOzs7bUNBRVU7QUFDUCxtQkFBTyxLQUFLQSxTQUFMLENBQWUsQ0FBZixFQUFrQixDQUFDLENBQUQsRUFBSSxDQUFDLENBQUwsQ0FBbEIsQ0FBUDtBQUNIOzs7b0NBRVc7QUFDUixtQkFBTyxLQUFLQSxTQUFMLENBQWUsQ0FBZixFQUFrQixDQUFDLENBQUQsRUFBSSxDQUFKLENBQWxCLENBQVA7QUFDSDs7O3NDQUVhQyxnQixFQUFrQjtBQUM1QixpQkFBSy9FLGtCQUFMO0FBQ0EsZ0JBQUkrRSw0QkFBNEJDLFFBQWhDLEVBQTBDO0FBQ3RDRDtBQUNIO0FBQ0QsaUJBQUsvRSxrQkFBTCxDQUF3QixLQUFLWCxNQUFMLENBQVlZLEtBQXBDO0FBQ0g7Ozt1Q0FFYztBQUFBOztBQUNYLGdCQUFJZ0YsUUFBUXZGLEtBQUt3RixFQUFMLEdBQVUsQ0FBdEI7QUFBQSxnQkFDSXhELFNBQVMsS0FBS3JDLE1BQUwsQ0FBWUMsTUFBWixDQUFtQixLQUFLRCxNQUFMLENBQVlxQyxNQUEvQixDQURiO0FBQUEsZ0JBRUlxQyxrQkFBa0IsS0FBSzFFLE1BQUwsQ0FBWTBFLGVBRmxDO0FBQUEsZ0JBR0lvQixnQkFISjtBQUFBLGdCQUdhQyxnQkFIYjtBQUFBLGdCQUlJQyw0QkFKSjs7QUFRQSxnQkFBSSxLQUFLaEcsTUFBTCxDQUFZMkUsYUFBaEIsRUFBK0I7QUFDM0Isb0JBQUlELGtCQUFrQixDQUFsQixLQUF3QixDQUE1QixFQUErQjtBQUMzQmtCLDRCQUFRLENBQUV2RixLQUFLd0YsRUFBUCxHQUFZLENBQXBCO0FBQ0g7QUFDRG5CLGtDQUFrQixDQUFDQSxrQkFBa0IsQ0FBbkIsSUFBd0IsQ0FBMUM7QUFDSDs7QUFFRHNCLGtDQUFzQixLQUFLaEcsTUFBTCxDQUFZQyxNQUFaLENBQW1CQyxHQUFuQixDQUF1QixnQkFBUTtBQUNqRCxvQkFBSUMsU0FBU2tDLE1BQWIsRUFBcUI7QUFDakIsMkJBQU9sQyxJQUFQO0FBQ0g7QUFDRDJGLDBCQUFVM0YsS0FBSyxDQUFMLENBQVY7QUFDQTRGLDBCQUFVNUYsS0FBSyxDQUFMLENBQVY7O0FBRUEsdUJBQU8sQ0FBQyxDQUFDMkYsVUFBVXpELE9BQU8sQ0FBUCxDQUFYLElBQXdCaEMsS0FBSzRGLEdBQUwsQ0FBU0wsS0FBVCxDQUF4QixHQUEwQyxDQUFDRyxVQUFVMUQsT0FBTyxDQUFQLENBQVgsSUFBd0JoQyxLQUFLNkYsR0FBTCxDQUFTTixLQUFULENBQWxFLEdBQW9GdkQsT0FBTyxDQUFQLENBQXJGLEVBQ0MsQ0FBQ3lELFVBQVV6RCxPQUFPLENBQVAsQ0FBWCxJQUF3QmhDLEtBQUs2RixHQUFMLENBQVNOLEtBQVQsQ0FBeEIsR0FBMEMsQ0FBQ0csVUFBVTFELE9BQU8sQ0FBUCxDQUFYLElBQXdCaEMsS0FBSzRGLEdBQUwsQ0FBU0wsS0FBVCxDQUFsRSxHQUFvRnZELE9BQU8sQ0FBUCxDQURyRixDQUFQO0FBRUgsYUFUcUIsQ0FBdEI7O0FBV0EsZ0JBQUksS0FBSzhDLGtCQUFMLENBQXdCYSxtQkFBeEIsQ0FBSixFQUFrRDtBQUM5QyxvQkFBSSxLQUFLaEcsTUFBTCxDQUFZMkUsYUFBaEIsRUFBK0I7QUFDM0IseUJBQUszRSxNQUFMLENBQVkwRSxlQUFaLEdBQThCQSxlQUE5QjtBQUNIO0FBQ0QscUJBQUt4RCxhQUFMLENBQW1CLFlBQU07QUFBRSwyQkFBS2xCLE1BQUwsQ0FBWUMsTUFBWixHQUFxQitGLG1CQUFyQjtBQUEyQyxpQkFBdEU7QUFDSDtBQUNKOzs7Ozs7Ozs7Ozs7Ozs7O0FDNUlMLElBQUk5RixZQUFKO0FBQUEsSUFDSWlHLHFCQUFxQjtBQUNqQnJELHFCQURpQiw2QkFDQ3NELElBREQsRUFDT0MsS0FEUCxFQUNjO0FBQzNCLFlBQUcsQ0FBQ25HLElBQUlvRyxHQUFKLENBQVFGLElBQVIsQ0FBRCxJQUFtQmxHLElBQUlvRyxHQUFKLENBQVFGLElBQVIsS0FBaUJsRyxJQUFJZ0QsR0FBSixDQUFRa0QsSUFBUixJQUFnQkMsS0FBdkQsRUFBK0Q7QUFDM0RuRyxnQkFBSXFHLEdBQUosQ0FBUUgsSUFBUixFQUFjQyxLQUFkO0FBQ0g7QUFDSixLQUxnQjtBQU1qQnBELGtCQU5pQiw0QkFNQTtBQUNiL0MsY0FBTSxJQUFJc0csR0FBSixFQUFOO0FBQ0EsWUFBSUMsYUFBYXBGLE1BQWIsS0FBd0IsQ0FBNUIsRUFBK0I7QUFDM0IsaUJBQUksSUFBSVIsSUFBSSxDQUFaLEVBQWVBLElBQUk0RixhQUFhcEYsTUFBaEMsRUFBd0MsRUFBRVIsQ0FBMUMsRUFBNkM7QUFDekNYLG9CQUFJcUcsR0FBSixDQUFRRSxhQUFhQyxHQUFiLENBQWlCN0YsQ0FBakIsQ0FBUixFQUE2QjRGLGFBQWFFLE9BQWIsQ0FBcUJGLGFBQWFDLEdBQWIsQ0FBaUI3RixDQUFqQixDQUFyQixDQUE3QjtBQUNIOztBQUVENEYseUJBQWFHLEtBQWI7QUFDSDs7QUFFRCxlQUFPMUcsR0FBUDtBQUNILEtBakJnQjtBQWtCakIwQyxpQkFsQmlCLDJCQWtCRDtBQUNaMUMsWUFBSWUsT0FBSixDQUFZLFVBQUNnRCxLQUFELEVBQVF5QyxHQUFSLEVBQWdCO0FBQ3hCRCx5QkFBYUksT0FBYixDQUFxQkgsR0FBckIsRUFBMEJ6QyxLQUExQjtBQUNILFNBRkQ7QUFHSDtBQXRCZ0IsQ0FEekI7O1FBMEJRa0Msa0IsR0FBQUEsa0IiLCJmaWxlIjoiLi9kaXN0L2J1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGdldHRlclxuIFx0XHRcdH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDEpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIDc2OWE3MWRhNzE0Y2E0MjI4ZmVlIiwiaW1wb3J0IHtFbXB0eUJsb2NrfSBmcm9tICcuL0VtcHR5QmxvY2suY2xhc3MnO1xuaW1wb3J0IHtGaWd1cmV9IGZyb20gJy4vRmlndXJlLmNsYXNzJztcbmltcG9ydCB7bG9jYWxTdG9yYWdlT2JqZWN0fSBmcm9tICcuL2xvY2FsU3RvcmFnZSc7XG5cbmNvbnN0IEdBTUVfQk9BUkRfU0laRSA9IDU1MCxcbiAgICBNSU5fU1BFRUQgPSA1MDAsXG4gICAgU1BFRURfUkVEVUNUSU9OID0gNTAwO1xuXG5sZXQgYmxvY2tzT25QYWdlLFxuICAgIGN1cnJlbnRTY29yZSxcbiAgICBjdXJyZW50U3BlZWQsXG4gICAgZWxlbWVudHNPbkJvYXJkLFxuICAgIGludGVydmFsSUQsXG4gICAgZ2FtZUZpbmlzaGVkRmxhZztcblxuZXhwb3J0IGNsYXNzIEdhbWVCb2FyZCB7XG4gICAgY29uc3RydWN0b3IobnVtYmVyT2ZCbG9ja3MpIHtcbiAgICAgICAgdGhpcy5zaXplID0gbnVtYmVyT2ZCbG9ja3M7XG4gICAgICAgIHRoaXMuc2NvcmVFbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Njb3JlJyk7XG4gICAgICAgIHRoaXMudXBkYXRlU2NvcmVFbGVtZW50KCk7XG4gICAgICAgIHRoaXMuc2V0SW5pdFZhbHVlcygpO1xuICAgICAgICB0aGlzLmRyYXdHYW1lQm9hcmQoKTtcbiAgICAgICAgdGhpcy5zdGFydEdhbWUoKTtcbiAgICB9XG5cbiAgICBnZXQgbWlkZGxlKCkge1xuICAgICAgICByZXR1cm4gTWF0aC5mbG9vcih0aGlzLnNpemUgLyAyKTtcbiAgICB9XG5cbiAgICBhZGROZXdFbGVtZW50KCkge1xuICAgICAgICBsZXQgbmV3RWxlbSA9IG5ldyBGaWd1cmUoKSxcbiAgICAgICAgICAgIHBvaW50c1hPZk5ld0VsZW0gPSBuZXdFbGVtLmZpZ3VyZS5ibG9ja3MubWFwKGl0ZW0gPT4gaXRlbVsxXSksXG4gICAgICAgICAgICBtaWRkbGUgPSB0aGlzLm1pZGRsZSAtIE1hdGguZmxvb3IoTWF0aC5tYXgoLi4ucG9pbnRzWE9mTmV3RWxlbSkgLyAyKTtcblxuICAgICAgICBuZXdFbGVtLmZpZ3VyZS5ibG9ja3MgPSBuZXdFbGVtLmZpZ3VyZS5ibG9ja3MubWFwKGl0ZW0gPT4gW2l0ZW1bMF0sIGl0ZW1bMV0gKyBtaWRkbGVdKTtcblxuICAgICAgICBpZiAobmV3RWxlbS5jYW5BZGRUb0JvYXJkKCkpIHtcbiAgICAgICAgICAgIGVsZW1lbnRzT25Cb2FyZC5wdXNoKG5ld0VsZW0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5maW5pc2hHYW1lKCk7XG4gICAgICAgIH1cbiAgICAgICAgbmV3RWxlbS5kcmF3RWxlbWVudE9uQm9hcmQobmV3RWxlbS5maWd1cmUuY29sb3IpO1xuICAgIH1cblxuICAgIGNoZWNrU2NvcmUoKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYmxvY2tzT25QYWdlLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICBpZighYmxvY2tzT25QYWdlW2ldLm1hcChpdGVtID0+IGl0ZW0uaXNFbXB0eSgpKS5pbmNsdWRlcyh0cnVlKSkge1xuICAgICAgICAgICAgICAgIHRoaXMubGV2ZWx1cCgpO1xuICAgICAgICAgICAgICAgIGVsZW1lbnRzT25Cb2FyZC5mb3JFYWNoKGl0ZW0gPT4gaXRlbS5yZWRyYXdFbGVtZW50KCgpID0+IGl0ZW0uZmlndXJlLmJsb2NrcyA9IGl0ZW0uZmlndXJlLmJsb2Nrcy5maWx0ZXIoZWxlbSA9PiBlbGVtWzBdICE9PSBpKSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZWxlbWVudHNPbkJvYXJkID0gZWxlbWVudHNPbkJvYXJkLmZpbHRlcihlbGVtID0+IGVsZW0uZmlndXJlLmJsb2Nrcy5sZW5ndGggIT09IDApO1xuICAgIH1cblxuICAgIGRyYXdHYW1lQm9hcmQoKSB7XG4gICAgICAgIHRoaXMuZ2FtZUJvYXJkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIHRoaXMuZ2FtZUJvYXJkLmNsYXNzTmFtZSA9ICdnYW1lJztcbiAgICAgICAgdGhpcy5nYW1lQm9hcmQudGFiSW5kZXggPSAnLTEnO1xuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRoaXMuZ2FtZUJvYXJkKTtcbiAgICAgICAgdGhpcy5nYW1lQm9hcmQuZm9jdXMoKTtcbiAgICAgICAgRW1wdHlCbG9jay5zZXRXaWR0aCgoR0FNRV9CT0FSRF9TSVpFIC8gdGhpcy5zaXplKS50b0ZpeGVkKDIpICsgJ3B4Jyk7XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnNpemU7ICsraSkge1xuICAgICAgICAgICAgYmxvY2tzT25QYWdlLnB1c2goW10pO1xuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCB0aGlzLnNpemU7ICsraikge1xuICAgICAgICAgICAgICAgIGJsb2Nrc09uUGFnZVtpXVtqXSA9IG5ldyBFbXB0eUJsb2NrKEdBTUVfQk9BUkRfU0laRSwgdGhpcy5zaXplKTtcbiAgICAgICAgICAgICAgICB0aGlzLmdhbWVCb2FyZC5hcHBlbmRDaGlsZChibG9ja3NPblBhZ2VbaV1bal0uYm94KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGV4ZWN1dGVLZXlEb3duQWN0aW9uKGV2ZW50KSB7XG4gICAgICAgIGxldCBzaGlmdCxcbiAgICAgICAgICAgIGVsZW1lbnQgPSBlbGVtZW50c09uQm9hcmRbZWxlbWVudHNPbkJvYXJkLmxlbmd0aCAtIDFdO1xuXG4gICAgICAgIHN3aXRjaChldmVudC5rZXlDb2RlKSB7XG4gICAgICAgIGNhc2UgMzI6XG4gICAgICAgICAgICBpZihlbGVtZW50LmZpZ3VyZS5jZW50ZXIgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIGVsZW1lbnQucm90YXRlRmlndXJlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAzNzpcbiAgICAgICAgICAgIGVsZW1lbnQubW92ZUxlZnQoKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDM5OlxuICAgICAgICAgICAgZWxlbWVudC5tb3ZlUmlnaHQoKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBkZWZhdWx0OiByZXR1cm47XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmaW5pc2hHYW1lKCkge1xuICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgdGhpcy5leGVjdXRlS2V5RG93bkFjdGlvbik7XG4gICAgICAgIGxvY2FsU3RvcmFnZU9iamVjdC51cGRhdGVTdG9yYWdlKCk7XG4gICAgICAgIGdhbWVGaW5pc2hlZEZsYWcgPSB0cnVlO1xuICAgICAgICBjbGVhckludGVydmFsKGludGVydmFsSUQpO1xuICAgIH1cblxuICAgIGxldmVsdXAoKSB7XG4gICAgICAgIGN1cnJlbnRTY29yZSArPSB0aGlzLnNpemU7XG4gICAgICAgIGxvY2FsU3RvcmFnZU9iamVjdC5hZGRWYWx1ZVRvU3RvcmFnZSgnY3VycmVudFNjb3JlJywgY3VycmVudFNjb3JlKTtcbiAgICAgICAgdGhpcy51cGRhdGVTY29yZUVsZW1lbnQoKTtcblxuICAgICAgICBjdXJyZW50U3BlZWQgPSBjdXJyZW50U3BlZWQgPT09IE1JTl9TUEVFRCA/IGN1cnJlbnRTcGVlZCA6IGN1cnJlbnRTcGVlZCAtIFNQRUVEX1JFRFVDVElPTjtcbiAgICAgICAgdGhpcy51cGRhdGVHYW1lU3BlZWQoKTtcbiAgICB9XG5cbiAgICBzZXRJbml0VmFsdWVzKCkge1xuICAgICAgICBzd2l0Y2goZ2FtZUZpbmlzaGVkRmxhZykge1xuICAgICAgICBjYXNlIHRydWU6XG4gICAgICAgIGNhc2UgJ3VuZGVmaW5lZCc6XG4gICAgICAgICAgICBjdXJyZW50U2NvcmUgPSAwO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICBjdXJyZW50U2NvcmUgPSBwYXJzZUludChsb2NhbFN0b3JhZ2VPYmplY3QuZ2V0RnJvbVN0b3JhZ2UoKS5nZXQoJ2N1cnJlbnRTY29yZScpKSB8fCAwO1xuICAgICAgICB9XG5cbiAgICAgICAgYmxvY2tzT25QYWdlID0gW107XG4gICAgICAgIGN1cnJlbnRTcGVlZCA9IDE1MDA7XG4gICAgICAgIGVsZW1lbnRzT25Cb2FyZCA9IFtdO1xuICAgICAgICBnYW1lRmluaXNoZWRGbGFnID0gZmFsc2U7XG4gICAgfVxuXG4gICAgc3RhcnRHYW1lKCkge1xuICAgICAgICB0aGlzLnVwZGF0ZVNjb3JlRWxlbWVudCgpO1xuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgdGhpcy5leGVjdXRlS2V5RG93bkFjdGlvbik7XG4gICAgICAgIHRoaXMuYWRkTmV3RWxlbWVudCgpO1xuICAgICAgICB0aGlzLnVwZGF0ZUdhbWVTcGVlZCgpO1xuICAgIH1cblxuICAgIHVwZGF0ZUdhbWVTcGVlZCgpIHtcbiAgICAgICAgY2xlYXJJbnRlcnZhbChpbnRlcnZhbElEKTtcbiAgICAgICAgaW50ZXJ2YWxJRCA9IHNldEludGVydmFsKCgpID0+IHtcbiAgICAgICAgICAgIGVsZW1lbnRzT25Cb2FyZC5mb3JFYWNoKChpdGVtLCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChpdGVtLm1vdmVEb3duKCkpIHtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpZiAoaW5kZXggPT09IGVsZW1lbnRzT25Cb2FyZC5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNoZWNrU2NvcmUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghZ2FtZUZpbmlzaGVkRmxhZykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYWRkTmV3RWxlbWVudCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfSwgY3VycmVudFNwZWVkKTtcbiAgICB9XG5cbiAgICB1cGRhdGVTY29yZUVsZW1lbnQoKSB7XG4gICAgICAgIHRoaXMuc2NvcmVFbGVtZW50LmlubmVyVGV4dCA9IGN1cnJlbnRTY29yZSB8fCAwO1xuICAgIH1cblxuICAgIHN0YXRpYyBkcmF3QmxvY2soYmxvY2ssIGNvbG9yKSB7XG4gICAgICAgIGJsb2Nrc09uUGFnZVtibG9ja1swXV1bYmxvY2tbMV1dLmNoYW5nZUJsb2NrU3R5bGUoY29sb3IpO1xuICAgIH1cblxuICAgIHN0YXRpYyB0cnlBZGRCbG9jayhibG9jaykge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgcmV0dXJuIGJsb2Nrc09uUGFnZVtibG9ja1swXV1bYmxvY2tbMV1dLmlzRW1wdHkoKTtcbiAgICAgICAgfSBjYXRjaChlcnIpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NjcmlwdHMvR2FtZUJvYXJkLmNsYXNzLmpzIiwiaW1wb3J0IHtHYW1lQm9hcmR9IGZyb20gJy4vR2FtZUJvYXJkLmNsYXNzJztcblxuZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3N0YXJ0JykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBpbml0KTtcblxubGV0IGJvYXJkO1xuXG5mdW5jdGlvbiBpbml0KCkge1xuICAgIGZ1bmN0aW9uIGdldElucHV0VmFsdWUoKSB7XG4gICAgICAgIGxldCB2YWx1ZSA9ICtkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjbnVtYmVyJykudmFsdWU7XG5cbiAgICAgICAgcmV0dXJuIHZhbHVlID49IDkgJiYgdmFsdWUgPD0gMTUgPyB2YWx1ZSA6IDk7XG4gICAgfVxuXG4gICAgaWYgKGJvYXJkKSB7XG4gICAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQoYm9hcmQuZ2FtZUJvYXJkKTtcbiAgICB9XG5cbiAgICBib2FyZCA9IG5ldyBHYW1lQm9hcmQoZ2V0SW5wdXRWYWx1ZSgpKTtcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NjcmlwdHMvaW5kZXguanMiLCJsZXQgZGVmYXVsdENvbG9yID0gJ3JnYigyMTYsIDIxNiwgMjE2KScsXG4gICAgd2lkdGg7XG5cbmV4cG9ydCBjbGFzcyBFbXB0eUJsb2NrIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5ib3ggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgdGhpcy5ib3guY2xhc3NOYW1lID0gJ2Jsb2NrLWVtcHR5JztcbiAgICAgICAgdGhpcy5ib3guc3R5bGUud2lkdGggPSB0aGlzLmJveC5zdHlsZS5oZWlnaHQgPSB3aWR0aDtcbiAgICAgICAgdGhpcy5ib3guc3R5bGUuYmFja2dyb3VuZENvbG9yID0gZGVmYXVsdENvbG9yO1xuICAgIH1cblxuICAgIGNoYW5nZUJsb2NrU3R5bGUoY29sb3IpIHtcbiAgICAgICAgdGhpcy5ib3guc3R5bGUuYmFja2dyb3VuZENvbG9yID0gY29sb3IgfHwgZGVmYXVsdENvbG9yO1xuICAgIH1cblxuICAgIGlzRW1wdHkoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmJveC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPT09IGRlZmF1bHRDb2xvcjtcbiAgICB9XG5cbiAgICBzdGF0aWMgc2V0V2lkdGgodmFsdWUpIHtcbiAgICAgICAgd2lkdGggPSB2YWx1ZTtcbiAgICB9XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zY3JpcHRzL0VtcHR5QmxvY2suY2xhc3MuanMiLCIndXNlIHN0cmljdCdcblxuaW1wb3J0IHtHYW1lQm9hcmR9IGZyb20gJy4vR2FtZUJvYXJkLmNsYXNzJztcblxuY29uc3QgQkxPQ0tTID0gW1xuICAgIHtcbiAgICAgICAgY2VudGVyOiAxLFxuICAgICAgICBjb2xvcjogJyM4MUY3RjMnLFxuICAgICAgICBibG9ja3M6IFtbMCwgMF0sIFswLCAxXSwgWzAsIDJdLCBbMCwgM11dLFxuICAgICAgICBjdXJyZW50UG9zaXRpb246IDAsXG4gICAgICAgIHNwZWNpYWxSb3RhdGU6IHRydWVcbiAgICB9LFxuICAgIHtcbiAgICAgICAgY2VudGVyOiAxLFxuICAgICAgICBjb2xvcjogJyM4MTgxRjcnLFxuICAgICAgICBibG9ja3M6IFtbMCwgMF0sIFswLCAxXSwgWzAsIDJdLCBbMSwgMl1dXG4gICAgfSxcbiAgICB7XG4gICAgICAgIGNlbnRlcjogMSxcbiAgICAgICAgY29sb3I6ICcjRkU5QTJFJyxcbiAgICAgICAgYmxvY2tzOiBbWzAsIDBdLCBbMCwgMV0sIFswLCAyXSwgWzEsIDBdXVxuICAgIH0sXG4gICAge1xuICAgICAgICBjb2xvcjogJyNGM0Y3ODEnLFxuICAgICAgICBibG9ja3M6IFtbMCwgMF0sIFswLCAxXSwgWzEsIDBdLCBbMSwgMV1dXG4gICAgfSxcbiAgICB7XG4gICAgICAgIGNlbnRlcjogMCxcbiAgICAgICAgY29sb3I6ICcjODFGNzgxJyxcbiAgICAgICAgYmxvY2tzOiBbWzAsIDFdLCBbMCwgMl0sIFsxLCAwXSwgWzEsIDFdXVxuICAgIH0sXG4gICAge1xuICAgICAgICBjZW50ZXI6IDEsXG4gICAgICAgIGNvbG9yOiAnI0RBODFGNScsXG4gICAgICAgIGJsb2NrczogW1swLCAwXSwgWzAsIDFdLCBbMCwgMl0sIFsxLCAxXV1cbiAgICB9LFxuICAgIHtcbiAgICAgICAgY2VudGVyOiAxLFxuICAgICAgICBjb2xvcjogJyNGNzgxODEnLFxuICAgICAgICBibG9ja3M6IFtbMCwgMF0sIFswLCAxXSwgWzEsIDFdLCBbMSwgMl1dXG4gICAgfVxuXTtcblxuZXhwb3J0IGNsYXNzIEZpZ3VyZSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuZmlndXJlID0gT2JqZWN0LmFzc2lnbih7fSwgQkxPQ0tTW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDcpXSk7XG4gICAgfVxuXG4gICAgY2FuQWRkVG9Cb2FyZCgpIHtcbiAgICAgICAgbGV0IGNhbkFkZCA9IHRydWU7XG5cbiAgICAgICAgdGhpcy5maWd1cmUuYmxvY2tzLmZvckVhY2goaXRlbSA9PiBjYW5BZGQgPSBjYW5BZGQgJiYgR2FtZUJvYXJkLnRyeUFkZEJsb2NrKGl0ZW0pKTtcblxuICAgICAgICByZXR1cm4gY2FuQWRkO1xuICAgIH1cblxuICAgIGNhbk1vdmVFbGVtZW50KHNoaWZ0KSB7XG4gICAgICAgIGxldCBwb3NzaWJsZU5ld1Bvc2l0aW9uID0gdGhpcy5maWd1cmUuYmxvY2tzLm1hcChpdGVtID0+IFtpdGVtWzBdICsgc2hpZnRbMF0sIGl0ZW1bMV0gKyBzaGlmdFsxXV0pO1xuXG4gICAgICAgIHJldHVybiB0aGlzLmlzRmlndXJlUG9zQ29ycmVjdChwb3NzaWJsZU5ld1Bvc2l0aW9uKTtcbiAgICB9XG5cbiAgICBkcmF3RWxlbWVudE9uQm9hcmQoY29sb3IpIHtcbiAgICAgICAgdGhpcy5maWd1cmUuYmxvY2tzLm1hcChpdGVtID0+IEdhbWVCb2FyZC5kcmF3QmxvY2soaXRlbSwgY29sb3IpKTtcbiAgICB9XG5cbiAgICBpc0ZpZ3VyZVBvc0NvcnJlY3QoYmxvY2tzKSB7XG4gICAgICAgIGxldCBjYW5Nb3ZlID0gdHJ1ZTtcblxuICAgICAgICBibG9ja3MuZm9yRWFjaChpdGVtID0+IHtcbiAgICAgICAgICAgIGlmICghdGhpcy5maWd1cmUuYmxvY2tzLm1hcChpdGVtID0+IGl0ZW0udG9TdHJpbmcoKSkuaW5jbHVkZXMoaXRlbS50b1N0cmluZygpKSkge1xuICAgICAgICAgICAgICAgIGNhbk1vdmUgPSBjYW5Nb3ZlICYmIEdhbWVCb2FyZC50cnlBZGRCbG9jayhpdGVtKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIGNhbk1vdmU7XG4gICAgfVxuXG4gICAgbW92ZUJsb2NrKHBvc2l0aW9uLCBzaGlmdCkge1xuICAgICAgICBpZiAodGhpcy5jYW5Nb3ZlRWxlbWVudChzaGlmdCkpIHtcbiAgICAgICAgICAgIHRoaXMucmVkcmF3RWxlbWVudCgoKSA9PiB0aGlzLmZpZ3VyZS5ibG9ja3MubWFwKGl0ZW0gPT4gaXRlbVtwb3NpdGlvbl0gKz0gc2hpZnRbcG9zaXRpb25dKSk7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBtb3ZlRG93bigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubW92ZUJsb2NrKDAsIFsxLCAwXSk7XG4gICAgfVxuXG4gICAgbW92ZUxlZnQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm1vdmVCbG9jaygxLCBbMCwgLTFdKTtcbiAgICB9XG5cbiAgICBtb3ZlUmlnaHQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm1vdmVCbG9jaygxLCBbMCwgMV0pO1xuICAgIH1cblxuICAgIHJlZHJhd0VsZW1lbnQoY2hhbmdlRmlndXJlRnVuYykge1xuICAgICAgICB0aGlzLmRyYXdFbGVtZW50T25Cb2FyZCgpO1xuICAgICAgICBpZiAoY2hhbmdlRmlndXJlRnVuYyBpbnN0YW5jZW9mIEZ1bmN0aW9uKSB7XG4gICAgICAgICAgICBjaGFuZ2VGaWd1cmVGdW5jKCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5kcmF3RWxlbWVudE9uQm9hcmQodGhpcy5maWd1cmUuY29sb3IpO1xuICAgIH1cblxuICAgIHJvdGF0ZUZpZ3VyZSgpIHtcbiAgICAgICAgbGV0IGFuZ2xlID0gTWF0aC5QSSAvIDIsXG4gICAgICAgICAgICBjZW50ZXIgPSB0aGlzLmZpZ3VyZS5ibG9ja3NbdGhpcy5maWd1cmUuY2VudGVyXSxcbiAgICAgICAgICAgIGN1cnJlbnRQb3NpdGlvbiA9IHRoaXMuZmlndXJlLmN1cnJlbnRQb3NpdGlvbixcbiAgICAgICAgICAgIG9sZFBvc1gsIG9sZFBvc1ksXG4gICAgICAgICAgICByb3RhdGVkRmlndXJlQmxvY2tzO1xuXG5cblxuICAgICAgICBpZiAodGhpcy5maWd1cmUuc3BlY2lhbFJvdGF0ZSkge1xuICAgICAgICAgICAgaWYgKGN1cnJlbnRQb3NpdGlvbiAlIDIgPT09IDEpIHtcbiAgICAgICAgICAgICAgICBhbmdsZSA9IC0gTWF0aC5QSSAvIDI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjdXJyZW50UG9zaXRpb24gPSAoY3VycmVudFBvc2l0aW9uICsgMSkgJSA0O1xuICAgICAgICB9XG5cbiAgICAgICAgcm90YXRlZEZpZ3VyZUJsb2NrcyA9IHRoaXMuZmlndXJlLmJsb2Nrcy5tYXAoaXRlbSA9PiB7XG4gICAgICAgICAgICBpZiAoaXRlbSA9PT0gY2VudGVyKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGl0ZW07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBvbGRQb3NYID0gaXRlbVswXTtcbiAgICAgICAgICAgIG9sZFBvc1kgPSBpdGVtWzFdO1xuXG4gICAgICAgICAgICByZXR1cm4gWyhvbGRQb3NYIC0gY2VudGVyWzBdKSAqIE1hdGguY29zKGFuZ2xlKSAtIChvbGRQb3NZIC0gY2VudGVyWzFdKSAqIE1hdGguc2luKGFuZ2xlKSArIGNlbnRlclswXSxcbiAgICAgICAgICAgICAgICAgICAgKG9sZFBvc1ggLSBjZW50ZXJbMF0pICogTWF0aC5zaW4oYW5nbGUpICsgKG9sZFBvc1kgLSBjZW50ZXJbMV0pICogTWF0aC5jb3MoYW5nbGUpICsgY2VudGVyWzFdXTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKHRoaXMuaXNGaWd1cmVQb3NDb3JyZWN0KHJvdGF0ZWRGaWd1cmVCbG9ja3MpKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5maWd1cmUuc3BlY2lhbFJvdGF0ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuZmlndXJlLmN1cnJlbnRQb3NpdGlvbiA9IGN1cnJlbnRQb3NpdGlvbjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMucmVkcmF3RWxlbWVudCgoKSA9PiB7IHRoaXMuZmlndXJlLmJsb2NrcyA9IHJvdGF0ZWRGaWd1cmVCbG9ja3M7IH0pO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc2NyaXB0cy9GaWd1cmUuY2xhc3MuanMiLCJsZXQgbWFwLFxuICAgIGxvY2FsU3RvcmFnZU9iamVjdCA9IHtcbiAgICAgICAgYWRkVmFsdWVUb1N0b3JhZ2UobmFtZSwgc2NvcmUpIHtcbiAgICAgICAgICAgIGlmKCFtYXAuaGFzKG5hbWUpIHx8IChtYXAuaGFzKG5hbWUpICYmIG1hcC5nZXQobmFtZSkgPCBzY29yZSkpIHtcbiAgICAgICAgICAgICAgICBtYXAuc2V0KG5hbWUsIHNjb3JlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgZ2V0RnJvbVN0b3JhZ2UoKSB7XG4gICAgICAgICAgICBtYXAgPSBuZXcgTWFwKCk7XG4gICAgICAgICAgICBpZiAobG9jYWxTdG9yYWdlLmxlbmd0aCAhPT0gMCkge1xuICAgICAgICAgICAgICAgIGZvcihsZXQgaSA9IDA7IGkgPCBsb2NhbFN0b3JhZ2UubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgICAgICAgICAgbWFwLnNldChsb2NhbFN0b3JhZ2Uua2V5KGkpLCBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShsb2NhbFN0b3JhZ2Uua2V5KGkpKSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlLmNsZWFyKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBtYXA7XG4gICAgICAgIH0sXG4gICAgICAgIHVwZGF0ZVN0b3JhZ2UoKSB7XG4gICAgICAgICAgICBtYXAuZm9yRWFjaCgodmFsdWUsIGtleSkgPT4ge1xuICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGtleSwgdmFsdWUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9O1xuXG5leHBvcnQge2xvY2FsU3RvcmFnZU9iamVjdH07XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zY3JpcHRzL2xvY2FsU3RvcmFnZS5qcyJdLCJzb3VyY2VSb290IjoiIn0=